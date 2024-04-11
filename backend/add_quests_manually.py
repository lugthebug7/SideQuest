from passlib.context import CryptContext
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
from app.models import Quests, Genres, QuestGenres

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

db = SessionLocal()


def convert_image_to_binary(image_path):
    with open(image_path, 'rb') as file:
        binary_data = file.read()
    return binary_data


def add_quest(title, quest_description, image_path):
    image = convert_image_to_binary(image_path)
    new_quest = Quests(title=title, description=quest_description, image=image, user_id=2)
    db.add(new_quest)
    db.commit()
    quest_genre = QuestGenres(quest_id=new_quest.id, genre_id=7)
    db.add(quest_genre)
    db.commit()
    db.close()
    print("Quest added.")


def main():
    print("Quest Name? ")
    title = input()
    print("Quest Description? ")
    quest_description = input()
    print("Image Path? ")
    image_path = input()
    add_quest(title, quest_description, image_path)


if __name__ == '__main__':
    main()




