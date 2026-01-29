# Database engine and session configuration

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from config.environment import db_URI
#create
engine = create_engine(db_URI)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)
#
Base = declarative_base()
