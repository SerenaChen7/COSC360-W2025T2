import express from "express";
import {
  getAllCourses,
  getCourseById,
  searchCourses,
  createCourse,
  getCourseOptions,
  joinCourse
} from "../controllers/courseController.js";
import { getCoursePosts, createPost } from "../controllers/courseController.js";

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

// GET /api/courses/:id/posts
router.get("/:id/posts", getCoursePosts);

// POST /api/courses/:id/posts
router.post("/:id/posts", createPost);

export default router;