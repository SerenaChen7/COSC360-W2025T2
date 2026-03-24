# COSC360 – Client-side Experience Design & Project Structure
## Team Members: Serena Chen, TianXing Chen, Ruoyan Xu, Johanes Panjaitan
---

This repository contains the **client-side experience design** and **planned front-end structure**
for our COSC 360 group project (Winter 2025, Term 2).

The project currently focuses on **wireframes and user flow design**, and is structured to
support **future front-end development**.

---
## Design

The wireframe design link is located in
```
/design/figma-link/figma-link.txt
```

The documentation of the design can be found in [this link](https://docs.google.com/presentation/d/1vV17YDIOLZ9a2R61B4Wm1pQWVvqDi8HX42hClHv2PcQ/edit?usp=sharing)

---

## Project Scope

At this stage, the project includes:
- Wireframes and mockups
- User roles and access rules
- Navigation flow between major pages

Future stages may include:
- Front-end implementation
- API integration
- Backend services (not included here)

---

## User Roles

- **Guest**: browse and search public courses
- **User**: apply to courses, manage personal dashboard
- **Admin**: create and manage courses

Authentication is required for personalized and management features.

---

## Major Pages (Planned)

- Guest Home Page
- Login Page
- Course Browser (Public)
- User Dashboard
- Admin Dashboard
- Course Management – Create Course

---

## Tools

- Figma – wireframes and UI design
- Git / GitHub – version control
- (Planned) React / HTML / CSS / JavaScript

---

## Project Structure

This repository is organized to support **future development** while keeping design assets separate.

See the directory structure below.

## Run with Docker

### Prerequisites
- Install Docker Desktop
- Make sure Docker is running

### Steps

From the project root:

```bash
docker compose up --build
```

## Access the application
Frontend: http://localhost:5173
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