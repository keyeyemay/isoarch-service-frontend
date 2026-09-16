import os
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, Form, HTTPException, Query, Request, status
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from db.database import execute_raw_update_query, get_db
from db.models import IsotopicSignature, SignatureLike

router = APIRouter()
templates = Jinja2Templates(directory="templates")

MINIO_ENDPOINT = os.environ.get("MINIO_ENDPOINT", "http://localhost:9000")
MEDIA_BUCKET = os.environ.get("MEDIA_BUCKET", "isoarchservice")

# Текущий пользователь по умолчанию (в ЛР2 авторизация не требуется, фиксируем ID=1)
CURRENT_USER_ID = 1


def build_media_url(key: Optional[str], default_type: str = "image") -> str:
    """Формирование полного URL медиафайла с фоллбэком на SSR-ресурсы по умолчанию."""
    if not key or not str(key).strip():
        if default_type == "video":
            return "/static/videos/default_signature.mp4"
        return "/static/images/default_signature.png"

    key_str = str(key).strip()
    if key_str.startswith("http://") or key_str.startswith("https://") or key_str.startswith("/static/"):
        return key_str

    return f"{MINIO_ENDPOINT}/{MEDIA_BUCKET}/{key_str}"


def _with_display_fields(signature: IsotopicSignature) -> dict:
    """Преобразование сущности ORM в словарь с форматированными полями отображения."""
    image_url = build_media_url(signature.image_url, default_type="image")
    video_url = build_media_url(signature.video_url, default_type="video")

    n15_val = signature.delta_n15 if signature.delta_n15 is not None else 0.0
    c13_val = signature.delta_c13 if signature.delta_c13 is not None else 0.0

    analysis_date = signature.formation_date or signature.created_at

    return {
        "id": signature.id,
        "title": signature.title,
        "description": signature.description or "",
        "status": signature.status,
        "image_url": image_url,
        "video_url": video_url,
        "delta_n15": n15_val,
        "delta_c13": c13_val,
        "delta_n15_display": f"{n15_val:.1f} ‰",
        "delta_c13_display": f"{c13_val:.1f} ‰",
        "analysis_date_display": analysis_date.strftime("%d.%m.%Y") if analysis_date else "",
        "analysis_date_iso": analysis_date.strftime("%Y-%m-%d") if analysis_date else "",
        "likes_count": len(signature.likes) if signature.likes is not None else 0,
        "creator_id": signature.creator_id,
    }


def _first_published_id(db: Session) -> Optional[int]:
    first = (
        db.query(IsotopicSignature)
        .filter(IsotopicSignature.status == "опубликован")
        .order_by(IsotopicSignature.id.asc())
        .first()
    )
    return first.id if first else None


# ---------------------------------------------------------------------------
# 1. GET /list (ORM) — Каталог опубликованных сигнатур с фильтрацией по δ¹³C
# ---------------------------------------------------------------------------
@router.get("/list", name="tiles")
def get_tiles(
    request: Request,
    c13_max: str = "",
    filter: str = "",
    db: Session = Depends(get_db),
):
    query = db.query(IsotopicSignature).filter(IsotopicSignature.status == "опубликован")

    filter_param = c13_max.strip() if c13_max else filter.strip()
    is_filtered = False
    active_c13_val = -10.0

    if filter_param:
        try:
            val = float(filter_param)
            active_c13_val = val
            query = query.filter(IsotopicSignature.delta_c13 <= val)
            is_filtered = True
        except ValueError:
            query = query.filter(IsotopicSignature.title.ilike(f"%{filter_param}%"))
            is_filtered = True

    signatures_db = query.order_by(IsotopicSignature.id.asc()).all()
    signatures_display = [_with_display_fields(s) for s in signatures_db]

    context = {
        "signatures": signatures_display,
        "services": signatures_display,
        "c13_max": f"{active_c13_val:.1f}",
        "is_filtered": is_filtered,
        "feed_entry_id": _first_published_id(db),
    }
    return templates.TemplateResponse(request=request, name="tiles.html", context=context)


# ---------------------------------------------------------------------------
# 2. GET /feed/{signature_id} (ORM) — Лента опубликованной сигнатуры
# ---------------------------------------------------------------------------
@router.get("/feed/{signature_id}", name="feed_by_id")
def get_feed(
    request: Request,
    signature_id: int,
    go_next: bool = Query(False, alias="next"),
    db: Session = Depends(get_db),
):
    # Проверяем запрошенную запись в БД
    requested_sig = db.query(IsotopicSignature).filter(IsotopicSignature.id == signature_id).first()

    if requested_sig is not None and requested_sig.status == "удален":
        # Требование: удаленные услуги просматривать нельзя!
        return templates.TemplateResponse(
            request=request,
            name="deleted.html",
            context={
                "signature_id": signature_id,
                "title": requested_sig.title,
                "feed_entry_id": _first_published_id(db),
            },
            status_code=status.HTTP_404_NOT_FOUND,
        )

    published = (
        db.query(IsotopicSignature)
        .filter(IsotopicSignature.status == "опубликован")
        .order_by(IsotopicSignature.id.asc())
        .all()
    )

    if not published:
        raise HTTPException(status_code=404, detail="Нет опубликованных изотопных сигнатур")

    sig = next((s for s in published if s.id == signature_id), None)

    if sig is not None and go_next:
        ids = [s.id for s in published]
        current_index = ids.index(sig.id)
        sig = published[(current_index + 1) % len(published)]
    elif sig is None:
        sig = published[0]

    signature_display = _with_display_fields(sig)
    context = {
        "signature": signature_display,
        "service": signature_display,
        "feed_entry_id": published[0].id if published else None,
    }
    return templates.TemplateResponse(request=request, name="feed.html", context=context)


