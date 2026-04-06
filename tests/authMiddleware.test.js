import { describe, it, expect, vi, beforeEach } from "vitest";
import jwt from "jsonwebtoken";
import { requireAuth } from "../backend/src/middleware/authMiddleware.js";
import { createMockRes } from "./helpers/mockResponse.js";

describe("requireAuth middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = "test_secret";
  });

  it("should return 401 when authorization header is missing", () => {
    const req = { headers: {} };
    const res = createMockRes();
    const next = vi.fn();

    requireAuth(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ message: "Authentication required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 when token is invalid", () => {
    const req = {
      headers: {
        authorization: "Bearer invalidtoken"
      }
    };
    const res = createMockRes();
    const next = vi.fn();

    requireAuth(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ message: "Invalid or expired token" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should attach user to req and call next when token is valid", () => {
    const payload = {
      userId: "u1",
      email: "test@example.com",
      role: "user"
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    const req = {
      headers: {
        authorization: `Bearer ${token}`
      }
    };
    const res = createMockRes();
    const next = vi.fn();

    requireAuth(req, res, next);

    expect(req.user.userId).toBe("u1");
    expect(req.user.email).toBe("test@example.com");
    expect(req.user.role).toBe("user");
    expect(next).toHaveBeenCalledTimes(1);
  });
});