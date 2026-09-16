import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://isoarch_user:isoarch_password@localhost:5432/isoarch_db",
)

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def execute_raw_update_query(sql: str, params: tuple = ()) -> None:
    """Выполнение сырого SQL-запроса через курсор (без ORM) для логического удаления."""
    raw_conn = engine.raw_connection()
    try:
        cursor = raw_conn.cursor()
        cursor.execute(sql, params)
        raw_conn.commit()
        cursor.close()
    finally:
        raw_conn.close()
