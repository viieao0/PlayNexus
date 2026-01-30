# Game schemas validate input/output for API

from pydantic import BaseModel
from typing import Optional

class GameCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    release_year: Optional[int] = None
    season: Optional[str] = ""
    chapters: Optional[str] = ""
    trailer_youtube_url: Optional[str] = ""
    official_site_url: Optional[str] = ""
    image_url: Optional[str] = None   # ✅ ADD THIS

class GameOut(BaseModel):
    id: int
    title: str
    description: Optional[str] = ""
    release_year: Optional[int] = None
    season: Optional[str] = ""
    chapters: Optional[str] = ""
    trailer_youtube_url: Optional[str] = ""
    official_site_url: Optional[str] = ""
    image_url: Optional[str] = None   # ✅ keep it optional

    company_id: int

    class Config:
        from_attributes = True
