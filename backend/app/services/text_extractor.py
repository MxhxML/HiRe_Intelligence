import pdfplumber
import docx2txt
from fastapi import HTTPException

def extract_text_from_pdf(path: str) -> str:
    """Extract plain text from PDF file."""
    with pdfplumber.open(path) as pdf:
        return "\n".join(page.extract_text() or "" for page in pdf.pages)

def extract_text_from_docx(path: str) -> str:
    """Extract plain text from DOCX file."""
    return docx2txt.process(path)

def extract_text(filepath: str, content_type: str, ext: str) -> str:
    """
    Extract text depending on file type.
    """
    if content_type == "application/pdf":
        return extract_text_from_pdf(filepath)
    elif content_type in [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword"
    ]:
        if ext == ".docx":
            return extract_text_from_docx(filepath)
        raise HTTPException(status_code=400, detail="Unsupported .doc format")
    raise HTTPException(status_code=400, detail="Only PDF and DOCX are supported")
