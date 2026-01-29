import jwt
from datetime import datetime, timedelta
from config.environment import secret
import jwt
def create_access_token(user_id: int):
    payload = {
        "sub": str(user_id),   # store as string
        "exp": datetime.utcnow() + timedelta(hours=1)
    }
    return jwt.encode(payload, secret, algorithm="HS256")

