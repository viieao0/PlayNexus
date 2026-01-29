from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from dependencies.get_current_user import get_db, get_current_company
from serializers.youtuber_request import YoutuberRequestOut
from typing import List
import crud

router = APIRouter(prefix="/requests", tags=["Requests"])

@router.get("/", response_model=List[YoutuberRequestOut])
def list_all_requests(
    db: Session = Depends(get_db),
    company=Depends(get_current_company)
):
    return crud.list_requests(db)

@router.post("/{request_id}/approve", response_model=YoutuberRequestOut)
def approve(
    request_id: int,
    db: Session = Depends(get_db),
    company=Depends(get_current_company)
):
    req = crud.approve_request(db, request_id)
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    return req
