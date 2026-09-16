from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates

from data.collections import (
    build_media_url,
    get_draft_signature,
    get_published_signatures,
    get_signature_by_id,
)

router = APIRouter()
templates = Jinja2Templates(directory="templates")


def _with_display_fields(signature: dict) -> dict:
    return {
        **signature,
        "image_url": build_media_url(signature["image_key"]),
        "video_url": build_media_url(signature["video_key"]),
        "likes_count": len(signature["liked_by"]),
        "delta_n15_display": f"{signature['delta_n15']:.1f} ‰",
        "delta_c13_display": f"{signature['delta_c13']:.1f} ‰",
        "analysis_date_display": signature["analysis_date"].strftime("%d.%m.%Y"),
        "analysis_date_iso": signature["analysis_date"].isoformat(),
    }


def _first_published_id():
    published = get_published_signatures()
    return published[0]["id"] if published else None


@router.get("/feed/{signature_id}", name="feed_by_id")
def get_feed(request: Request, signature_id: int, next: bool = False):
    published = get_published_signatures()
    signature = get_signature_by_id(signature_id, published)

    if signature is not None and next:
        ids = [s["id"] for s in published]
        current_index = ids.index(signature["id"])
        signature = published[(current_index + 1) % len(published)]
    elif signature is None and published:
        signature = published[0]

    signature_display = _with_display_fields(signature) if signature else None
    context = {
        "signature": signature_display,
        "service": signature_display,
        "feed_entry_id": _first_published_id(),
    }
    return templates.TemplateResponse(request=request, name="feed.html", context=context)


@router.get("/draft", name="draft")
def get_draft(request: Request):
    draft = get_draft_signature()
    draft_display = _with_display_fields(draft) if draft else None

    context = {
        "draft": draft_display,
        "feed_entry_id": _first_published_id(),
    }
    return templates.TemplateResponse(request=request, name="add.html", context=context)


@router.get("/list", name="tiles")
def get_tiles(request: Request, c13_max: str = "", filter: str = ""):
    signatures = [_with_display_fields(s) for s in get_published_signatures()]

    filter_param = c13_max.strip() if c13_max else filter.strip()
    is_filtered = False
    active_c13_val = -10.0  

    if filter_param:
        try:
            val = float(filter_param)
            active_c13_val = val
            signatures = [s for s in signatures if s["delta_c13"] <= val]
            is_filtered = True
        except ValueError:
            signatures = [
                s
                for s in signatures
                if filter_param in str(s["delta_c13"]) or filter_param in s["analysis_date_iso"]
            ]
            is_filtered = True

    context = {
        "signatures": signatures,
        "services": signatures,  
        "c13_max": f"{active_c13_val:.1f}",
        "is_filtered": is_filtered,
        "feed_entry_id": _first_published_id(),
    }
    return templates.TemplateResponse(request=request, name="tiles.html", context=context)

