# COSC 360 – Course Discussion & Resource Hub

## Team Members
- Serena Chen  
- TianXing Chen  
- Ruoyan Xu  
- Johanes Panjaitan  

---

## Project Description

This project is a full-stack web application built for COSC 360.  
It allows students to explore courses, join discussions, and share resources in a centralized platform.

The system includes:
- React frontend
- Node.js + Express backend
- MongoDB database
- Docker-based deployment

---
## How to Run the Project
### Setup Environment Variables
Before starting the project, create a `.env` file:

### Mac / Linux
```bash
cp .env.example .env
```

### Windows:
Copy .env.example
Rename it to .env

### Requirements
- Docker Desktop installed and running

### Start the system
From the project root:
```bash
docker compose up --build
```
This may take a few minutes on first run
Wait until all services (frontend, backend, database) are fully started

### Stop the Project
```bash
docker compose down
```
(Optional: remove volumes)
```bash
docker compose down -v
```

## Access the application
```bash
Frontend: http://localhost:4000
Backend: http://localhost:3000
```

## Notes
MongoDB runs inside Docker (no local installation required)
Backend connects to MongoDB via mongodb://mongo:27017/cosc360
Environment variables are configured via Docker and .env files

---

## Development (Optional)

To run without Docker:

### Backend
```bash
cd backend
npm install
npm run dev
```

### Running Modes

- Docker mode: use `docker compose up` (recommended for full stack)
- Local development mode:
  - Backend: `npm run dev`
  - Frontend: `npm run dev`

⚠️ Do not run both modes at the same time!!!

---

## Test Accounts

Admin:
- Email: admin@test.com  
- Password: admin123  

User:
- Email: user@test.com  
- Password: user123  
⚠️ If login fails, make sure the database is seeded properly.

---

## Important Notes
Make sure Docker Desktop is installed and running
Do NOT run Docker mode and local development mode at the same time
If ports are already in use, stop other services using those ports
Backend connects to MongoDB via Docker (no local MongoDB required)

---

## Troubleshooting
If the app does not load:
1.Check Docker containers are running
2. Restart with:
 ```bash
   docker compose down
   docker compose up --build
   ```

If login does not work:
Ensure seed data exists

If API fails:
Verify .env file is correctly set