import json

from fastapi import APIRouter, Depends, HTTPException, Response, status, File, UploadFile, Form
from sqlalchemy.orm import Session
from ...database import SessionLocal
from sqlalchemy.exc import IntegrityError
from pydantic import ValidationError
import logging
from PIL import Image
import io

from pydantic import BaseModel
from typing import List
import os
from dotenv import load_dotenv

from ...models import *

load_dotenv()

router = APIRouter()
UPLOAD_DIRECTORY = "/Users/lukepotter/Desktop/sidequest_v3/uploads"


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class QuestRequest(BaseModel):
    title: str
    description: str
    objectives: List[str]
    genre_ids: List[int]


@router.post("/create")
async def create_admin_quest(user_name: str = Form(...), title: str = Form(...), description: str = Form(...), objectives: str = Form(...),
                             genres: str = Form(...), image: UploadFile = File(...), db: Session = Depends(get_db)):

    os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)
    user = db.query(Users).filter(Users.username == user_name).first()
    image_data = await image.read()
    image_obj = Image.open(io.BytesIO(image_data))
    if image_obj.mode != 'RGB':
        image_obj = image_obj.convert('RGB')

    filename = f"{title}_{image.filename}"
    safe_filename = "".join(c for c in filename if c.isalnum() or c in " ._").rstrip()
    file_path = os.path.join(UPLOAD_DIRECTORY, safe_filename)
    image_obj.save(file_path, format='JPEG', quality=85)
    try:
        decoded_objectives = json.loads(objectives)
        decoded_genres = json.loads(genres)
        new_quest = Quests(title=title, description=description, image=safe_filename, user_id=user.id)
        db.add(new_quest)
        db.commit()
        new_created_by = QuestsCreatedBy(quest_id=new_quest.id, user_id=user.id)
        db.add(new_created_by)
        new_quest.set_objectives(decoded_objectives)
        db.commit()
        for genre_id in decoded_genres:
            quest_genre = QuestGenres(quest_id=new_quest.id, genre_id=genre_id)
            db.add(quest_genre)
        db.commit()
        return {
            "message": "Quest added successfully.",
            "quest": {
                "id": new_quest.id,
                "title": new_quest.title,
                "description": new_quest.description,
                "objectives": decoded_objectives,
                "genre_ids": decoded_genres
            }
        }
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail="Failed to decode objectives or genres")
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Quest creation failed due to database constraint violation.")
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=f"Invalid data provided: {e}")

