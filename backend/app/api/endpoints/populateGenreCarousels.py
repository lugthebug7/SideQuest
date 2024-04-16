import base64
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ...database import SessionLocal
from pydantic import BaseModel
from dotenv import load_dotenv
from ...models import Quests, Genres, QuestGenres

load_dotenv()

router = APIRouter()


class GenreRequest(BaseModel):
    genre_id: int


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_quests(db: Session, genre_id: int):
    quests_for_genres = db.query(Quests, Genres.genre). \
        join(QuestGenres, Quests.id == QuestGenres.quest_id). \
        join(Genres, Genres.id == QuestGenres.genre_id). \
        filter(QuestGenres.genre_id == genre_id). \
        all()
    return quests_for_genres


@router.post("/populate")
async def login(genre_request: GenreRequest, db: Session = Depends(get_db)):
    quests = get_quests(db, genre_request.genre_id)
    quests_data = []
    for quest, genre in quests:
        quest_data = {
            "id": quest.id,
            "title": quest.title,
            "description": quest.description,
            "image": binary_to_base64(quest.image) if quest.image else None,
            "genre": genre
        }
        quests_data.append(quest_data)
    return {"quests_for_genre": quests_data}


def binary_to_base64(binary):
    return base64.b64encode(binary).decode('utf-8')



