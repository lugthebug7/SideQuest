import json

from fastapi import APIRouter, Depends, HTTPException, Response, status, File, UploadFile, Form
from sqlalchemy.orm import Session
from ...database import SessionLocal
from sqlalchemy.exc import IntegrityError
from pydantic import ValidationError
import logging

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


class QuestRequest(BaseModel):
    title: str
    description: str
    objectives: List[str]
    genre_ids: List[int]



# Okay, it seems the issue lies in either the objectives or the genres. When I try this, it works:
@router.post("/create")
async def create_admin_quest(title: str = Form(...), description: str = Form(...), objectives: str = Form(...),
                             genres: str = Form(...), image: UploadFile = File(...)):
    try:
        decoded_objectives = json.loads(objectives)
        decoded_genres = json.loads(genres)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail="Failed to decode objectives or genres")

    logging.info(f"Received title: {title}")
    logging.info(f"Received description: {description}")
    logging.info(f"Received objectives: {decoded_objectives}")
    logging.info(f"Received genres: {decoded_genres}")
    image_data = await image.read()
    logging.info(f"Received image with size: {len(image_data)} bytes")

    return {"message": "Received", "title": title, "description": description, "objectives": decoded_objectives,
            "genres": decoded_genres, "image_size": len(image_data)}




    try:
        new_quest = Quests(title=quest_request.title, description=quest_request.description, image=image_data, user_id=2)
        db.add(new_quest)
        db.commit()

        new_quest.set_objectives(quest_request.objectives)
        db.commit()

        for genre_id in quest_request.genre_ids:
            quest_genre = QuestGenres(quest_id=new_quest.id, genre_id=genre_id)
            db.add(quest_genre)
            db.commit()

        return {
            "message": "Quest added successfully.",
            "quest": {
                "id": new_quest.id,
                "title": new_quest.title,
                "description": new_quest.description,
                "objectives": quest_request.objectives,
                "genre_ids": quest_request.genre_ids
            }
        }
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Quest creation failed due to database constraint violation.")
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=f"Invalid data provided: {e}")

