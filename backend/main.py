# backend/main.py
from fastapi import FastAPI
from app.api.endpoints import login, users, items

app = FastAPI()

app.include_router(login.router, prefix="/api/login", tags=["login"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(items.router, prefix="/api/items", tags=["items"])
