import mongoose from "mongoose";
import dotenv from "dotenv"; 
import Course from "./src/models/Course.js";
import User from "./src/models/User.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function seed() {
  try {
    // Try to connect to your MongoDB Atlas cloud database
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear out any old courses and specific admin user
    await Course.deleteMany({});
    await User.deleteMany({ email: "admin@test.com" });

    // Create a new admin user to own the courses
    const user = await User.create({
      username: "admin",
      email: "admin@test.com",
      passwordHash: "dummyhash123"
    });

    // Putting many courses into the database
    await Course.insertMany([
      {
        title: "COSC 360 - Web Programming",
        description: "Learn web dev",
        location: "UBCO",
        field: "Computer Science",
        type: "300 Level",
        tags: ["COSC 360", "Web", "Frontend", "Backend"],
        createdBy: user._id
      },
      {
        title: "MATH 200 - Multivariable Calculus",
        description: "Vectors and partial derivatives",
        location: "UBCO",
        field: "Mathematics",
        type: "200 Level",
        tags: ["MATH 200", "Calculus", "Math"],
        createdBy: user._id
      },
      {
        title: "COSC 400 - Interview Prep",
        description: "LeetCode and mock interviews",
        location: "Remote",
        field: "Computer Science",
        type: "400 Level",
        tags: ["COSC 400", "Career", "Coding"],
        createdBy: user._id
      },
      {
        title: "PHYS 101 - Energy and Waves",
        description: "Basic physics concepts",
        location: "UBCO",
        field: "Physics",
        type: "100 Level",
        tags: ["PHYS 101", "Science", "Physics"],
        createdBy: user._id
      },
      {
        title: "COSC 221 - Discrete Structures",
        description: "Logic and proofs",
        location: "UBCO",
        field: "Computer Science",
        type: "200 Level",
        tags: ["COSC 221", "Math", "Theory"],
        createdBy: user._id
      },
      {
        title: "ECON 101 - Microeconomics",
        description: "Supply and demand",
        location: "Remote",
        field: "Economics",
        type: "100 Level",
        tags: ["ECON 101", "Business", "Econ"],
        createdBy: user._id
      },
      {
        title: "STAT 200 - Statistics",
        description: "Data analysis with R",
        location: "UBCO",
        field: "Statistics",
        type: "200 Level",
        tags: ["STAT 200", "Data", "Stats"],
        createdBy: user._id
      },
      {
        title: "ENGL 301 - Technical Writing",
        description: "Professional communication",
        location: "Remote",
        field: "English",
        type: "300 Level",
        tags: ["ENGL 301", "Writing", "Arts"],
        createdBy: user._id
      },
      {
        title: "BIOL 112 - Cell Biology",
        description: "Study of cells",
        location: "UBCO",
        field: "Biology",
        type: "100 Level",
        tags: ["BIOL 112", "Science", "Bio"],
        createdBy: user._id
      },
      {
        title: "COSC 315 - Operating Systems",
        description: "Kernel and memory management",
        location: "UBCO",
        field: "Computer Science",
        type: "300 Level",
        tags: ["COSC 315", "OS", "Systems"],
        createdBy: user._id
      }
    ]);

    console.log("Seeded! 10 courses are ready.");
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

// Run the script
seed();