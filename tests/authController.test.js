import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createMockRes } from "./helpers/mockResponse.js";

vi.mock("../backend/src/models/User.js", () => ({
  default: {
    findOne: vi.fn(),
    findById: vi.fn(),
    create: vi.fn()
  }
}));

import User from "../backend/src/models/User.js";
import {
  getCurrentUser,
  loginUser,
  signupUser
} from "../backend/src/controllers/authController.js";

describe("authController", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env.JWT_SECRET = "test_secret";
  });

  describe("signupUser", () => {
    it("should return 400 if required fields are missing", async () => {
      const req = {
        body: {
          username: "",
          email: "",
          password: "",
          confirmPassword: ""
        }
      };
      const res = createMockRes();

      await signupUser(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "Username, email, password, and confirm password are required"
      });
    });

    it("should reject invalid profile image types", async () => {
      const req = {
        body: {
          username: "Eric",
          email: "eric@example.com",
          password: "@Password1",
          confirmPassword: "@Password1"
        },
        file: {
          mimetype: "image/gif",
          size: 100
        }
      };
      const res = createMockRes();

      await signupUser(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "Profile image must be JPG, PNG, or WEBP"
      });
    });

    it("should return 400 when email already exists", async () => {
      User.findOne.mockResolvedValueOnce({
        _id: "u1"
      });

      const req = {
        body: {
          username: "Eric",
          email: "eric@example.com",
          password: "@Password1",
          confirmPassword: "@Password1"
        }
      };
      const res = createMockRes();

      await signupUser(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        email: "eric@example.com"
      });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "Email already exists"
      });
    });

    it("should create an account successfully", async () => {
      User.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
      User.create.mockResolvedValue({
        _id: "u1",
        username: "Eric",
        email: "eric@example.com",
        role: "user",
        profileImage: "/uploads/profile.webp",
        isDisabled: false
      });

      const req = {
        body: {
          username: " Eric ",
          email: "Eric@Example.com ",
          password: "@Password1",
          confirmPassword: "@Password1"
        },
        file: {
          mimetype: "image/webp",
          size: 1024,
          filename: "profile.webp"
        }
      };
      const res = createMockRes();

      await signupUser(req, res);

      expect(User.create).toHaveBeenCalledWith(
        expect.objectContaining({
          username: "Eric",
          email: "eric@example.com",
          role: "user",
          profileImage: "/uploads/profile.webp",
          isDisabled: false
        })
      );
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        message: "Account created successfully",
        user: {
          id: "u1",
          username: "Eric",
          email: "eric@example.com",
          role: "user",
          profileImage: "/uploads/profile.webp",
          isDisabled: false
        }
      });
    });
  });

  describe("loginUser", () => {
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
        role: "user",
        profileImage: "",
        isDisabled: false
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
        role: "user",
        profileImage: "",
        isDisabled: false
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
        role: "user",
        profileImage: "",
        isDisabled: false
      });
    });
  });

  describe("getCurrentUser", () => {
    it("should return 404 when the user no longer exists", async () => {
      User.findById.mockReturnValue({
        select: vi.fn().mockResolvedValue(null)
      });

      const req = {
        user: {
          userId: "u1"
        }
      };
      const res = createMockRes();

      await getCurrentUser(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({
        message: "User not found"
      });
    });

    it("should return 403 when the account is disabled", async () => {
      User.findById.mockReturnValue({
        select: vi.fn().mockResolvedValue({
          _id: "u1",
          username: "Eric",
          email: "eric@example.com",
          role: "user",
          profileImage: "",
          isDisabled: true
        })
      });

      const req = {
        user: {
          userId: "u1"
        }
      };
      const res = createMockRes();

      await getCurrentUser(req, res);

      expect(res.statusCode).toBe(403);
      expect(res.body).toEqual({
        message: "This account has been disabled"
      });
    });

    it("should return the current user profile", async () => {
      User.findById.mockReturnValue({
        select: vi.fn().mockResolvedValue({
          _id: "u1",
          username: "Eric",
          email: "eric@example.com",
          role: "admin",
          profileImage: "/uploads/profile.webp",
          isDisabled: false
        })
      });

      const req = {
        user: {
          userId: "u1"
        }
      };
      const res = createMockRes();

      await getCurrentUser(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        user: {
          id: "u1",
          username: "Eric",
          email: "eric@example.com",
          role: "admin",
          profileImage: "/uploads/profile.webp",
          isDisabled: false
        }
      });
    });
  });
});
