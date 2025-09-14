import os
import json
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from ..services.file_handler import save_upload_file, cleanup_file
from ..services.text_extractor import extract_text
from ..services.llm_client import get_candidate_json
from ..services.candidate import append_candidate_to_mock
from ..logger import logger

router = APIRouter()

@router.post("/upload_cv_and_score/")
async def upload_cv_and_score(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    """
    Upload a CV + job description, extract text, 
    send to LLM, parse candidate JSON, update mockCandidates.
    """
    filepath = save_upload_file(file)

    try:
        ext = os.path.splitext(file.filename)[1].lower()
        text = extract_text(filepath, file.content_type, ext)

        candidate_json = await get_candidate_json(text, job_description)

        candidate = (
            json.loads(candidate_json["response"])
            if isinstance(candidate_json.get("response"), str)
            else candidate_json.get("response", candidate_json)
        )

        append_candidate_to_mock(candidate)
        return candidate
    finally:
        cleanup_file(filepath)
