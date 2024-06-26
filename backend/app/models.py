# backend/app/models.py
from sqlalchemy import Column, Integer, String, LargeBinary, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from werkzeug.security import generate_password_hash, check_password_hash
import json

Base = declarative_base()
metadata = Base.metadata


class Users(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(64), index=True, unique=True)
    username = Column(String(64), index=True, unique=True)
    email = Column(String(120), index=True, unique=True)
    bio = Column(String(256), index=True)
    password_hash = Column(String(128))
    image = Column(String(256))
    admin = Column(Boolean, default=False)
    refresh_token = Column(String(256), index=True)

    quests_created = relationship('Quests', backref='creator', lazy='dynamic')
    review = relationship('Reviews', backref='author', lazy='dynamic')

    in_progress = relationship('QuestsInProgress', back_populates='user', lazy='dynamic')
    completed = relationship('QuestsCompletedBy', back_populates='user', lazy='dynamic')
    created_by = relationship('QuestsCreatedBy', back_populates='user', lazy='dynamic')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Quests(Base):
    __tablename__ = 'quests'
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(64), index=True, nullable=False, unique=True)
    description = Column(String(512), index=True)
    objective1 = Column(String(256), index=True)
    objective2 = Column(String(256), index=True)
    objective3 = Column(String(256), index=True)
    objective4 = Column(String(256), index=True)
    objective5 = Column(String(256), index=True)
    image = Column(String(256), index=True)

    user_id = Column(Integer, ForeignKey('users.id'))

    review = relationship('Reviews', backref='quest', lazy='dynamic')
    genre = relationship('QuestGenres', backref='quest', lazy='dynamic')

    users_in_progress = relationship('QuestsInProgress', back_populates='quest')
    users_completed_by = relationship('QuestsCompletedBy', back_populates='quest')
    users_created_by = relationship('QuestsCreatedBy', back_populates='quest')

    def set_objectives(self, objectives):
        for i, objective in enumerate(objectives):
            if len(objective) < 256:
                setattr(self, 'objective' + str(i + 1), objective)

    def get_objectives(self):
        objectives = []
        for i in range(1, 6):
            objective = getattr(self, 'objective' + str(i))
            if objective:
                objectives.append(objective)
        return objectives


class Reviews(Base):
    __tablename__ = 'reviews'
    id = Column(Integer, primary_key=True, autoincrement=True)
    review_text = Column(String(300), index=True)
    image = Column(LargeBinary)

    user_id = Column(Integer, ForeignKey("users.id"))
    quest_id = Column(Integer, ForeignKey("quests.id"))


class QuestsInProgress(Base):
    __tablename__ = 'questsinprogress'
    id = Column(Integer, primary_key=True, autoincrement=True)
    quest_id = Column(Integer, ForeignKey('quests.id'))
    user_id = Column(Integer, ForeignKey('users.id'))

    quest = relationship('Quests', back_populates='users_in_progress')
    user = relationship('Users', back_populates='in_progress')


class QuestsCompletedBy(Base):
    __tablename__ = 'questscompletedby'
    id = Column(Integer, primary_key=True, autoincrement=True)
    quest_id = Column(Integer, ForeignKey('quests.id'))
    user_id = Column(Integer, ForeignKey('users.id'))

    quest = relationship('Quests', back_populates='users_completed_by')
    user = relationship('Users', back_populates='completed')


class QuestsCreatedBy(Base):
    __tablename__ = 'questscreatedby'
    id = Column(Integer, primary_key=True, autoincrement=True)
    quest_id = Column(Integer, ForeignKey('quests.id'))
    user_id = Column(Integer, ForeignKey('users.id'))

    quest = relationship('Quests', back_populates='users_created_by')
    user = relationship('Users', back_populates='created_by')


class Genres(Base):
    __tablename__ = 'genres'
    id = Column(Integer, primary_key=True, autoincrement=True)
    genre = Column(String(64), index=True, unique=True)
    associatedQuests = relationship('QuestGenres', backref='genre', lazy='dynamic')


class QuestGenres(Base):
    __tablename__ = 'questgenres'
    id = Column(Integer, primary_key=True, autoincrement=True)
    quest_id = Column(Integer, ForeignKey('quests.id'))
    genre_id = Column(Integer, ForeignKey('genres.id'))

