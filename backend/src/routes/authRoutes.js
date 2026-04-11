import express from "express";
import passport from "passport"; 
import jwt from "jsonwebtoken";
import multer from "multer";
import { 
  loginUser, 
  signupUser, 
  getCurrentUser 
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Configure multer for profile image uploads
const upload = multer({ dest: "uploads/" });

// Standard Auth Routes
router.post("/signup", upload.single("profileImage"), signupUser);
router.post("/login", loginUser);
router.get("/me", requireAuth, getCurrentUser);

// Google OAuth
router.get("/google", 
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback", 
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    sendTokenResponse(req.user, res);
  }
);

// Facebook OAuth
router.get("/facebook", 
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get("/facebook/callback", 
  passport.authenticate("facebook", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    sendTokenResponse(req.user, res);
  }
);

// Removed Apple OAuth routes as requested

/**
 * Helper to generate JWT and redirect to the frontend
 */
function sendTokenResponse(user, res) {
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET || "together_as_one_secret_2026",
    { expiresIn: "7d" }
  );

  // Included profileImage so the frontend can display the social avatar immediately
  const userData = JSON.stringify({
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage || ""
  });

  // Use port 4000 for Docker host access to frontend
  const frontendUrl = process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : "http://localhost:4000";

  res.redirect(`${frontendUrl}/?token=${token}&user=${encodeURIComponent(userData)}`);
}

export default router;