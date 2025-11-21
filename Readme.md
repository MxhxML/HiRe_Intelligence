# HiRe Intelligence

![Python](https://img.shields.io/badge/python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100.0-lightblue)
![React](https://img.shields.io/badge/React-18.2.0-blue)

A modern recruitment tool that uses LLMs to analyze CVs, extract candidate data, and update a mock frontend dataset.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [API Usage](#api-usage)
- [Project Structure](#project-structure)

---

## Features

- Upload CVs in PDF or DOCX format.
- Extract candidate information automatically using a language model.
- Normalize skills, education, and experience.
- Update `mockCandidates.ts` automatically with enriched candidate metadata.
- Cross-Origin support for frontend consumption.

---

## Tech Stack

- **Backend**: Python, FastAPI, pdfplumber, docx2txt, httpx  
- **Frontend**: React + TypeScript  
- **LLM**: Mistral via Ollama local server  
- **Utilities**: Logging, file handling, data normalization

---

## Installation

### Backend

1. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Window
```
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Start the backend:

```bash
uvicorn app.main:app --reload
```

### Frontend

```bash
# Navigate to frontend folder:

cd frontend


# Install dependencies:

npm install


# Start the frontend:

npm start


The frontend will run at http://localhost:3000.
```
## API Usage 

**Upload CV and Score**

**Endpoint**: POST /api/upload_cv_and_score/

**Content Type**: multipart/form-data

**Form Data**:

**file**: CV file (PDF or DOCX)

**job_description**: Text description of the job

**Response**: JSON object containing candidate info:

## Project structure 

```css
backend/
│  main.py
│  config.py
│  logger.py
│
├─ services/
│  ├─ candidate.py
│  ├─ file_handler.py
│  ├─ text_extractor.py
│  └─ llm_client.py
│
└─ utils/
frontend/
│  src/
│    data/
│      mockCandidates.ts
│    components/
│    ...
│
└─ .gitignore
Readme.md
```
- **backend/services/candidate.py** → Logic for appending candidates to the mock.

- **backend/services/llm_client.py** → Communicates with the LLM.

- **frontend/src/data/mockCandidates.ts** → Frontend dataset updated dynamically.