import express from "express";
import cors from "cors";
import submitRoutes from "./routes/submitRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", submitRoutes);

export default app;