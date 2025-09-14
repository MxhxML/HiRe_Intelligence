import json
import re
import httpx
from fastapi import HTTPException
from ..config import OLLAMA_URL

async def get_candidate_json(cv_text: str, job_description: str) -> dict:
    """
    Send CV text + job description to the LLM to generate candidate JSON.
    """
    prompt = f"""
You are an expert recruiter.
Here is the job description:
---
{job_description}
---
Here is the candidate CV:
---
{cv_text}
---
Your task: return a JSON object with the following fields:
name, email, phone, location, position, experience (the total number of year actually worked), education (the name of the highest grade),
score (the candidate's suitability for the position), skills (array of objects: name, type(fill the field only with these words : soft, technical, leadership, language), level(fill the field only with these words: beginner, intermediate, advanced, or expert)), summary. de la sorte par exemple: {{
    "name": "Sarah Martinez",
    "email": "sarah.martinez@email.com",
    "phone": "+33 6 12 34 56 78",
    "location": "Paris, France",
    "position": "Développeuse Full Stack Senior",
    "experience": "5 ans",
    "education": "Master Informatique",
    "score": 92,
    "skills": [
      {{
        "name": "React",
        "type": "technical",
        "level": "expert"
      }},
      {{
        "name": "Node.js",
        "type": "technical",
        "level": "advanced"
      }},
      {{
        "name": "Leadership",
        "type": "leadership",
        "level": "advanced"
      }},
      {{
        "name": "Communication",
        "type": "soft",
        "level": "expert"
      }},
      {{
        "name": "Anglais",
        "type": "language",
        "level": "expert"
      }},
      {{
        "name": "TypeScript",
        "type": "technical",
        "level": "advanced"
      }}
    ],
    "summary": "Développeuse full-stack expérimentée avec une expertise approfondie en React et Node.js. Excellentes compétences en leadership d'équipe et gestion de projets complexes. Passionnée par les nouvelles technologies et l'innovation. Bilingue français-anglais."
  }}
Respond ONLY with JSON.
"""

    try:
        async with httpx.AsyncClient(timeout=None) as client:
            response = await client.post(
                f"{OLLAMA_URL}/api/generate",
                json={
                    "model": "mistral:latest",
                    "prompt": prompt,
                    "stream": False,
                    "max_tokens": 1024
                }
            )
    except httpx.RequestError as e:
        raise HTTPException(status_code=502, detail=f"Ollama unreachable: {str(e)}")

    if response.status_code != 200:
        raise HTTPException(status_code=502, detail=f"Ollama error: {response.text}")

    final_output = response.text.strip()

    try:
        return json.loads(final_output)
    except Exception:
        # Try extracting JSON substring
        match_json = re.search(r"\{.*\}", final_output, re.DOTALL)
        if match_json:
            try:
                return json.loads(match_json.group())
            except Exception:
                pass
        raise HTTPException(status_code=502, detail="Failed to parse LLM response as JSON")
