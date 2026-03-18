import express from "express";
import cors from "cors";
import submitRoutes from "./routes/submitRoutes.js";

const app = express();

// Use CORS middleware to allow cross-origin requests from the frontend (5173 → 3000)
app.use(cors());
// Use express.json() middleware to parse JSON request bodies or it could be undefined
app.use(express.json());
// Use the submit routes for handling requests to /api/submit 
app.use("/api", submitRoutes);

export default app;