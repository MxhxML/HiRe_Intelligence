from typing import List, Dict
from ..logger import logger
from ..utils.ts_converter import json_to_ts
from ..config import FRONTEND_DATA_FILE
import re
import json
from datetime import date

def format_skills(skills: List[str]) -> List[Dict]:
    """Convert list of strings into list of skill dicts."""
    return [{"name": s, "type": "technical", "level": "intermediate"} for s in skills]

def update_candidates_with_metadata(candidates: list[dict]) -> list[dict]:
    """
    Normalize and enrich candidates with metadata:
    - Ensure score is an int (default = 0 if invalid).
    - Convert education field into a simple string if it's an object { grade, name }.
    - Convert skills from list[str] into structured list[dict].
    - Add id, rank, and totalCandidates to each candidate.
    - Sort candidates by score descending.
    """

    total = len(candidates)
    logger.info(f"Updating metadata for {total} candidates")

    for c in candidates:
        # --- Normalize score ---
        try:
            c["score"] = int(c.get("score", 0))
        except (ValueError, TypeError):
            logger.warning(f"⚠️ Invalid score for candidate {c.get('name')}, defaulting to 0")
            c["score"] = 0

        # --- Normalize education ---
        if isinstance(c.get("education"), dict):
            grade = c["education"].get("grade", "")
            name = c["education"].get("name", "")
            c["education"] = f"{grade} {name}".strip()
            logger.info(f"Converted education object → string: {c['education']}")

        # --- Normalize skills ---
        if isinstance(c.get("skills"), list):
            if all(isinstance(s, str) for s in c["skills"]):
                c["skills"] = format_skills(c["skills"])  # reuse your helper

    # --- Sort by score ---
    sorted_by_score = sorted(candidates, key=lambda c: c["score"], reverse=True)

    # --- Assign id, rank, totalCandidates ---
    for idx, candidate in enumerate(sorted_by_score, start=1):
        candidate["id"] = str(idx)
        candidate["rank"] = idx
        candidate["totalCandidates"] = len(sorted_by_score)
        candidate["appliedDate"] = date.today().isoformat()

    logger.info(f"✅ Metadata updated for candidates: {[c['name'] for c in sorted_by_score]}")

    return sorted_by_score

from typing import Dict
from ..config import FRONTEND_DATA_FILE
from ..logger import logger
from ..utils.ts_converter import json_to_ts
import re

def append_candidate_to_mock(new_candidate: dict) -> None:
    """
    Append a new candidate to mockCandidates.ts and update metadata for all candidates:
    - id, rank, totalCandidates
    - appliedDate (today)
    - normalize skills and education
    """

    logger.info(f"Reading mock file: {FRONTEND_DATA_FILE.resolve()}")
    content = FRONTEND_DATA_FILE.read_text(encoding="utf-8")

    # --- Find start and end of the array ---
    array_start_match = re.search(r"(export\s+const\s+mockCandidates\s*:\s*Candidate\[\]\s*=\s*\[)", content)
    if not array_start_match:
        logger.error("❌ mockCandidates array start not found in file")
        raise ValueError("mockCandidates array not found")
    start_idx = array_start_match.end()
    end_idx = content.rfind("];")
    if end_idx == -1:
        logger.error("❌ mockCandidates array end not found in file")
        raise ValueError("mockCandidates array closing not found")

    # --- Parse existing candidates ---
    existing_block = content[start_idx:end_idx].strip()
    if existing_block:
        try:
            existing_candidates = json.loads(f"[{existing_block}]")
        except Exception as e:
            logger.error(f"Failed to parse existing candidates: {e}")
            existing_candidates = []
    else:
        existing_candidates = []

    # --- Append new candidate ---
    existing_candidates.append(new_candidate)

    # --- Update metadata (id, rank, totalCandidates, appliedDate) ---
    updated_candidates = update_candidates_with_metadata(existing_candidates)

    # --- Convert all candidates back to TypeScript string ---
    candidates_ts_list = [json.dumps(c, indent=2, ensure_ascii=False) for c in updated_candidates]
    candidates_block = ",\n".join(candidates_ts_list)

    # --- Replace old array with new array ---
    new_content = content[:start_idx] + "\n" + candidates_block + "\n" + content[end_idx:]
    FRONTEND_DATA_FILE.write_text(new_content, encoding="utf-8")
    logger.info(f"✅ mockCandidates.ts updated successfully with {len(updated_candidates)} candidates")

