from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from starlette.responses import PlainTextResponse

from ...database import SessionLocal

from passlib.context import CryptContext
from pydantic import BaseModel
from jose import JWTError, jwt
from datetime import datetime, timedelta

import base64

from pydantic import BaseModel
from dotenv import load_dotenv


from ...models import *

load_dotenv()

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class UserRequest(BaseModel):
    current_username: str


def get_progress_quests(db: Session, user_id: int):
    quests_in_progress = db.query(Quests). \
        join(QuestsInProgress, Quests.id == QuestsInProgress.quest_id). \
        join(Users, Users.id == QuestsInProgress.user_id). \
        filter(QuestsInProgress.user_id == user_id). \
        all()
    return quests_in_progress


def get_complete_quests(db: Session, user_id:int):
    quests_completed = db.query(Quests). \
        join(QuestsCompletedBy, Quests.id == QuestsCompletedBy.quest_id). \
        join(Users, Users.id == QuestsCompletedBy.user_id). \
        filter(QuestsCompletedBy.user_id == user_id). \
        all()
    return quests_completed


@router.post("/getUserQuests")
async def get_user_quests(user: UserRequest, db: Session = Depends(get_db)):
    try:
        current_user = db.query(Users).filter(Users.username == user.current_username).first()
        if not current_user:
            raise HTTPException(status_code=404, detail="User not found")
        user_id = current_user.id
        progress_quests = get_progress_quests(db, user_id)
        complete_quests = get_complete_quests(db, user_id)

        progress_quests_data = [format_quest_data(quest) for quest in progress_quests]
        complete_quests_data = [format_quest_data(quest) for quest in complete_quests]

        return {"complete_quests": complete_quests_data, "progress_quests": progress_quests_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def format_quest_data(quest):
    return {
        "id": quest.id,
        "title": quest.title,
        "description": quest.description,
        "image": quest.image if quest.image else None,
        "objective1": quest.objective1 if quest.objective1 else None,
        "objective2": quest.objective2 if quest.objective2 else None,
        "objective3": quest.objective3 if quest.objective3 else None,
        "objective4": quest.objective4 if quest.objective4 else None,
        "objective5": quest.objective5 if quest.objective5 else None
    }
