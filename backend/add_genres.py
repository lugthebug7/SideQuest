from passlib.context import CryptContext
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

db = SessionLocal()

the_genre = "Touch Grass"

try:
    db.execute(
        text("INSERT INTO Genres (genre) VALUES (:the_genre)"),
        {"the_genre": the_genre},
    )
    db.commit()
finally:
    db.close()

print("Added Genre.")