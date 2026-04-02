import express from "express";
import {
  getAllCourses,
  getCourseById,
  searchCourses,
  createCourse,
  updateCourse,
  getCourseOptions,
  joinCourse,
  getCoursePosts,
  createPost,
  createReply,
  deletePost,
  downloadAttachment
} from "../controllers/courseController.js";
import multer from "multer";

const router = express.Router();

// Set up multer for file uploads
const upload = multer({ dest: "uploads/" });

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

// PATCH /api/courses/:id
router.patch("/:id", updateCourse);

// POST /api/courses/:id/join
router.post("/:id/join", joinCourse);

// GET /api/courses/:id/posts
router.get("/:id/posts", getCoursePosts);

// DELETE /api/courses/:courseId/posts/:postId
router.delete("/:courseId/posts/:postId", deletePost);

// POST /api/courses/:id/posts with files upload
router.post("/:id/posts", upload.array("files", 5), createPost);

// POST /api/courses/:courseId/posts/:postId/replies
router.post("/:courseId/posts/:postId/replies", createReply);

// GET /api/courses/:courseId/posts/:postId/attachments/:attachmentId/download
router.get("/posts/:postId/attachments/:attachmentId/download", downloadAttachment);

export default router;