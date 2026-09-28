# Helpdesk Tickets Application

A simple helpdesk ticketing system built with **React** frontend and **FastAPI** backend.

## Project Structure

```
.
├── backend/
│   ├── main.py           # FastAPI application
│   ├── requirements.txt   # Python dependencies
│   └── tickets.json      # Data file (auto-generated)
├── frontend/
│   ├── src/
│   │   ├── App.jsx       # Main React component
│   │   ├── App.css       # Styling
│   │   ├── main.jsx      # React entry point
│   │   └── index.css     # Global styles
│   ├── public/
│   │   └── index.html    # HTML template
│   ├── package.json      # Node dependencies
│   └── vite.config.js    # Vite configuration
└── README.md
```

## Features

### Backend (FastAPI)
- ✅ Get all tickets with optional status filtering
- ✅ Create new tickets with validation
- ✅ Update ticket status (with business rule enforcement)
- ✅ Delete tickets
- ✅ Business rule: Closed tickets cannot be reopened
- ✅ Persist data to local JSON file

### Frontend (React)
- ✅ Display tickets in a table
- ✅ Create tickets via form
- ✅ Change ticket status via dropdown
- ✅ Filter tickets by status (All, Open, In Progress, Closed)
- ✅ Delete tickets with confirmation
- ✅ Loading and error states
- ✅ Responsive design

## Validation

- **Title**: Must be at least 5 characters
- **Category**: Required field
- **Priority**: Must be Low, Medium, or High
- **Created by**: Required field
- **Business Rule**: Closed tickets cannot be changed back to Open

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```
   Server will start at `http://localhost:8000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   App will open at `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tickets` | Get all tickets (optional `?status=Open` filter) |
| POST | `/tickets` | Create a new ticket |
| PATCH | `/tickets/{id}` | Update ticket status |
| DELETE | `/tickets/{id}` | Delete a ticket |

### Sample Request (Create Ticket)
```json
{
  "title": "Sample Issue",
  "category": "Bug",
  "priority": "High",
  "created_by": "user@example.com"
}
```

## Seed Data

The application comes with 5 pre-populated tickets covering various priorities and statuses:
1. Login page not responding (High, Open)
2. Add dark mode feature (Medium, In Progress)
3. Database backup failed (High, Closed)
4. Improve search performance (Low, Open)
5. Update documentation (Low, In Progress)

## Technology Stack

- **Frontend**: React 18, Vite, CSS3
- **Backend**: FastAPI, Pydantic, Python 3.8+
- **Data Storage**: Local JSON file
- **CORS**: Enabled for local development
