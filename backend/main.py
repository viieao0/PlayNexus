from fastapi import FastAPI
from database import Base, engine
import models  # IMPORTANT: ensure models are imported before create_all
from controllers import users, games, reviews, requests
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="PlayNexus API", redirect_slashes=False)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)

app.include_router(users.router)
app.include_router(games.router)
app.include_router(reviews.router)
app.include_router(requests.router)

@app.get("/")
def home():
    return {"status": "PlayNexus API running"}
