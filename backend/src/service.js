import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { seed } from "../seed.js";

async function startServer() {
  try {
    // Connnect to MongoDB
    await connectDB();

    // Seed the database with default users and courses
    await seed();

    //  start the server
    app.listen(env.PORT, () => {
      console.log(`Server running on http://localhost:${env.PORT}`);
    });

  } catch (err) {
    console.error("Failed to start server:", err);
  }
}

startServer();