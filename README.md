# ResumePilot AI

An AI-powered resume analysis platform that helps users analyze, optimize, and tailor resumes for specific jobs. The app combines a React frontend, a Node/Express backend, and a FastAPI-based ATS engine for resume scoring, job matching, cover letters, and export generation.

## What It Does

- Parse uploaded resumes in PDF or DOCX format
- Generate ATS-style resume scores and feedback
- Highlight missing keywords, weak sections, and improvement areas
- Match resumes against job descriptions
- Generate cover letters
- Export optimized resume content to PDF or DOCX

## Project Structure

- `frontend/` - React application
- `backend/` - Node/Express API
- `backend/python-service/` - FastAPI ATS engine used by the backend

## Prerequisites

- Node.js 18+
- npm
- Python 3.10+
- A working MongoDB instance

## Setup

### 1. Install backend dependencies

```bash
cd backend
npm install
```

### 2. Install Python service dependencies

```bash
cd backend/python-service
python3 -m pip install -r requirements.txt
```

If spaCy asks for the English language model, install it once:

```bash
python3 -m spacy download en_core_web_sm
```

### 3. Install frontend dependencies

```bash
cd frontend
npm install
```

## Running the App

Open three terminals:

### Backend API

```bash
cd backend
npm run dev
```

### Python ATS service

```bash
cd backend/python-service
python3 main.py
```

### Frontend

```bash
cd frontend
npm run dev
```

## Environment Variables

The backend reads these common variables from `backend/.env` or the shell:

- `PORT` - Node backend port, default `5000`
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `FRONTEND_ORIGIN` - Allowed frontend origin, default `http://localhost:5173`
- `BACKEND_URL` - Public backend URL
- `PYTHON_SERVICE_URL` - Python ATS service URL, default `http://127.0.0.1:8000`
- `PYTHON_SERVICE_HOST` - Alternative host for the Python service
- `PYTHON_SERVICE_PORT` - Alternative port for the Python service

For the Python service:

- `PORT` - FastAPI port, default `8000`
- `FRONTEND_ORIGIN` - CORS origin for the frontend
- `OPENAI_API_KEY` - Optional, if you use model-backed generation paths
- `OPENAI_MODEL` - Optional model name, default `gpt-4.1-mini`
- `LOG_LEVEL` - Logging level

## API Overview

### Node backend

- `GET /health`
- `POST /api/auth/...`
- `POST /api/resume/...`
- `POST /api/ats/...`
- `POST /api/jobs/...`
- `POST /api/profile/...`
- `POST /api/settings/...`

### Python ATS service

- `GET /health`
- `POST /analyze`
- `POST /optimize`
- `POST /generate-cover-letter`
- `POST /match-job`
- `POST /export`

## Notes

- The Node backend talks to the Python service over HTTP, so both processes must be running for full ATS features.
- Uploads are stored under `backend/src/uploads/`.
- The backend already includes fallback logic for `localhost` and `127.0.0.1` when contacting the Python service.

## Suggested Project Name

ResumePilot AI
