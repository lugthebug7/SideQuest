from passlib.context import CryptContext
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import os

# Initialize the password context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# User details
username = "lugthebug"
password = "crapBug379?!."

# Hash the password
hashed_password = pwd_context.hash(password)

# Database connection
DATABASE_URL = "mysql+pymysql://lugthebug:crapBug379?!.@localhost/sidequestdb2"  # Adjust this to your actual database URL
engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Insert the user
db = SessionLocal()
try:
    db.execute(
        text("INSERT INTO Users (username, password_hash) VALUES (:username, :hashed_password)"),
        {"username": username, "hashed_password": hashed_password},
    )
    db.commit()
finally:
    db.close()

print("User added with hashed password.")
