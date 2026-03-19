import express from "express";
import courses from "../data/courses.js";

const router = express.Router();

// GET /api/courses?title=COSC&level=200+Level&sort=az
router.get("/courses", (req, res) => {
  const { title, level, sort } = req.query;

  let results = [...courses];

  if (title) {
    results = results.filter((course) =>
      course.title.toLowerCase().includes(title.toLowerCase())
    );
  }

  if (level) {
    results = results.filter((course) =>
      course.level.toLowerCase().includes(level.toLowerCase())
    );
  }

  if (sort === "az") {
    results.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === "za") {
    results.sort((a, b) => b.title.localeCompare(a.title));
  } else if (sort === "most") {
    results.sort((a, b) => b.memberCount - a.memberCount);
  } else if (sort === "least") {
    results.sort((a, b) => a.memberCount - b.memberCount);
  }

  res.json(results);
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
