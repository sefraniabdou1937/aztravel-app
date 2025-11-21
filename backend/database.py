import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# --- INTELLIGENCE CLOUD ---
# Le code cherche d'abord une variable 'DATABASE_URL' (donnée par Azure).
# S'il ne la trouve pas (sur ton PC), il utilise ton lien localhost.
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:admin@localhost:5434/aztravel_db" 
)

# Correctif pour certains hébergeurs qui utilisent postgres:// au lieu de postgresql://
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()