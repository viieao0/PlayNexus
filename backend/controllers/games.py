from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import crud

from serializers.game import GameCreate, GameOut
from dependencies.get_current_user import get_db, get_current_company
from models.user import User

router = APIRouter(prefix="/games", tags=["Games"])

# ✅ GET ALL GAMES
@router.get("/", response_model=List[GameOut], operation_id="list_games")
def list_games(db: Session = Depends(get_db)):
    return crud.get_all_games(db)

# ✅ GET GAME BY ID (NEW)
@router.get("/{game_id}", response_model=GameOut, operation_id="get_game")
def get_game(game_id: int, db: Session = Depends(get_db)):
    game = crud.get_game_by_id(db, game_id)
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    return game

# ✅ CREATE GAME (company only)
@router.post("/", response_model=GameOut, operation_id="create_game")
def create_game(
    payload: GameCreate,
    db: Session = Depends(get_db),
    company: User = Depends(get_current_company)
):
    return crud.create_game(db, payload.dict(), company_id=company.id)
