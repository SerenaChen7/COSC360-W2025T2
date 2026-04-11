import { describe, it, expect, vi } from "vitest";
import { createMockRes } from "./helpers/mockResponse.js";
import { runRoute } from "./helpers/runRoute.js";

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
  it("POST /api/auth/signup should reach signup controller", async () => {
    const req = {
      body: {
        username: "Eric",
        email: "eric@example.com",
        password: "@Password1",
        confirmPassword: "@Password1"
      }
    };
    const res = createMockRes();

    await runRoute(authRoutes, {
      method: "post",
      path: "/signup",
      req,
      res
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ created: true });
  });

  it("POST /api/auth/login should reach login controller", async () => {
    const req = {
      body: {
        email: "test@example.com",
        password: "123456"
      }
    };
    const res = createMockRes();

    await runRoute(authRoutes, {
      method: "post",
      path: "/login",
      req,
      res
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it("GET /api/auth/me should reach getCurrentUser controller", async () => {
    const req = {
      headers: {}
    };
    const res = createMockRes();

    await runRoute(authRoutes, {
      method: "get",
      path: "/me",
      req,
      res
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      user: {
        id: "u1",
        username: "Eric",
        email: "eric@example.com",
        role: "user",
        profileImage: "",
        isDisabled: false
      }
    });
  });
});
