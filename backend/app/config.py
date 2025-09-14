import os
from pathlib import Path

# --- General Config ---
UPLOAD_DIR = "temp"
os.makedirs(UPLOAD_DIR, exist_ok=True)

MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10 MB
OLLAMA_URL: str = "http://127.0.0.1:11434"

# --- Frontend Mock File ---
FRONTEND_DATA_FILE: Path = Path("../frontend/src/data/mockCandidates.ts")
