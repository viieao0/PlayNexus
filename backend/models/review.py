# Review links youtuber feedback to games

from sqlalchemy import Column, Integer, Text, String, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True)

    game_id = Column(Integer, ForeignKey("games.id"), nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    content = Column(Text, nullable=False)
    rating = Column(Integer, nullable=False)  # stars 1..5
    youtube_url = Column(String, default="")

    created_at = Column(DateTime, default=datetime.utcnow)

    # One review per game per youtuber (prevents editing-by-duplicating)
    __table_args__ = (
        UniqueConstraint("game_id", "author_id", name="uq_review_game_author"),
    )

    game = relationship("Game", back_populates="reviews")
    author = relationship("User", back_populates="reviews")
