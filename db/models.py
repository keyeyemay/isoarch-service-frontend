from datetime import datetime
from sqlalchemy import (
    Column,
    DateTime,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=True)
    email = Column(String(255), unique=True, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    signatures = relationship(
        "IsotopicSignature",
        back_populates="creator",
        passive_deletes="all",  # Запрет каскадного удаления
    )
    likes = relationship(
        "SignatureLike",
        back_populates="user",
        passive_deletes="all",  # Запрет каскадного удаления
    )


class IsotopicSignature(Base):
    __tablename__ = "isotopic_signatures"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)  # Наименование
    description = Column(Text, nullable=True)  # Краткое описание
    status = Column(
        String(50), nullable=False, default="черновик"
    )  # Статус: черновик, опубликован, удален
    image_url = Column(String(500), nullable=True)  # URL / ключ к изображению
    video_url = Column(String(500), nullable=True)  # URL / ключ к видео

    # Два поля по предметной области (Вариант 18: изотопный состав костных останков)
    delta_n15 = Column(Float, nullable=True)  # δ¹⁵N (‰, азот)
    delta_c13 = Column(Float, nullable=True)  # δ¹³C (‰, углерод)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)  # Дата создания
    creator_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False,
    )  # Создатель (без каскадного удаления)
    formation_date = Column(
        DateTime, default=datetime.utcnow, nullable=True
    )  # Дата формирования

    creator = relationship("User", back_populates="signatures")
    likes = relationship(
        "SignatureLike",
        back_populates="signature",
        passive_deletes="all",  # Запрет каскадного удаления
    )

    __table_args__ = (
        # Ограничение: у каждого пользователя не более одной услуги в статусе черновик
        Index(
            "uq_user_single_draft",
            "creator_id",
            unique=True,
            postgresql_where=(status == "черновик"),
        ),
    )


class SignatureLike(Base):
    __tablename__ = "signature_likes"

    id = Column(Integer, primary_key=True, index=True)  # Первичный ключ
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False,
    )  # Внешний ключ пользователя
    signature_id = Column(
        Integer,
        ForeignKey("isotopic_signatures.id", ondelete="RESTRICT"),
        nullable=False,
    )  # Внешний ключ услуги
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="likes")
    signature = relationship("IsotopicSignature", back_populates="likes")

    __table_args__ = (
        UniqueConstraint("user_id", "signature_id", name="uq_user_signature_like"),
    )
