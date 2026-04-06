import express from "express";
import {
  getAllCourses,
  getCourseById,
  searchCourses,
  createCourse,
  updateCourse,
  getCourseOptions,
  joinCourse,
  leaveCourse,
  getJoinedCourses,
  getCourseMembers,
  removeMember,
  getCoursePosts,
  createPost,
  deletePost,
  deleteCourse,
  createReply,
  downloadAttachment,
  deleteReply
} from "../controllers/courseController.js";
import multer from "multer";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Set up multer for file uploads
const upload = multer({ dest: "uploads/" });

// GET /api/courses/options
router.get("/options", getCourseOptions);

// POST /api/courses
router.post("/", requireAuth, createCourse);

// GET /api/courses/search?q=...
router.get("/search", searchCourses);

// GET /api/courses/joined
router.get("/joined", requireAuth, getJoinedCourses);

// GET /api/courses
router.get("/", getAllCourses);

// GET /api/courses/:id
router.get("/:id", getCourseById);

// PATCH /api/courses/:id
router.patch("/:id", updateCourse);

// POST /api/courses/:id/join
router.post("/:id/join", requireAuth, joinCourse);

// GET /api/courses/:id/members
router.get("/:id/members", getCourseMembers);

// DELETE /api/courses/:id/members/:userId
router.delete("/:id/members/:userId", requireAuth, removeMember);

// DELETE /api/courses/:id/leave
router.delete("/:id/leave", requireAuth, leaveCourse);

// GET /api/courses/:id/posts
router.get("/:id/posts", getCoursePosts);

// DELETE /api/courses/:courseId/posts/:postId
router.delete("/:courseId/posts/:postId", requireAuth, deletePost);

// DELETE /api/courses/:id
router.delete("/:id", deleteCourse);

// POST /api/courses/:id/posts with files upload
router.post("/:id/posts", requireAuth, upload.array("files", 5), createPost);

// POST /api/courses/:courseId/posts/:postId/replies
router.post("/:courseId/posts/:postId/replies", requireAuth, createReply);

// GET /api/courses/:courseId/posts/:postId/attachments/:attachmentId/download
router.get("/posts/:postId/attachments/:attachmentId/download", downloadAttachment);

// DELETE /api/courses/:courseId/posts/:postId/replies/:replyId
router.delete("/:courseId/posts/:postId/replies/:replyId", requireAuth, deleteReply);

export default router;