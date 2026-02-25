# COSC360 Project

This repository contains the COSC360 project frontend built with React and Vite.

---

## How to Run the Project Locally (VS Code)

### 1. Install Prerequisites

Make sure you have the following installed:

- Git
- Node.js (LTS recommended)
- npm (comes with Node.js)
- VS Code

Check versions in terminal:

node -v  
npm -v  
git --version  

---

### 2. Clone the Repository

git clone <>  
cd COSC360-W2025T2  

Open the project in VS Code

### 3. Install Dependencies

The frontend is inside the `frontend` folder.

cd frontend  
npm install  

Important:
- `node_modules` is NOT committed to GitHub.
- You must run `npm install` after every pull.

---

### 4. Run the Development Server

Inside the `frontend` folder:

npm run dev  

You will see something like:

Local: http://localhost:5173  

Open that URL in your browser.

---

### 5. After Pulling Updates

Whenever you pull new changes:

git pull  
cd frontend  
npm install  
npm run dev  

---

## Common Issues

### Port Already in Use

npm run dev -- --port 5174  




## Important

- Do NOT commit `node_modules`
- Do NOT commit `.env` files
- Always run `npm install` after pulling
- Always run `npm run dev` inside the `frontend` folder