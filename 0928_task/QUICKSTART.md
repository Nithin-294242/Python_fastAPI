# Quick Start Guide

## Run in 2 minutes

### Terminal 1: Start Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend will be at: `http://localhost:8000`
- API docs available at: `http://localhost:8000/docs`

### Terminal 2: Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will open at: `http://localhost:3000`

## What You Can Do

✅ **Create a ticket**
- Click "+ New Ticket"
- Fill in: Title (5+ chars), Category, Priority, Created by
- Click "Create Ticket"

✅ **Change status**
- Select a new status from the dropdown
- Closed tickets can't be reopened (business rule enforced)

✅ **Filter tickets**
- Click filter buttons: All, Open, In Progress, Closed

✅ **Delete tickets**
- Click Delete, confirm removal

## Try These Features

1. Create a ticket with title < 5 chars → See validation error
2. Change a ticket to "Closed" → Status dropdown becomes disabled
3. Try to reopen a closed ticket → Get error: "Closed tickets cannot be reopened"
4. Use filter buttons → See only tickets with that status
5. Delete a ticket → Confirm deletion dialog appears
