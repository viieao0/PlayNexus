from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Game(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_key=True)

    title = Column(String, nullable=False)
    description = Column(Text, default="")
    release_year = Column(Integer, nullable=True)

    # you mentioned seasons/chapters/new updates
    season = Column(String, default="")
    chapters = Column(Text, default="")

    # links:
    trailer_youtube_url = Column(String, default="")
    official_site_url = Column(String, default="")
    image_url = Column(String, nullable=True)

    company_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    company = relationship("User", back_populates="games")
    reviews = relationship("Review", back_populates="game", cascade="all, delete")
