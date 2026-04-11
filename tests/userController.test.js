import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMockRes } from "./helpers/mockResponse.js";

const {
  mockUserFindById,
  mockUserFind,
  mockUserFindByIdAndUpdate,
  mockPostDistinct
} = vi.hoisted(() => ({
  mockUserFindById: vi.fn(),
  mockUserFind: vi.fn(),
  mockUserFindByIdAndUpdate: vi.fn(),
  mockPostDistinct: vi.fn()
}));

vi.mock("../backend/src/models/User.js", () => ({
  default: {
    findById: mockUserFindById,
    find: mockUserFind,
    findByIdAndUpdate: mockUserFindByIdAndUpdate
  }
}));

vi.mock("../backend/src/models/Post.js", () => ({
  default: {
    distinct: mockPostDistinct
  }
}));

import User from "../backend/src/models/User.js";
import Post from "../backend/src/models/Post.js";
import {
  getFavorites,
  searchUsers,
  toggleFavorite,
  toggleUserStatus,
  updateMyProfile
} from "../backend/src/controllers/userController.js";

describe("userController", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("getFavorites", () => {
    it("should return 404 when the user is not found", async () => {
      User.findById.mockReturnValue({
        populate: vi.fn().mockReturnValue({
          select: vi.fn().mockResolvedValue(null)
        })
      });

      const req = {
        user: {
          userId: "u1"
        }
      };
      const res = createMockRes();

      await getFavorites(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({
        message: "User not found"
      });
    });

    it("should return populated favorites without null entries", async () => {
      User.findById.mockReturnValue({
        populate: vi.fn().mockReturnValue({
          select: vi.fn().mockResolvedValue({
            favorites: [{ _id: "c1" }, null, { _id: "c2" }]
          })
        })
      });

      const req = {
        user: {
          userId: "u1"
        }
      };
      const res = createMockRes();

      await getFavorites(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([{ _id: "c1" }, { _id: "c2" }]);
    });
  });

  describe("toggleFavorite", () => {
    it("should add a course to favorites", async () => {
      const user = {
        favorites: ["c1"],
        save: vi.fn().mockResolvedValue(undefined),
        populate: vi.fn().mockResolvedValue(undefined)
      };
      User.findById.mockResolvedValue(user);

      const req = {
        params: {
          courseId: "c2"
        },
        user: {
          userId: "u1"
        }
      };
      const res = createMockRes();

      await toggleFavorite(req, res);

      expect(user.favorites).toEqual(["c1", "c2"]);
      expect(user.save).toHaveBeenCalledTimes(1);
      expect(user.populate).toHaveBeenCalledWith("favorites");
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        favorites: ["c1", "c2"],
        isFavorite: true
      });
    });

    it("should remove a course from favorites", async () => {
      const user = {
        favorites: ["c1", "c2"],
        save: vi.fn().mockResolvedValue(undefined),
        populate: vi.fn().mockResolvedValue(undefined)
      };
      User.findById.mockResolvedValue(user);

      const req = {
        params: {
          courseId: "c1"
        },
        user: {
          userId: "u1"
        }
      };
      const res = createMockRes();

      await toggleFavorite(req, res);

      expect(user.favorites).toEqual(["c2"]);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        favorites: ["c2"],
        isFavorite: false
      });
    });
  });

  describe("updateMyProfile", () => {
    it("should validate a missing username", async () => {
      const req = {
        body: {
          username: " ",
          email: "eric@example.com"
        },
        user: {
          userId: "u1"
        }
      };
      const res = createMockRes();

      await updateMyProfile(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "Username is required."
      });
    });

    it("should update the current profile and exclude the password hash", async () => {
      const updatedUser = {
        _id: "u1",
        username: "Updated Eric",
        email: "updated@example.com",
        bio: "Hello"
      };
      mockUserFindByIdAndUpdate.mockReturnValue({
        select: vi.fn().mockResolvedValue(updatedUser)
      });

      const req = {
        body: {
          username: " Updated Eric ",
          email: "updated@example.com",
          bio: "Hello"
        },
        file: {
          filename: "profile.webp"
        },
        user: {
          userId: "u1"
        }
      };
      const res = createMockRes();

      await updateMyProfile(req, res);

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        "u1",
        {
          username: "Updated Eric",
          email: "updated@example.com",
          bio: "Hello",
          profileImage: "/uploads/profile.webp"
        },
        { new: true }
      );
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        message: "Profile updated successfully.",
        user: updatedUser
      });
    });
  });

  describe("searchUsers", () => {
    it("should require admin access", async () => {
      const req = {
        query: {
          q: "eric"
        },
        user: {
          role: "user"
        }
      };
      const res = createMockRes();

      await searchUsers(req, res);

      expect(res.statusCode).toBe(403);
      expect(res.body).toEqual({
        message: "Admin access required"
      });
    });

    it("should merge and dedupe direct and post-based matches", async () => {
      const directUsers = [
        { _id: "u1", username: "Eric" },
        { _id: "u2", username: "Ava" }
      ];
      const postUsers = [
        { _id: "u2", username: "Ava" },
        { _id: "u3", username: "Kai" }
      ];

      User.find
        .mockReturnValueOnce({
          select: vi.fn().mockResolvedValue(directUsers)
        })
        .mockReturnValueOnce({
          select: vi.fn().mockResolvedValue(postUsers)
        });
      Post.distinct.mockResolvedValue(["u2", "u3"]);

      const req = {
        query: {
          q: "react"
        },
        user: {
          role: "admin"
        }
      };
      const res = createMockRes();

      await searchUsers(req, res);

      expect(Post.distinct).toHaveBeenCalledWith("author", {
        text: { $regex: /react/i }
      });
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([
        { _id: "u1", username: "Eric" },
        { _id: "u2", username: "Ava" },
        { _id: "u3", username: "Kai" }
      ]);
    });
  });

  describe("toggleUserStatus", () => {
    it("should prevent an admin from disabling their own account", async () => {
      const req = {
        params: {
          userId: "u1"
        },
        user: {
          userId: "u1",
          role: "admin"
        }
      };
      const res = createMockRes();

      await toggleUserStatus(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "You cannot disable your own account"
      });
    });

    it("should toggle a user's disabled status", async () => {
      const user = {
        _id: "u2",
        username: "Ava",
        email: "ava@example.com",
        role: "user",
        profileImage: "",
        isDisabled: false,
        save: vi.fn().mockResolvedValue(undefined)
      };
      User.findById.mockResolvedValue(user);

      const req = {
        params: {
          userId: "u2"
        },
        user: {
          userId: "admin1",
          role: "admin"
        }
      };
      const res = createMockRes();

      await toggleUserStatus(req, res);

      expect(user.isDisabled).toBe(true);
      expect(user.save).toHaveBeenCalledTimes(1);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        message: "User disabled successfully",
        user: {
          _id: "u2",
          username: "Ava",
          email: "ava@example.com",
          role: "user",
          profileImage: "",
          isDisabled: true
        }
      });
    });
  });
});
