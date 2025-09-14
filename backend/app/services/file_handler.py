import os
import uuid
from fastapi import UploadFile, HTTPException
from ..config import UPLOAD_DIR, MAX_FILE_SIZE

def save_upload_file(file: UploadFile) -> str:
    """
    Save uploaded file temporarily and return its filepath.
    """
    content = file.file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large (max 10MB).")

    ext = os.path.splitext(file.filename)[1].lower()
    safe_filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(UPLOAD_DIR, safe_filename)

    with open(filepath, "wb") as f:
        f.write(content)

    return filepath


def cleanup_file(filepath: str) -> None:
    """
    Delete a temporary file if it exists.
    """
    if os.path.exists(filepath):
        os.remove(filepath)
