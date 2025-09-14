# backend/routes/slots.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from datetime import datetime

router = APIRouter()

# Stockage temporaire (en mémoire) → remplacer par DB réelle plus tard
slots_store = {}  # {candidate_email: {"proposed": [...], "confirmed": None}}

class SlotsProposal(BaseModel):
    candidate_email: str
    proposed_slots: List[str]

class SlotConfirmation(BaseModel):
    candidate_email: str
    confirmed_slot: str

@router.post("/propose_slots")
async def propose_slots(payload: SlotsProposal):
    slots_store[payload.candidate_email] = {
        "proposed": payload.proposed_slots,
        "confirmed": None
    }
    return {"status": "ok"}

@router.post("/confirm_slot")
async def confirm_slot(payload: SlotConfirmation):
    if payload.candidate_email not in slots_store:
        raise HTTPException(status_code=404, detail="Candidate not found")
    slots_store[payload.candidate_email]["confirmed"] = payload.confirmed_slot
    return {"status": "ok"}

@router.get("/get_slots/{candidate_email}")
async def get_slots(candidate_email: str):
    return slots_store.get(candidate_email, {"proposed": [], "confirmed": None})