# ---------------------------------------------------------------------------
# 3. GET /draft (ORM) — Экран добавления / публикации черновика
# ---------------------------------------------------------------------------
@router.get("/draft", name="draft")
def get_draft(request: Request, db: Session = Depends(get_db)):
    # Ищем черновик текущего пользователя
    draft = (
        db.query(IsotopicSignature)
        .filter(
            IsotopicSignature.creator_id == CURRENT_USER_ID,
            IsotopicSignature.status == "черновик",
        )
        .first()
    )

    draft_display = _with_display_fields(draft) if draft else None
    has_draft = draft is not None

    context = {
        "draft": draft_display,
        "has_draft": has_draft,
        "default_image_url": "/static/images/default_signature.png",
        "default_video_url": "/static/videos/default_signature.mp4",
        "feed_entry_id": _first_published_id(db),
    }
    return templates.TemplateResponse(request=request, name="add.html", context=context)


# ---------------------------------------------------------------------------
# 4. POST /draft (ORM) — Шаг 1: Создание черновика при нажатии «Далее»
# ---------------------------------------------------------------------------
@router.post("/draft", name="create_draft")
def create_draft(
    title: str = Form(...),
    db: Session = Depends(get_db),
):
    # Проверяем, есть ли уже черновик у пользователя (не более одного черновика)
    existing_draft = (
        db.query(IsotopicSignature)
        .filter(
            IsotopicSignature.creator_id == CURRENT_USER_ID,
            IsotopicSignature.status == "черновик",
        )
        .first()
    )

    if not existing_draft:
        # Новые фото и видео в этой ЛР не сохраняются в БД, сохраняются пустые поля
        new_draft = IsotopicSignature(
            title=title.strip(),
            description="",
            status="черновик",
            image_url=None,
            video_url=None,
            delta_n15=0.0,
            delta_c13=-15.0,
            creator_id=CURRENT_USER_ID,
            created_at=datetime.utcnow(),
            formation_date=datetime.utcnow(),
        )
        db.add(new_draft)
        db.commit()

    return RedirectResponse(url="/draft", status_code=status.HTTP_303_SEE_OTHER)


# ---------------------------------------------------------------------------
# 5. POST /draft/publish (ORM) — Шаг 2: Публикация черновика карточки
# ---------------------------------------------------------------------------
@router.post("/draft/publish", name="publish_draft")
def publish_draft(
    description: str = Form(""),
    delta_n15: float = Form(0.0),
    delta_c13: float = Form(-15.0),
    analysis_date: Optional[str] = Form(None),
    db: Session = Depends(get_db),
):
    draft = (
        db.query(IsotopicSignature)
        .filter(
            IsotopicSignature.creator_id == CURRENT_USER_ID,
            IsotopicSignature.status == "черновик",
        )
        .first()
    )

    if not draft:
        raise HTTPException(status_code=400, detail="У вас нет активного черновика для публикации")

    draft.description = description.strip()
    draft.delta_n15 = float(delta_n15)
    draft.delta_c13 = float(delta_c13)

    if analysis_date:
        try:
            draft.formation_date = datetime.strptime(analysis_date, "%Y-%m-%d")
        except ValueError:
            draft.formation_date = datetime.utcnow()

    # Смена статуса на "опубликован" через ORM
    draft.status = "опубликован"
    db.commit()

    return RedirectResponse(
        url=f"/feed/{draft.id}",
        status_code=status.HTTP_303_SEE_OTHER,
    )


# ---------------------------------------------------------------------------
# 6. POST /signatures/{id}/delete (SQL UPDATE через курсор, без ORM)
# ---------------------------------------------------------------------------
@router.post("/signatures/{signature_id}/delete", name="delete_signature")
def delete_signature(signature_id: int):
    """Логическое удаление услуги выполнением сырого SQL UPDATE через курсор (без ORM)."""
    execute_raw_update_query(
        "UPDATE isotopic_signatures SET status = 'удален' WHERE id = %s",
        (signature_id,),
    )
    return RedirectResponse(url="/list", status_code=status.HTTP_303_SEE_OTHER)
