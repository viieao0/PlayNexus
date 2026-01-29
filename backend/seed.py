from database import SessionLocal, engine, Base
import models
import crud

Base.metadata.create_all(bind=engine)
db = SessionLocal()

company = crud.create_user(db, {
    "name": "PixelForge",
    "username": "pixelforge",
    "email": "pixel@mail.com",
    "password": "123456",
    "role": "company",
    "is_approved": True,
    "website_url": "https://pixelforge.com",
    "youtube_url": "https://youtube.com/@pixelforge"
})

game = crud.create_game(db, {
    "title": "Cyber Drift",
    "description": "Futuristic racing game",
    "release_year": 2025,
    "season": "Season 1",
    "chapters": "12 chapters",
    "trailer_youtube_url": "https://youtube.com/demo",
    "official_site_url": "https://cyberdrift.game"
}, company_id=company.id)

db.close()
print("Seed done.")
