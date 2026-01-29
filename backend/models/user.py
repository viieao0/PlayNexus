#TODO: extend user profile with social links

from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)

    name = Column(String, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, nullable=False)

    password_hash = Column(String, nullable=False)

    role = Column(String, nullable=False)  # "company" or "youtuber"

    # Approval logic for youtuber:
    is_approved = Column(Boolean, default=False)

    # Optional links for companies:
    website_url = Column(String, default="")
    youtube_url = Column(String, default="")

    created_at = Column(DateTime, default=datetime.utcnow)

    games = relationship("Game", back_populates="company", cascade="all, delete")
    reviews = relationship("Review", back_populates="author", cascade="all, delete")

    youtuber_request = relationship(
        "YoutuberRequest",
        back_populates="youtuber",
        uselist=False,
        cascade="all, delete"
    )
