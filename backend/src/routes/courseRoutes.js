import express from "express";
import {
  getAllCourses,
  getCourseById,
  searchCourses,
  createCourse,
  getCourseOptions,
  joinCourse,
  getCoursePosts,
  createPost,
  deletePost,
  deleteCourse
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

// GET /api/courses/:id/posts
router.get("/:id/posts", getCoursePosts);

// POST /api/courses/:id/posts
router.post("/:id/posts", createPost);

// DELETE /api/courses/:courseId/posts/:postId
router.delete("/:courseId/posts/:postId", deletePost);

// DELETE /api/courses/:id
router.delete("/:id", deleteCourse);

export default router;