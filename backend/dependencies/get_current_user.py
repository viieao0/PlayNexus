from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import SessionLocal
import jwt
from jwt import DecodeError, ExpiredSignatureError
from config.environment import secret
import crud

http_bearer = HTTPBearer()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(
    db: Session = Depends(get_db),
    token: HTTPAuthorizationCredentials = Depends(http_bearer)
):
    try:
        payload = jwt.decode(token.credentials, secret, algorithms=["HS256"])
        user_id = int(payload.get("sub"))
        user = crud.get_user_by_id(db, user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        return user
    except DecodeError:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Could not decode token")
    except ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Token has expired")

def get_current_company(user=Depends(get_current_user)):
    if user.role != "company":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized as company")
    return user

def get_current_youtuber(user=Depends(get_current_user)):
    if user.role != "youtuber":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized as youtuber")
    if not user.is_approved:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="YouTuber pending approval")
    return user
