import express from "express";
import { loginUser, signupUser, getCurrentUser, socialLogin  } from "../controllers/authController.js";
import upload from "../middleware/uploadMiddleware.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", upload.single("profileImage"), signupUser);
router.post("/login", loginUser);
router.post("/social-login", socialLogin);
router.get("/me", requireAuth, getCurrentUser);

export default router;