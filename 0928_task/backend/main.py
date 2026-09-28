from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
import json
from datetime import datetime
from pathlib import Path
from typing import Optional
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TICKETS_FILE = Path(__file__).parent / "tickets.json"

class TicketCreate(BaseModel):
    title: str
    category: str
    priority: str
    created_by: str

    @field_validator("title")
    def title_min_length(cls, v):
        if len(v) < 5:
            raise ValueError("Title must be at least 5 characters")
        return v

    @field_validator("category")
    def category_required(cls, v):
        if not v or not v.strip():
            raise ValueError("Category is required")
        return v

    @field_validator("priority")
    def priority_valid(cls, v):
        if v not in ["Low", "Medium", "High"]:
            raise ValueError("Priority must be Low, Medium, or High")
        return v

    @field_validator("created_by")
    def created_by_required(cls, v):
        if not v or not v.strip():
            raise ValueError("Created by is required")
        return v

class TicketUpdate(BaseModel):
    status: str

    @field_validator("status")
    def status_valid(cls, v):
        if v not in ["Open", "In Progress", "Closed"]:
            raise ValueError("Status must be Open, In Progress, or Closed")
        return v

class Ticket(TicketCreate):
    id: str
    status: str = "Open"
    created_at: str

def load_tickets():
    if TICKETS_FILE.exists():
        with open(TICKETS_FILE) as f:
            return json.load(f)
    return []

def save_tickets(tickets):
    with open(TICKETS_FILE, "w") as f:
        json.dump(tickets, f, indent=2)

def init_tickets():
    if not TICKETS_FILE.exists():
        seed_data = [
            {
                "id": str(uuid.uuid4()),
                "title": "Login page not responding",
                "category": "Bug",
                "priority": "High",
                "status": "Open",
                "created_by": "john@example.com",
                "created_at": datetime.now().isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Add dark mode feature",
                "category": "Feature",
                "priority": "Medium",
                "status": "In Progress",
                "created_by": "jane@example.com",
                "created_at": datetime.now().isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Database backup failed",
                "category": "Bug",
                "priority": "High",
                "status": "Closed",
                "created_by": "admin@example.com",
                "created_at": datetime.now().isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Improve search performance",
                "category": "Improvement",
                "priority": "Low",
                "status": "Open",
                "created_by": "dev@example.com",
                "created_at": datetime.now().isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Update documentation",
                "category": "Documentation",
                "priority": "Low",
                "status": "In Progress",
                "created_by": "docs@example.com",
                "created_at": datetime.now().isoformat()
            }
        ]
        save_tickets(seed_data)

init_tickets()

@app.get("/tickets")
def get_tickets(status: Optional[str] = None):
    tickets = load_tickets()
    if status:
        tickets = [t for t in tickets if t["status"] == status]
    return tickets

@app.post("/tickets")
def create_ticket(ticket: TicketCreate):
    tickets = load_tickets()
    new_ticket = {
        "id": str(uuid.uuid4()),
        "title": ticket.title,
        "category": ticket.category,
        "priority": ticket.priority,
        "created_by": ticket.created_by,
        "status": "Open",
        "created_at": datetime.now().isoformat()
    }
    tickets.append(new_ticket)
    save_tickets(tickets)
    return new_ticket

@app.put("/tickets/{ticket_id}")
def update_ticket(ticket_id: str, update: TicketUpdate):
    tickets = load_tickets()
    ticket = next((t for t in tickets if t["id"] == ticket_id), None)

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    if ticket["status"] == "Closed" and update.status == "Open":
        raise HTTPException(status_code=400, detail="Closed tickets cannot be reopened")

    ticket["status"] = update.status
    save_tickets(tickets)
    return ticket

@app.delete("/tickets/{ticket_id}")
def delete_ticket(ticket_id: str):
    tickets = load_tickets()
    ticket = next((t for t in tickets if t["id"] == ticket_id), None)

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    tickets = [t for t in tickets if t["id"] != ticket_id]
    save_tickets(tickets)
    return {"message": "Ticket deleted"}
