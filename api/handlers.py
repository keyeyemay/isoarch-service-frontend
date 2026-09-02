from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates

from data.collections import (
    build_media_url,
    get_draft_service,
    get_published_services,
    get_service_by_id,
)

router = APIRouter()
templates = Jinja2Templates(directory="templates")


def _with_display_fields(service: dict) -> dict:
    return {
        **service,
        "image_url": build_media_url(service["image_key"]),
        "video_url": build_media_url(service["video_key"]),
        "likes_count": len(service["liked_by"]),
        "price_display": f"{service['price']:,.0f}".replace(",", " "),
        "analysis_date_display": service["analysis_date"].strftime("%d.%m.%Y"),
        "analysis_date_iso": service["analysis_date"].isoformat(),
    }


def _first_published_id():
    published = get_published_services()
    return published[0]["id"] if published else None


@router.get("/feed/{service_id}", name="feed_by_id")
def get_feed(request: Request, service_id: int, next: bool = False):
    published = get_published_services()
    service = get_service_by_id(service_id, published)

    if service is not None and next:
        ids = [s["id"] for s in published]
        current_index = ids.index(service["id"])
        service = published[(current_index + 1) % len(published)]
    elif service is None and published:
        service = published[0]

    context = {
        "service": _with_display_fields(service) if service else None,
        "feed_entry_id": _first_published_id(),
    }
    return templates.TemplateResponse(request=request, name="feed.html", context=context)


@router.get("/draft", name="draft")
def get_draft(request: Request):
    draft = get_draft_service()

    context = {
        "draft": _with_display_fields(draft) if draft else None,
        "feed_entry_id": _first_published_id(),
    }
    return templates.TemplateResponse(request=request, name="add.html", context=context)


@router.get("/list", name="tiles")
def get_tiles(request: Request, filter: str = ""):
    services = [_with_display_fields(s) for s in get_published_services()]

    filter_value = filter.strip()
    if filter_value:
        services = [
            s
            for s in services
            if filter_value in str(s["price"]) or filter_value in s["analysis_date_iso"]
        ]

    context = {
        "services": services,
        "filter_value": filter_value,
        "feed_entry_id": _first_published_id(),
    }
    return templates.TemplateResponse(request=request, name="tiles.html", context=context)
