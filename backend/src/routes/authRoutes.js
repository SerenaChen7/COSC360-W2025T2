import express from "express";
import passport from "passport"; 
import { loginUser } from "../controllers/authController.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/signup", upload.single("profileImage"), signupUser);
router.post("/login", loginUser);

router.get("/google", 
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback", 
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    // Generate token and redirect back to frontend
    sendTokenResponse(req.user, res);
  }
);

router.get("/facebook", 
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get("/facebook/callback", 
  passport.authenticate("facebook", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    sendTokenResponse(req.user, res);
  }
);

router.get("/apple", 
  passport.authenticate("apple")
);

router.post("/apple/callback", // Apple uses POST for callbacks
  passport.authenticate("apple", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    sendTokenResponse(req.user, res);
  }
);

function sendTokenResponse(user, res) {
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET || "dev_secret_key",
    { expiresIn: "7d" }
  );

  const userData = JSON.stringify({
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role
  });

  res.redirect(`http://localhost:5173/?token=${token}&user=${encodeURIComponent(userData)}`);
}

export default router;