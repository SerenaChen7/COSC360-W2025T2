import express from "express";
import { loginUser, signupUser } from "../controllers/authController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/signup", upload.single("profileImage"), signupUser);
router.post("/login", loginUser);

export default router;