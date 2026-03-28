import express from "express";
import {
  getAllCourses,
  getCourseById,
  searchCourses,
  createCourse,
  getCourseOptions,
  joinCourse
} from "../controllers/courseController.js";

const router = express.Router();

// GET /api/courses/options
router.get("/options", getCourseOptions);

// POST /api/courses
router.post("/", createCourse);

// GET /api/courses/search?q=...
router.get("/search", searchCourses);

// GET /api/courses
router.get("/", getAllCourses);

// GET /api/courses/:id
router.get("/:id", getCourseById);

// POST /api/courses/:id/join
router.post("/:id/join", joinCourse);

export default router;