from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from serializers.user import UserRegister, UserLogin, UserOut
from dependencies.get_current_user import get_db
from dependencies.auth import create_access_token
import crud

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/register", response_model=UserOut)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    if payload.role not in ("company", "youtuber"):
        raise HTTPException(status_code=400, detail="Role must be 'company' or 'youtuber'")

    existing_username = crud.get_user_by_username(db, payload.username)
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already taken")

    data = payload.dict()

    # For youtuber: start pending approval
    if payload.role == "youtuber":
        data["is_approved"] = False
    else:
        # Company can be active immediately
        data["is_approved"] = True

    # remove channel_url from user table (we store it in requests table)
    channel_url = data.pop("channel_url", None)

    user = crud.create_user(db, data)

    # if youtuber -> create request row
    if user.role == "youtuber":
        crud.create_youtuber_request(db, user.id, channel_url or "")

    return user

@router.post("/login")
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, payload.username, payload.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # If youtuber but not approved -> block
    if user.role == "youtuber" and not user.is_approved:
        raise HTTPException(status_code=403, detail="YouTuber pending approval")

    token = create_access_token(user.id, user.role, user.is_approved)
    return {"access_token": token, "role": user.role, "approved": user.is_approved, "user":user}
