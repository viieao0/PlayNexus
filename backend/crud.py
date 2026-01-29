from sqlalchemy.orm import Session
from models.user import User
from models.game import Game
from models.review import Review
from models.youtuber_request import YoutuberRequest
from passlib.context import CryptContext

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ---------------- USERS ----------------
def create_user(db: Session, data: dict):
    password = data.pop("password")
    data["password_hash"] = pwd.hash(password)

    user = User(**data)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if not user:
        return None
    if not pwd.verify(password, user.password_hash):
        return None
    return user

def list_companies(db: Session):
    return db.query(User).filter(User.role == "company").all()

# ---------------- YOUTUBER REQUESTS ----------------
def create_youtuber_request(db: Session, youtuber_id: int, channel_url: str):
    existing = db.query(YoutuberRequest).filter(
        YoutuberRequest.youtuber_id == youtuber_id
    ).first()

    if existing:
        return existing

    req = YoutuberRequest(
        youtuber_id=youtuber_id,
        channel_url=channel_url,
        status="pending"
    )
    db.add(req)
    db.commit()
    db.refresh(req)
    return req

def list_requests(db: Session):
    return db.query(YoutuberRequest).all()

def approve_request(db: Session, request_id: int):
    req = db.query(YoutuberRequest).filter(YoutuberRequest.id == request_id).first()
    if not req:
        return None

    req.status = "approved"

    yt = db.query(User).filter(User.id == req.youtuber_id).first()
    if yt:
        yt.is_approved = True

    db.commit()
    db.refresh(req)
    return req

# ---------------- GAMES ----------------
def create_game(db: Session, data: dict, company_id: int):
    """
    ✅ IMPORTANT:
    If your serializer sends image_url (or any other fields),
    and your Game model has that column,
    then Game(**data, ...) will store it automatically.
    """
    game = Game(**data, company_id=company_id)
    db.add(game)
    db.commit()
    db.refresh(game)
    return game

def get_all_games(db: Session):
    return db.query(Game).all()

def get_game_by_id(db: Session, game_id: int):
    return db.query(Game).filter(Game.id == game_id).first()

def update_game(db: Session, game: Game, data: dict):
    for k, v in data.items():
        setattr(game, k, v)
    db.commit()
    db.refresh(game)
    return game

# ---------------- REVIEWS ----------------
def create_review(db: Session, data: dict, author_id: int):
    review = Review(**data, author_id=author_id)
    db.add(review)
    db.commit()
    db.refresh(review)
    return review

def get_reviews_by_game(db: Session, game_id: int):
    return db.query(Review).filter(Review.game_id == game_id).all()
