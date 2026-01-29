from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserRegister(BaseModel):
    name: str
    username: str
    email: EmailStr
    password: str
    role: str  # "company" or "youtuber"

    # Only youtuber needs this at signup:
    channel_url: Optional[str] = None

    # Optional company links at signup:
    website_url: Optional[str] = ""
    youtube_url: Optional[str] = ""

class UserLogin(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    username: str
    email: EmailStr
    role: str
    is_approved: bool
    website_url: str
    youtube_url: str
    created_at: datetime

    class Config:
        from_attributes = True
