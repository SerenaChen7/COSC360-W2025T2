import express from "express";
import { searchUsers, toggleUserStatus } from "../controllers/userController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/users/search?q=...
router.get("/search", requireAuth, searchUsers);
router.patch("/:userId/status", requireAuth, toggleUserStatus);

export default router;