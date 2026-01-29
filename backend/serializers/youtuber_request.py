from pydantic import BaseModel
from datetime import datetime

class YoutuberRequestOut(BaseModel):
    id: int
    youtuber_id: int
    channel_url: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
