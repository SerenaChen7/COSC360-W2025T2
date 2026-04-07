import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

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

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
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

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const randomPass = Math.random().toString(36).slice(-8);
      const hash = await bcrypt.hash(randomPass, salt);

      user = await User.create({
        username: username || `${platform}_User`,
        email: cleanEmail,
        passwordHash: hash, 
        role: "user"        
      });
      console.log("New user created in DB via " + platform);
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || "my_secret_key",
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
    res.status(500).json({ message: "Social login failed!" });
  }
}