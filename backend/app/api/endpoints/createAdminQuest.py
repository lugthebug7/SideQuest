from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session
from ...database import SessionLocal
from sqlalchemy.exc import IntegrityError
from pydantic import ValidationError

from pydantic import BaseModel
from typing import List
import os
from dotenv import load_dotenv

from ...models import Users, Quests, Genres, QuestGenres

load_dotenv()

router = APIRouter()


class QuestRequest(BaseModel):
    title: str
    description: str
    objectives: List[str]
    genre_ids: List[int]
    image_binary: bytes


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/")
async def create_admin_quest(quest_request: QuestRequest, response: Response, db: Session = Depends(get_db)):
    title = quest_request.title
    description = quest_request.description
    objectives = quest_request.objectives
    genre_ids = quest_request.genre_ids
    image = quest_request.image_binary
    try:
        new_quest = Quests(title=title, description=description, image=image, user_id=2)
        db.add(new_quest)
        db.commit()
        new_quest.set_objectives([objectives])
        db.commit()
        for genre_id in genre_ids:
            quest_genre = QuestGenres(quest_id=new_quest.id, genre_id=genre_id)
            db.add(quest_genre)
            db.commit()
        response.status_code = status.HTTP_201_CREATED
        db.close()
        return {"message": "Quest added."}
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Quest creation failed due to database constraint violation.")
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=f"Invalid data provided: {e}")