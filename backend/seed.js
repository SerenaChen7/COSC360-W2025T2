import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Course from "./src/models/Course.js";
import User from "./src/models/User.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function makeUser(username, email, password, role = "user") {
  const passwordHash = await bcrypt.hash(password, 10);

  return {
    username,
    email: email.toLowerCase().trim(),
    passwordHash,
    role,
  };
}

const DEFAULT_IMAGE = "https://via.placeholder.com/300x200?text=Course+Image";

export async function seed() {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI);
      console.log("Connected to MongoDB for seeding");
    }

    let adminUser = await User.findOne({ email: "admin@test.com" });
    if (!adminUser) {
      const adminData = await makeUser("admin", "admin@test.com", "admin123", "admin");
      adminUser = await User.create(adminData);
      console.log("Created admin user");
    }

    let normalUser = await User.findOne({ email: "user@test.com" });
    if (!normalUser) {
      const userData = await makeUser("serena", "user@test.com", "user123", "user");
      normalUser = await User.create(userData);
      console.log("Created demo user");
    }

    const courseCount = await Course.countDocuments();

    if (courseCount === 0) {
      await Course.insertMany([
        {
          title: "COSC 360 - Web Programming",
          description: "Full stack web development",
          location: "UBCO",
          field: "Computer Science",
          type: "Lecture",
          tags: ["Web Development", "Frontend", "Backend"],
          imageUrl: DEFAULT_IMAGE,
          createdBy: adminUser._id,
        },
        {
          title: "MATH 200 - Multivariable Calculus",
          description: "Vectors and partial derivatives",
          location: "UBCO",
          field: "Mathematics",
          type: "Tutorial",
          tags: ["Math", "Calculus"],
          imageUrl: DEFAULT_IMAGE,
          createdBy: normalUser._id,
        },
        {
          title: "COSC 400 - Interview Prep",
          description: "Algorithms and coding practice",
          location: "Remote",
          field: "Computer Science",
          type: "Workshop",
          tags: ["Programming", "Career"],
          imageUrl: DEFAULT_IMAGE,
          createdBy: adminUser._id,
        },
        {
          title: "PHYS 101 - Energy and Waves",
          description: "Basic physics concepts",
          location: "UBCO",
          field: "Physics",
          type: "Lab",
          tags: ["Science"],
          imageUrl: DEFAULT_IMAGE,
          createdBy: normalUser._id,
        },
        {
          title: "COSC 221 - Discrete Structures",
          description: "Logic and proofs",
          location: "UBCO",
          field: "Computer Science",
          type: "Lecture",
          tags: ["Math", "Theory"],
          imageUrl: DEFAULT_IMAGE,
          createdBy: adminUser._id,
        },
        {
          title: "ECON 101 - Microeconomics",
          description: "Supply and demand",
          location: "Remote",
          field: "Economics",
          type: "Seminar",
          tags: ["Business"],
          imageUrl: DEFAULT_IMAGE,
          createdBy: normalUser._id,
        },
        {
          title: "STAT 200 - Statistics",
          description: "Data analysis",
          location: "UBCO",
          field: "Statistics",
          type: "Bootcamp",
          tags: ["Data", "Stats"],
          imageUrl: DEFAULT_IMAGE,
          createdBy: adminUser._id,
        },
        {
          title: "PSYC 101 - Psychology",
          description: "Human behavior",
          location: "Remote",
          field: "Psychology",
          type: "Lecture",
          tags: ["Arts"],
          imageUrl: DEFAULT_IMAGE,
          createdBy: normalUser._id,
        },
        {
          title: "BIOL 112 - Cell Biology",
          description: "Study of cells",
          location: "UBCO",
          field: "Biology",
          type: "Lab",
          tags: ["Science"],
          imageUrl: DEFAULT_IMAGE,
          createdBy: adminUser._id,
        },
        {
          title: "DATA 101 - Data Science",
          description: "Intro to AI and ML",
          location: "Remote",
          field: "Data Science",
          type: "Workshop",
          tags: ["AI", "Machine Learning"],
          imageUrl: DEFAULT_IMAGE,
          createdBy: normalUser._id,
        },
      ]);

      console.log("Default courses inserted");
    }

    console.log("Seeding completed successfully");
  } catch (err) {
    console.error("Seed failed:", err);
    throw err;
  }
}

if (process.argv[1] && process.argv[1].includes("seed.js")) {
  seed().then(() => process.exit(0)).catch(() => process.exit(1));
}