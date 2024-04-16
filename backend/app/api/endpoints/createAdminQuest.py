import json

from fastapi import APIRouter, Depends, HTTPException, Response, status, File, UploadFile
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


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/create")
async def create_admin_quest(title: str, description: str, objectives: str, genre_ids: str, image: UploadFile = File(...), db: Session = Depends(get_db)):
    objectives = json.loads(objectives)
    genre_ids = json.loads(genre_ids)
    image_data = await image.read()
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
        db.close()
        # this response should be fixed. What would be good in here?
        return {
            "message": "Quest added successfully.",
            "quest": {
                "id": new_quest.id,
                "title": new_quest.title,
                "description": new_quest.description,
                "objectives": objectives,  # Assuming these are set correctly in the Quest model
                "genre_ids": genre_ids
            }
        }
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Quest creation failed due to database constraint violation.")
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=f"Invalid data provided: {e}")

