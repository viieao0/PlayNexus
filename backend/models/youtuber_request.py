from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class YoutuberRequest(Base):
    __tablename__ = "youtuber_requests"

    id = Column(Integer, primary_key=True)

    youtuber_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    channel_url = Column(String, default="")
    status = Column(String, default="pending")  # pending / approved / rejected
    created_at = Column(DateTime, default=datetime.utcnow)

    youtuber = relationship("User", back_populates="youtuber_request")
