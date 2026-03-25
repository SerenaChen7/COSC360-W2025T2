import mongoose from "mongoose";
import Course from "./src/models/Course.js";
import User from "./src/models/User.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/cosc360";

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    await Course.deleteMany({});
    await User.deleteMany({ email: "admin@test.com" });

    const user = await User.create({
      username: "admin",
      email: "admin@test.com",
      passwordHash: "dummyhash123"
    });

    await Course.insertMany([
      {
        title: "Web Programming",
        description: "Learn web dev",
        location: "UBCO",
        field: "Computer Science",
        type: "300 Level",
        tags: ["COSC 360", "Web", "Frontend", "Backend"],
        createdBy: user._id
      },
      {
        title: "Operating Systems",
        description: "Memory, paging, TLB...",
        location: "UBCO",
        field: "Computer Science",
        type: "300 Level",
        tags: ["COSC 315", "OS", "Memory"],
        createdBy: user._id
      }
    ]);

    console.log("Seeded!");
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

seed();