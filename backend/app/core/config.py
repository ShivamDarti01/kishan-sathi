import os
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parents[2]
PROJECT_DIR = ROOT_DIR.parent


def _csv_env(name: str, default: str) -> list[str]:
    return [value.strip() for value in os.getenv(name, default).split(",") if value.strip()]


DATABASE_URL = os.getenv("DATABASE_URL")
DATABASE_PATH = Path(os.getenv("DATABASE_PATH", str(ROOT_DIR / "kishan_sathi.sqlite3")))
SECRET_KEY = os.getenv("SECRET_KEY", "local-development-key-change-before-deploy")
TOKEN_TTL_SECONDS = int(os.getenv("TOKEN_TTL_SECONDS", "86400"))
MAX_UPLOAD_BYTES = int(os.getenv("MAX_UPLOAD_BYTES", str(10 * 1024 * 1024)))
MAX_IMAGE_PIXELS = int(os.getenv("MAX_IMAGE_PIXELS", "25000000"))
MODEL_PATH = Path(os.getenv("MODEL_PATH", str(PROJECT_DIR / "models" / "leaf_disease_model.keras")))
LABELS_PATH = Path(os.getenv("LABELS_PATH", str(PROJECT_DIR / "ml" / "labels.json")))
MODEL_VERSION = os.getenv("MODEL_VERSION", "unconfigured")
ALLOWED_ORIGINS = _csv_env("ALLOWED_ORIGINS", "http://localhost:5173")
