import express from "express";
import { loginUser, socialLogin } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/social-login", socialLogin);

export default router;