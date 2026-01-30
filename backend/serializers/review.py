# Review schemas used by youtuber submissions

from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import datetime

class ReviewCreate(BaseModel):
    game_id: int
    content: str
    rating: int
    youtube_url: Optional[HttpUrl] = None

class ReviewOut(BaseModel):
    id: int
    game_id: int
    author_id: int
    content: str
    rating: int
    youtube_url: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
