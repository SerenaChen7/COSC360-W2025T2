import express from "express";

const router = express.Router();

router.post("/submit", (req, res) => {
  // Extract the project title from the request body
  const { title, description } = req.body;
  // Generate a response message confirming the submission of the project and send it back as JSON
  res.json({
    message: `Project "${title}" with description "${description}" submitted successfully`
  });
});

export default router;