import { describe, it, expect, vi } from "vitest";
import { createMockRes } from "./helpers/mockResponse.js";
import { runRoute } from "./helpers/runRoute.js";

vi.mock("multer", () => {
  const multerMock = () => ({
    single: () => (req, res, next) => next(),
    array: () => (req, res, next) => next()
  });
  return {
    default: multerMock
  };
});

vi.mock("../backend/src/controllers/courseController.js", () => ({
  getAllCourses: (req, res) => res.status(200).json([{ title: "Mock Course" }]),
  getCourseById: (req, res) => res.status(200).json({ id: req.params.id }),
  searchCourses: (req, res) => res.status(200).json([]),
  createCourse: (req, res) => res.status(201).json({ message: "Course created" }),
  updateCourse: (req, res) => res.status(200).json({ message: "Course updated" }),
  removeMember: (req, res) => res.status(200).json({ message: "Removed" }),
  leaveCourse: (req, res) => res.status(200).json({ message: "Left course" }),
  getCourseOptions: (req, res) =>
    res.status(200).json({
      types: ["Lecture"],
      fields: ["Computer Science"],
      tags: ["React"]
    }),
  joinCourse: (req, res) =>
    res.status(200).json({
      message: "Joined successfully",
      memberCount: 5
    }),
  getJoinedCourses: (req, res) => res.status(200).json([]),
  getCourseMembers: (req, res) => res.status(200).json([]),
  getCoursePosts: (req, res) => res.status(200).json([]),
  createPost: (req, res) => res.status(201).json({ message: "Post created" }),
  deletePost: (req, res) => res.status(200).json({ message: "Post deleted" }),
  deleteCourse: (req, res) => res.status(200).json({ message: "Course deleted" }),
  createReply: (req, res) => res.status(201).json({ message: "Reply created" }),
  downloadAttachment: (req, res) => res.status(200).json({ message: "Download ok" }),
  deleteReply: (req, res) => res.status(200).json({ message: "Reply deleted" })
}));

import courseRoutes from "../backend/src/routes/courseRoutes.js";

describe("courseRoutes", () => {
  it("GET /api/courses/options should return 200", async () => {
    const req = {
      headers: {}
    };
    const res = createMockRes();

    await runRoute(courseRoutes, {
      method: "get",
      path: "/options",
      req,
      res
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      types: ["Lecture"],
      fields: ["Computer Science"],
      tags: ["React"]
    });
  });

  it("POST /api/courses should return 401 when not authenticated", async () => {
    const req = {
      headers: {},
      body: {
        title: "COSC 360",
        type: "Lecture",
        field: "Computer Science",
        description: "Web programming"
      }
    };
    const res = createMockRes();

    await runRoute(courseRoutes, {
      method: "post",
      path: "/",
      req,
      res
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({
      message: "Authentication required"
    });
  });

  it("POST /api/courses/:id/join should return 401 when not authenticated", async () => {
    const req = {
      headers: {},
      params: {
        id: "course1"
      }
    };
    const res = createMockRes();

    await runRoute(courseRoutes, {
      method: "post",
      path: "/:id/join",
      req,
      res
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({
      message: "Authentication required"
    });
  });

  it("PATCH /api/courses/:id should return 401 when not authenticated", async () => {
    const req = {
      headers: {},
      params: {
        id: "course1"
      },
      body: {
        title: "Updated title"
      }
    };
    const res = createMockRes();

    await runRoute(courseRoutes, {
      method: "patch",
      path: "/:id",
      req,
      res
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({
      message: "Authentication required"
    });
  });

  it("DELETE /api/courses/:id should return 401 when not authenticated", async () => {
    const req = {
      headers: {},
      params: {
        id: "course1"
      }
    };
    const res = createMockRes();

    await runRoute(courseRoutes, {
      method: "delete",
      path: "/:id",
      req,
      res
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({
      message: "Authentication required"
    });
  });
});
