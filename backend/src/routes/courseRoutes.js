import express from "express";
import {
  getAllCourses,
  getCourseById,
  searchCourses,
  joinCourse
} from "../controllers/courseController.js";

const router = express.Router();

// GET /api/courses
router.get("/", getAllCourses);

// GET /api/courses/search?q=...
router.get("/search", searchCourses);

// GET /api/courses/:id
router.get("/:id", getCourseById);

// POST /api/courses/:id/join
router.post("/:id/join", joinCourse);

export default router;