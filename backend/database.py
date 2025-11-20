from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# --- ANCIENNE CONFIG (SQLite) ---
# SQLALCHEMY_DATABASE_URL = "sqlite:///./travel.db"
# engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

# --- NOUVELLE CONFIG (PostgreSQL) ---
# Format : postgresql://UTILISATEUR:MOT_DE_PASSE@SERVEUR:PORT/NOM_DE_LA_BASE
# Remplace 'ton_mot_de_passe' par celui que tu as mis à l'installation
# Remplace 'ton_mot_de_passe' par celui que tu as tapé dans pgAdmin
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:admin@localhost:5434/aztravel_db"
# Note : On retire 'connect_args={"check_same_thread": False}' car Postgres gère ça tout seul
engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()