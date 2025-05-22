# Contractor Timesheet Submission System

## Overview

A simple backend service that supports:

- **Contractors** submitting weekly timesheets.
- **Recruiters** approving/rejecting their contractor submissions.
- **Admins** viewing and exporting all timesheets.

## Roles

- **Admin**: View/export all
- **Recruiter**: Approve/reject only their recruited contractors
- **Contractor**: Submit timesheets

## Tech Stack

- Node.js
- Express
- JWT Authentication
- In-memory data store

## Setup

```bash
git clone <repo>
cd timesheet-system
npm install
cp .env.example .env
npm start
```

## Environment Variables

- `JWT_SECRET` – Secret key for token signing
- `PORT` – Port to run server (default 3000)

## API Endpoints

### Auth

#### `POST /api/auth/register`

Register a user:

```json
{
  "name": "John",
  "role": "Contractor",
  "recruiterId": "uuid" // optional
}
```

#### `POST /api/auth/login`

Login with name:

```json
{
  "name": "John"
}
```

---

### Timesheets

🔐 Requires `Authorization: Bearer <token>`

#### `POST /api/timesheets`

Contractor submits a timesheet:

```json
{
  "project": "Client A",
  "hours": 40,
  "notes": "Completed sprint work"
}
```

#### `GET /api/timesheets`

- Contractor: own timesheets
- Recruiter: their contractors
- Admin: all timesheets

#### `PATCH /api/timesheets/:id/status`

Recruiter approves/rejects:

```json
{
  "status": "Approved"
}
```

#### `GET /api/timesheets/export`

Admin downloads CSV export of all timesheets.

---
