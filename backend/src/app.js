import express from "express";
import cors from "cors";
import path from "path";
import submitRoutes from "./routes/submitRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// expose uploaded files
app.use("/uploads", express.static(path.resolve("uploads")));

app.use("/api", submitRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/users", userRoutes);

export default app;