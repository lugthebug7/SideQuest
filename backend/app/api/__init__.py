from fastapi import APIRouter
from .endpoints import items, login, users, createAdminQuest, populateGenreCarousels

api_router = APIRouter()

api_router.include_router(items.router, prefix="/items", tags=["items"])
api_router.include_router(login.router, prefix="/login", tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(populateGenreCarousels.router, prefix="/populate", tags=["populateGenreCarousels"])
api_router.include_router(createAdminQuest.router, prefix="/adminCreate", tags=["createAdminQuest"])

