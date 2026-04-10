import express from "express";
import {
  getFavorites,
  searchUsers,
  toggleFavorite,
  toggleUserStatus,
  updateMyProfile
} from "../controllers/userController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/favorites", requireAuth, getFavorites);
router.patch("/favorites/:courseId", requireAuth, toggleFavorite);

// GET /api/users/search?q=...
router.get("/search", requireAuth, searchUsers);
router.patch("/:userId/status", requireAuth, toggleUserStatus);

// PUT /api/users/profile
router.put("/profile", requireAuth, upload.single("profileImage"), updateMyProfile);

export default router;
