from fastapi import FastAPI
from app.api import api_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



origins = [
    "http://localhost:1000",
    "http://localhost:3000",
    "http://localhost:5000",
    "http://localhost:5001",
    "http://localhost:8000",
]

app.mount("/uploads", StaticFiles(directory="/Users/lukepotter/Desktop/sidequest_v3/uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origin_regex='https?://.*',  # Allows all HTTP and HTTPS origins
)


app.include_router(api_router)