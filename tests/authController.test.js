import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createMockRes } from "./helpers/mockResponse.js";

vi.mock("../backend/src/models/User.js", () => ({
  default: {
    findOne: vi.fn()
  }
}));

import User from "../backend/src/models/User.js";
import { loginUser } from "../backend/src/controllers/authController.js";

describe("loginUser controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = "test_secret";
  });

  it("should return 400 if email or password is missing", async () => {
    const req = {
      body: {
        email: "",
        password: ""
      }
    };
    const res = createMockRes();

    await loginUser(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      message: "Email and password are required"
    });
  });

  it("should return 401 if user does not exist", async () => {
    User.findOne.mockResolvedValue(null);

    const req = {
      body: {
        email: "missing@example.com",
        password: "123456"
      }
    };
    const res = createMockRes();

    await loginUser(req, res);

    expect(User.findOne).toHaveBeenCalledWith({
      email: "missing@example.com"
    });
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({
      message: "Invalid email or password"
    });
  });

  it("should return 401 if password is incorrect", async () => {
    const passwordHash = await bcrypt.hash("correctpassword", 10);

    User.findOne.mockResolvedValue({
      _id: "u1",
      username: "Eric",
      email: "eric@example.com",
      passwordHash,
      role: "user"
    });

    const req = {
      body: {
        email: "eric@example.com",
        password: "wrongpassword"
      }
    };
    const res = createMockRes();

    await loginUser(req, res);

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({
      message: "Invalid email or password"
    });
  });

  it("should return token and user when login succeeds", async () => {
    const passwordHash = await bcrypt.hash("correctpassword", 10);

    User.findOne.mockResolvedValue({
      _id: "u1",
      username: "Eric",
      email: "eric@example.com",
      passwordHash,
      role: "user"
    });

    const req = {
      body: {
        email: "eric@example.com",
        password: "correctpassword"
      }
    };
    const res = createMockRes();

    await loginUser(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Login successful");
    expect(typeof res.body.token).toBe("string");

    const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(decoded.userId).toBe("u1");
    expect(decoded.email).toBe("eric@example.com");
    expect(decoded.role).toBe("user");

    expect(res.body.user).toEqual({
      id: "u1",
      username: "Eric",
      email: "eric@example.com",
      role: "user"
    });
  });
});