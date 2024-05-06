from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ...database import SessionLocal

from passlib.context import CryptContext
from pydantic import BaseModel
from jose import JWTError, jwt
from datetime import datetime, timedelta


router = APIRouter()

@router.post("/getUserProgressQuests")
def get_user_progress_quests():
    pass

@router.post("/getUserCompleteQuests")
def get_user_complete_quests():
    pass
