import express from "express";
import courses from "../data/courses.js";

const router = express.Router();

// GET /api/courses - return all courses
router.get("/courses", (_req, res) => {
  res.json(courses);
});

// GET /api/courses/search?q=<term> - filter courses by partial match
router.get("/courses/search", (req, res) => {
  const query = (req.query.q || "").toLowerCase();

  if (!query) {
    return res.json(courses);
  }

  const results = courses.filter((course) => {
    return (
      course.title.toLowerCase().includes(query) ||
      course.category.toLowerCase().includes(query) ||
      course.level.toLowerCase().includes(query) ||
      course.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  res.json(results);
});

export default router;
