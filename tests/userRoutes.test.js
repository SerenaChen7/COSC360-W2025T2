import jwt from "jsonwebtoken";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMockRes } from "./helpers/mockResponse.js";
import { runRoute } from "./helpers/runRoute.js";

vi.mock("../backend/src/controllers/userController.js", () => ({
  getFavorites: (req, res) => res.status(200).json([{ _id: "c1" }]),
  searchUsers: (req, res) => res.status(200).json([{ _id: "u1" }]),
  toggleFavorite: (req, res) =>
    res.status(200).json({ favorites: ["c1"], isFavorite: true }),
  toggleUserStatus: (req, res) =>
    res.status(200).json({
      message: "User disabled successfully",
      user: { _id: req.params.userId, isDisabled: true }
    }),
  updateMyProfile: (req, res) =>
    res.status(200).json({
      message: "Profile updated successfully.",
      user: { _id: req.user.userId }
    })
}));

vi.mock("../backend/src/middleware/uploadMiddleware.js", () => ({
  default: {
    single: () => (req, res, next) => next()
  }
}));

import userRoutes from "../backend/src/routes/userRoutes.js";

function buildToken(role = "user") {
  return jwt.sign(
    {
      userId: "u1",
      email: "eric@example.com",
      role
    },
    process.env.JWT_SECRET
  );
}

describe("userRoutes", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "test_secret";
  });

  it("GET /api/users/favorites should return 401 without authentication", async () => {
    const req = {
      headers: {}
    };
    const res = createMockRes();

    await runRoute(userRoutes, {
      method: "get",
      path: "/favorites",
      req,
      res
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({
      message: "Authentication required"
    });
  });

  it("GET /api/users/search should reach the controller with a valid token", async () => {
    const token = buildToken("admin");
    const req = {
      headers: {
        authorization: `Bearer ${token}`
      },
      query: {
        q: "eric"
      }
    };
    const res = createMockRes();

    await runRoute(userRoutes, {
      method: "get",
      path: "/search",
      req,
      res
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ _id: "u1" }]);
  });

  it("PATCH /api/users/:userId/status should require authentication and reach the controller", async () => {
    const token = buildToken("admin");
    const req = {
      headers: {
        authorization: `Bearer ${token}`
      },
      params: {
        userId: "u2"
      }
    };
    const res = createMockRes();

    await runRoute(userRoutes, {
      method: "patch",
      path: "/:userId/status",
      req,
      res
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      message: "User disabled successfully",
      user: { _id: "u2", isDisabled: true }
    });
  });

  it("PUT /api/users/profile should reach the controller with a valid token", async () => {
    const token = buildToken("user");
    const req = {
      headers: {
        authorization: `Bearer ${token}`
      },
      body: {
        username: "Eric",
        email: "eric@example.com"
      }
    };
    const res = createMockRes();

    await runRoute(userRoutes, {
      method: "put",
      path: "/profile",
      req,
      res
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      message: "Profile updated successfully.",
      user: { _id: "u1" }
    });
  });
});
