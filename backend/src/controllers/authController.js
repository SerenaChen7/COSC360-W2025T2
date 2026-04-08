import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function signupUser(req, res) {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({
        message: "Username, email, password, and confirm password are required"
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match"
      });
    }

    const cleanedEmail = email.toLowerCase().trim();
    const cleanedUsername = username.trim();

    const existingEmail = await User.findOne({ email: cleanedEmail });
    if (existingEmail) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    const existingUsername = await User.findOne({ username: cleanedUsername });
    if (existingUsername) {
      return res.status(400).json({
        message: "Username already exists"
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const profileImage = req.file ? `/uploads/${req.file.filename}` : "";

    const newUser = await User.create({
      username: cleanedUsername,
      email: cleanedEmail,
      passwordHash,
      role: "user",
      profileImage,
      isDisabled: false
    });

    return res.status(201).json({
      message: "Account created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        profileImage: newUser.profileImage
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    if (user.isDisabled) {
      return res.status(403).json({
        message: "This account has been disabled"
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || "dev_secret_key",
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage || ""
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
}

export async function getCurrentUser(req, res) {
  try {
    const user = await User.findById(req.user.userId).select(
      "_id username email role profileImage isDisabled"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user.isDisabled) {
      return res.status(403).json({
        message: "This account has been disabled"
      });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage || "",
        isDisabled: user.isDisabled
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
}

export async function socialLogin(req, res) {
  try {
    const { email, username, platform } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Social login needs an email" });
    }

    const cleanEmail = email.toLowerCase().trim();

    let user = await User.findOne({ email: cleanEmail });

    // If they are new, we make a safe account for them
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const randomPass = Math.random().toString(36).slice(-8); // A secret random password
      const hash = await bcrypt.hash(randomPass, salt);

      user = await User.create({
        username: username || `${platform}_User`,
        email: cleanEmail,
        passwordHash: hash, 
        role: "user"        
      });
      console.log(`[DB] Created new user: ${cleanEmail} via ${platform}`);
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || "dev_secret_key", 
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Social login success!",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Database error during social login:", err);
    res.status(500).json({ message: "Social login failed!" });
  }
}