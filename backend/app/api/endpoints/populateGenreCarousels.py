import base64
from fastapi import APIRouter, Depends, HTTPException
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
async def populate_carousel(genre_request: GenreRequest, db: Session = Depends(get_db)):
    try:
        quests = get_quests(db, genre_request.genre_id)
        quests_data = []
        for quest, genre_name in quests:
            quest_data = {
                "id": quest.id,
                "title": quest.title,
                "description": quest.description,
                "image": quest.image if quest.image else None,
                "genre": genre_name,
                "objective1": quest.objective1 if quest.objective1 else None,
                "objective2": quest.objective2 if quest.objective2 else None,
                "objective3": quest.objective3 if quest.objective3 else None,
                "objective4": quest.objective4 if quest.objective4 else None,
                "objective5": quest.objective5 if quest.objective5 else None
            }
            quests_data.append(quest_data)
        return {"quests_for_genre": quests_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




