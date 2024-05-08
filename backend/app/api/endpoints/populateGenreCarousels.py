import base64
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...database import SessionLocal
from pydantic import BaseModel
from dotenv import load_dotenv
from ...models import *

load_dotenv()

router = APIRouter()


class GenreRequest(BaseModel):
    genre_id: int


class UserQuestStatusRequest(BaseModel):
    username: str
    quest_id: int

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


@router.post("/userstatus")
async def get_user_quest_status(user_request: UserQuestStatusRequest, db: Session = Depends(get_db)):
    username = user_request.username
    quest_id = user_request.quest_id
    try:
        user = db.query(Users).filter(
            Users.username == username
        ).first()
        user_quest_status = db.query(QuestsInProgress).filter(QuestsInProgress.user_id == user.id).filter(QuestsInProgress.quest_id == quest_id).first()
        if user_quest_status:
            return {"user_quest_status": "in_progress"}
        else:
            user_quest_status = db.query(QuestsCompletedBy).filter(QuestsCompletedBy.user_id == user.id).filter(QuestsCompletedBy.quest_id == quest_id).first()
            if user_quest_status:
                return {"user_quest_status": "completed"}
            else:
                return {"user_quest_status": "not_started"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/track")
async def mark_as_tracked(user_request: UserQuestStatusRequest, db: Session = Depends(get_db)):
    try:
        user = db.query(Users).filter(
            Users.username == user_request.username
        ).first()
        new_status = QuestsInProgress(
            user_id=user.id,
            quest_id=user_request.quest_id,
        )
        db.add(new_status)
        db.commit()
        return {"message": "Quest marked as in progress successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/untrack")
async def mark_as_untracked(user_request: UserQuestStatusRequest, db: Session = Depends(get_db)):
    try:
        user = db.query(Users).filter(
            Users.username == user_request.username
        ).first()

        existing_status = db.query(QuestsInProgress).filter(
            QuestsInProgress.user_id == user.id,
            QuestsInProgress.quest_id == user_request.quest_id
        ).first()
        db.delete(existing_status)
        db.commit()
        return {"message": "Quest Untracked"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/complete")
async def mark_as_completed(user_request: UserQuestStatusRequest, db: Session = Depends(get_db)):
    try:
        user = db.query(Users).filter(
            Users.username == user_request.username
        ).first()
        new_status = QuestsCompletedBy(
            user_id=user.id,
            quest_id=user_request.quest_id,
        )
        existing_status = db.query(QuestsInProgress).filter(
            QuestsInProgress.user_id == user.id,
            QuestsInProgress.quest_id == user_request.quest_id
        ).first()
        db.delete(existing_status)
        db.add(new_status)
        db.commit()
        return {"message": "Quest marked as completed successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/get3FeaturedQuests")
async def get_3_featured_quests(db: Session = Depends(get_db)):
    try:
        quest1 = db.query(Quests).filter(Quests.id == 16).first()
        quest2 = db.query(Quests).filter(Quests.id == 17).first()
        quest3 = db.query(Quests).filter(Quests.id == 18).first()
        quests_data = []
        for quest in [quest1, quest2, quest3]:
            quest_data = {
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
            quests_data.append(quest_data)
        return {"featured_quests": quests_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))