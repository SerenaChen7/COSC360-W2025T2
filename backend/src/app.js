import express from "express";
import cors from "cors";
import submitRoutes from "./routes/submitRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", submitRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);

export default app;