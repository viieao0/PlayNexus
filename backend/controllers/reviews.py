from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from serializers.review import ReviewCreate, ReviewOut
from typing import List
import crud
from dependencies.get_current_user import get_current_youtuber, get_db
from models.user import User
from sqlalchemy.exc import IntegrityError

router = APIRouter(prefix="/reviews", tags=["Reviews"])


@router.get(
    "/game/{game_id}",
    response_model=List[ReviewOut],
    operation_id="get_reviews_by_game"
)
def get_reviews_by_game(game_id: int, db: Session = Depends(get_db)):
    return crud.get_reviews_by_game(db, game_id)


@router.post(
    "/",
    response_model=ReviewOut,
    operation_id="create_review"
)
def create_review(
    review: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_youtuber)
):
    try:
        return crud.create_review(db, review.dict(), author_id=current_user.id)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="You already reviewed this game")
