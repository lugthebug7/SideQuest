# backend/app/models.py
from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
metadata = Base.metadata

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(50), unique=True, nullable=False)
    password = Column(String(50), nullable=False)
    bio = Column(String(300), nullable=True)


class Item(Base):
    __tablename__ = 'items'
    id = Column(Integer, primary_key=True)
    title = Column(String(50), unique=True, nullable=False)
    description = Column(String(50), nullable=False)
    owner = Column(Integer, nullable=False)