import os
from datetime import date

MINIO_ENDPOINT = os.environ.get("MINIO_ENDPOINT", "http://localhost:9000")
MEDIA_BUCKET = os.environ.get("MEDIA_BUCKET", "isoarchservice")


def build_media_url(key: str) -> str:
    return f"{MINIO_ENDPOINT}/{MEDIA_BUCKET}/{key}"



services_db = [
    {
        "id": 1,
        "title": "Расчёт диеты — погребение №14, бронзовый век",
        "description": (
            "Изотопный анализ δ¹⁵N и δ¹³C коллагена костных останков индивида "
            "из кургана бронзового века. Соотношение изотопов указывает на смешанный "
            "рацион с преобладанием мяса травоядных животных и умеренным потреблением злаков."
        ),
        "status": "опубликован",
        "price": 4500.0,
        "analysis_date": date(2024, 3, 12),
        "image_key": "metallography_bronze_artifact.png",
        "video_key": "archaelogical_science_bone.mp4",
        "liked_by": [1, 2, 3, 4, 5, 6, 7, 8],
    },
    {
        "id": 2,
        "title": "Расчёт диеты — погребение №7, ранний железный век",
        "description": (
            "Анализ изотопных сигнатур указывает на высокую долю рыбы в рационе — "
            "индивид, вероятно, проживал в прибрежном поселении. Значения δ¹³C близки "
            "к эталонным для морских ресурсов."
        ),
        "status": "опубликован",
        "price": 5200.0,
        "analysis_date": date(2024, 5, 2),
        "image_key": "c14_bone_dating.png",
        "video_key": "bioarchaelogy_lab_analysis.mp4",
        "liked_by": [1, 3, 5],
    },
    {
        "id": 3,
        "title": "Расчёт диеты — курган №2, скифское время",
        "description": (
            "Соотношение δ¹⁵N/δ¹³C соответствует преимущественно растительному рациону "
            "с высокой долей злаков (просо, ячмень) и минимальной долей мяса травоядных."
        ),
        "status": "опубликован",
        "price": 3900.0,
        "analysis_date": date(2023, 11, 20),
        "image_key": "archaeobotany_seed_specimen.png",
        "video_key": "chemistry_lab_sample_preparation.mp4",
        "liked_by": [2, 4],
    },
    {
        "id": 4,
        "title": "Расчёт диеты — погребение №21, эпоха неолита",
        "description": (
            "Ранний образец с преобладанием мяса травоядных и незначительной долей "
            "растительного компонента. Изотопные значения близки к эталонной группе "
            "«мясо травоядных»."
        ),
        "status": "опубликован",
        "price": 6100.0,
        "analysis_date": date(2024, 1, 9),
        "image_key": "strontium_tooth_enamel.png",
        "video_key": "archaelogical_science_bone.mp4",
        "liked_by": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    },
    {
        "id": 5,
        "title": "Расчёт диеты — погребение №3, средневековье (черновик)",
        "description": (
            "Предварительный анализ образца костного коллагена. Требуется уточнение "
            "лабораторных данных перед публикацией."
        ),
        "status": "черновик",
        "price": 4800.0,
        "analysis_date": date(2024, 6, 18),
        "image_key": "soil_core_stratigraphy.png",
        "video_key": "bioarchaelogy_lab_analysis.mp4",
        "liked_by": [],
    },
    {
        "id": 6,
        "title": "Расчёт диеты — погребение №9, античность (архив)",
        "description": "Услуга снята с публикации, данные архивированы.",
        "status": "удален",
        "price": 4100.0,
        "analysis_date": date(2023, 8, 1),
        "image_key": "ceramics_isotope_analysis.png",
        "video_key": "chemistry_lab_sample_preparation.mp4",
        "liked_by": [1],
    },
]


def get_published_services():
    return [s for s in services_db if s["status"] == "опубликован"]


def get_draft_service():
    return next((s for s in services_db if s["status"] == "черновик"), None)


def get_service_by_id(service_id, collection=None):
    source = collection if collection is not None else services_db
    return next((s for s in source if s["id"] == service_id), None)
