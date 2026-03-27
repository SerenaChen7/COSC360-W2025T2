import express from "express";
import {
  getAllCourses,
  getCourseById,
  searchCourses,
  createCourse
} from "../controllers/courseController.js";

const router = express.Router();

// POST /api/courses
router.post("/", createCourse);

// GET /api/courses
router.get("/", getAllCourses);

// GET /api/courses/search?q=...
router.get("/search", searchCourses);

// GET /api/courses/:id
router.get("/:id", getCourseById);

export default router;