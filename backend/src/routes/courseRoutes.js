import express from "express";
import {
  getAllCourses,
  getCourseById,
  searchCourses,
  createCourse,
  getCourseOptions
} from "../controllers/courseController.js";

const router = express.Router();

// GET /api/courses/options
router.get("/options", getCourseOptions);

// GET /api/courses/search?q=...
router.get("/search", searchCourses);

// POST /api/courses
router.post("/", createCourse);

// GET /api/courses
router.get("/", getAllCourses);

// GET /api/courses/:id
router.get("/:id", getCourseById);

export default router;