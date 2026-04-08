import express from "express";
import request from "supertest";
import { describe, it, expect, vi } from "vitest";

vi.mock("../backend/src/controllers/authController.js", () => ({
  loginUser: (req, res) => {
    return res.status(200).json({ ok: true });
  },
  signupUser: (req, res) => {
    return res.status(201).json({ created: true });
  },
  getCurrentUser: (req, res) => {
    return res.status(200).json({
      user: {
        id: "u1",
        username: "Eric",
        email: "eric@example.com",
        role: "user",
        profileImage: "",
        isDisabled: false
      }
    });
  }
}));

vi.mock("../backend/src/middleware/uploadMiddleware.js", () => ({
  default: {
    single: () => (req, res, next) => next()
  }
}));

vi.mock("../backend/src/middleware/authMiddleware.js", () => ({
  requireAuth: (req, res, next) => {
    req.user = {
      userId: "u1",
      email: "eric@example.com",
      role: "user"
    };
    next();
  }
}));

import authRoutes from "../backend/src/routes/authRoutes.js";

describe("authRoutes", () => {
  it("POST /api/auth/login should reach login controller", async () => {
    const app = express();
    app.use(express.json());
    app.use("/api/auth", authRoutes);

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@example.com",
        password: "123456"
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
  });
});