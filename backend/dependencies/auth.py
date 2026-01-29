import jwt
from datetime import datetime, timedelta
from config.environment import secret

def create_access_token(user_id: int, role: str, is_approved: bool):
    payload = {
        "sub": str(user_id),   # store as string
        "role": role,
        "approved": is_approved,
        "exp": datetime.utcnow() + timedelta(hours=2)
    }
    return jwt.encode(payload, secret, algorithm="HS256")
