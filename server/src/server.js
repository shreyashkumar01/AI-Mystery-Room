import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables from root or server .env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config();

import app from "./app.js";
import { connectDatabase } from "./config/database.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();

    const server = app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`  🕵️‍♂️  AI MYSTERY ROOM - BACKEND SERVICE STARTED    `);
      console.log(`  🌐  Port: ${PORT}                                  `);
      console.log(`  📡  Health Check: http://localhost:${PORT}/api/health`);
      console.log(`====================================================`);
    });

    // Graceful Shutdown
    const handleShutdown = () => {
      console.log("\n[Server] Shutting down gracefully...");
      server.close(() => {
        console.log("[Server] HTTP server closed.");
        process.exit(0);
      });
    };

    process.on("SIGINT", handleShutdown);
    process.on("SIGTERM", handleShutdown);
  } catch (error) {
    console.error("[Server] Fatal bootstrap error:", error);
    process.exit(1);
  }
};

startServer();
