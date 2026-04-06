import express from "express";
import request from "supertest";
import { describe, it, expect, vi } from "vitest";

vi.mock("multer", () => {
  const multerMock = () => ({
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
  function makeApp() {
    const app = express();
    app.use(express.json());
    app.use("/api/courses", courseRoutes);
    return app;
  }

  it("GET /api/courses/options should return 200", async () => {
    const app = makeApp();

    const response = await request(app).get("/api/courses/options");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      types: ["Lecture"],
      fields: ["Computer Science"],
      tags: ["React"]
    });
  });

  it("POST /api/courses should return 401 when not authenticated", async () => {
    const app = makeApp();

    const response = await request(app).post("/api/courses").send({
      title: "COSC 360",
      type: "Lecture",
      field: "Computer Science",
      description: "Web programming"
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: "Authentication required"
    });
  });

  it("POST /api/courses/:id/join should return 401 when not authenticated", async () => {
    const app = makeApp();

    const response = await request(app).post("/api/courses/course1/join");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: "Authentication required"
    });
  });
});