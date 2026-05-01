import app from "./app.js";
import env from "./config/env.js";
import { connectDatabase } from "./config/db.js";

async function startServer() {
  try {
    if (!env.jwtSecret) {
      throw new Error("JWT_SECRET is not configured.");
    }

    await connectDatabase();

    app.listen(env.port, () => {
      console.log(`Server listening on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
