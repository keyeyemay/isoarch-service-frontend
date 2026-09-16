import os
from datetime import date

MINIO_ENDPOINT = os.environ.get("MINIO_ENDPOINT", "http://localhost:9000")
MEDIA_BUCKET = os.environ.get("MEDIA_BUCKET", "isoarchservice")


def build_media_url(key: str) -> str:
    return f"{MINIO_ENDPOINT}/{MEDIA_BUCKET}/{key}"



isotopic_signatures_db = [
    {
        "id": 1,
        "title": "Погребение №14 (Бронза)",
        "description": (
            "Изотопный анализ δ¹⁵N и δ¹³C коллагена костных останков индивида "
            "из кургана бронзового века. Соотношение изотопов указывает на смешанный "
            "рацион с преобладанием мяса травоядных животных и умеренным потреблением злаков."
        ),
        "status": "опубликован",
        "delta_n15": 9.4, 
        "delta_c13": -18.2, 
        "analysis_date": date(2024, 3, 12),
        "image_key": "metallography_bronze_artifact.png",
        "video_key": "archaelogical_science_bone.mp4",
        "liked_by": [1, 2, 3, 4, 5, 6, 7, 8],
    },
    {
        "id": 2,
        "title": "Погребение №7 (Железный век)",
        "description": (
            "Анализ изотопных сигнатур указывает на высокую долю рыбы в рационе — "
            "индивид, вероятно, проживал в прибрежном поселении. Значения δ¹³C близки "
            "к эталонным для морских ресурсов."
        ),
        "status": "опубликован",
        "delta_n15": 12.7, 
        "delta_c13": -13.5, 
        "analysis_date": date(2024, 5, 2),
        "image_key": "c14_bone_dating.png",
        "video_key": "skull_bones.mp4",
        "liked_by": [1, 3, 5],
    },
    {
        "id": 3,
        "title": "Курган №2 (Скифы)",
        "description": (
            "Соотношение δ¹⁵N/δ¹³C соответствует преимущественно растительному рациону "
            "с высокой долей злаков (просо, ячмень) и минимальной долей мяса травоядных."
        ),
        "status": "опубликован",
        "delta_n15": 6.1, 
        "delta_c13": -21.8, 
        "analysis_date": date(2023, 11, 20),
        "image_key": "archaeobotany_seed_specimen.png",
        "video_key": "chemistry_lab_sample_preparation.mp4",
        "liked_by": [2, 4],
    },
    {
        "id": 4,
        "title": "Погребение №21 (Неолит)",
        "description": (
            "Ранний образец с преобладанием мяса травоядных и незначительной долей "
            "растительного компонента. Изотопные значения близки к эталонной группе "
            "«мясо травоядных»."
        ),
        "status": "опубликован",
        "delta_n15": 8.9,  
        "delta_c13": -19.5, 
        "analysis_date": date(2024, 1, 9),
        "image_key": "strontium_tooth_enamel.png",
        "video_key": "archaelogical_science_bone.mp4",
        "liked_by": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    },
    {
        "id": 5,
        "title": "Погребение №3 (Средневековье)",
        "description": (
            "Предварительный анализ образца костного коллагена. Требуется уточнение "
            "лабораторных данных перед публикацией."
        ),
        "status": "черновик",
        "delta_n15": 10.3,  
        "delta_c13": -16.7, 
        "analysis_date": date(2024, 6, 18),
        "image_key": "soil_core_stratigraphy.png",
        "video_key": "bioarchaelogy_lab_analysis.mp4",
        "liked_by": [],
    },
    {
        "id": 6,
        "title": "Погребение №9 (Античность)",
        "description": "Услуга снята с публикации, данные архивированы.",
        "status": "удален",
        "delta_n15": 7.5,  
        "delta_c13": -20.1, 
        "analysis_date": date(2023, 8, 1),
        "image_key": "ceramics_isotope_analysis.png",
        "video_key": "chemistry_lab_sample_preparation.mp4",
        "liked_by": [1],
    },
]

services_db = isotopic_signatures_db


def get_published_signatures():
    return [s for s in isotopic_signatures_db if s["status"] == "опубликован"]


def get_draft_signature():
    return next((s for s in isotopic_signatures_db if s["status"] == "черновик"), None)


def get_signature_by_id(signature_id, collection=None):
    source = collection if collection is not None else isotopic_signatures_db
    return next((s for s in source if s["id"] == signature_id), None)


get_published_services = get_published_signatures
get_draft_service = get_draft_signature
get_service_by_id = get_signature_by_id
