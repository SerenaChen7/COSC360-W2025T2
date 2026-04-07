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

### Requirements
- Docker Desktop installed and running

---

### Start the system

From the project root:

```bash
docker compose up --build

## Access the application
Frontend: http://localhost:4000
Backend: http://localhost:3000

## Notes
MongoDB runs inside Docker (no local installation required)
Backend connects to MongoDB via mongodb://mongo:27017/cosc360
Environment variables are configured via Docker and .env files

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

---

## Summary

This project demonstrates a complete full-stack application with database integration, authentication, and interactive UI features.