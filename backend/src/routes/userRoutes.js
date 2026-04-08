import express from "express";
import { searchUsers } from "../controllers/userController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/users/search?q=...
router.get("/search", requireAuth, searchUsers);

export default router;