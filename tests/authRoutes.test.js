import express from "express";
import request from "supertest";
import { describe, it, expect, vi } from "vitest";

vi.mock("../backend/src/controllers/authController.js", () => ({
  loginUser: (req, res) => {
    return res.status(200).json({ ok: true });
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