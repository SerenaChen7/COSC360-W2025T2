import express from "express";
import cors from "cors";
import path from "path";
import passport from "./config/passport.js";
import submitRoutes from "./routes/submitRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import actionRoutes from './routes/actionRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// expose uploaded files
app.use("/uploads", express.static(path.resolve("uploads")));

// --- ROUTES ---

app.use("/api/auth", authRoutes);

app.use("/api/courses", courseRoutes);

app.use('/api/notifications', notificationRoutes);

app.use('/api', actionRoutes);

app.use("/api", submitRoutes);

export default app;