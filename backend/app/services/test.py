import json
from pathlib import Path

# chemin absolu vers le frontend src/data
output_file = Path("C:/Users/AGARM015/Favorites/HiRe Intelligence/frontend/src/data/mockCandidates.ts")


# Création du candidat
candidate = {
    "id": "1",
    "name": "Sarah Martinez",
    "email": "sarah.martinez@email.com",
    "phone": "+33 6 12 34 56 78",
    "location": "Paris, France",
    "position": "Développeuse Full Stack Senior",
    "experience": "5 ans",
    "education": "Master Informatique",
    "score": 92,
    "rank": 1,
    "totalCandidates": 25,
    "skills": [
        {"name": "React", "type": "technical", "level": "expert"},
        {"name": "Node.js", "type": "technical", "level": "advanced"},
        {"name": "Leadership", "type": "leadership", "level": "advanced"},
        {"name": "Communication", "type": "soft", "level": "expert"},
        {"name": "Anglais", "type": "language", "level": "expert"},
        {"name": "TypeScript", "type": "technical", "level": "advanced"}
    ],
    "summary": (
        "Développeuse full-stack expérimentée avec une expertise approfondie "
        "en React et Node.js. Excellentes compétences en leadership d'équipe "
        "et gestion de projets complexes. Passionnée par les nouvelles technologies "
        "et l'innovation. Bilingue français-anglais."
    ),
    "appliedDate": "2024-01-15"
}

# Placer le candidat dans une liste
candidates_list = [candidate]

# Convertir en JSON indenté
json_content = json.dumps(candidates_list, ensure_ascii=False, indent=2)

# Ajouter l'export TypeScript avec le bon nom
ts_content = f"import {{ Candidate }} from \"@/components/CandidateCard\";\n\nexport const mockCandidates: Candidate[] = {json_content};\n"

# Écriture dans le fichier
output_file.parent.mkdir(parents=True, exist_ok=True)
with open(output_file, "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Fichier écrit avec succès : {output_file}")
