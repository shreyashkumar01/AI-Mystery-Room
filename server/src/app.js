import express from "express";
import cors from "cors";
import caseRoutes from "./routes/case.routes.js";
import { apiLimiter } from "./middleware/rateLimit.middleware.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";

const app = express();

// Security & Cross-Origin Configuration
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or tests) or matching client URL
      if (!origin || origin.startsWith("http://localhost:") || origin === clientUrl) {
        return callback(null, true);
      }
      return callback(null, true); // Dev-friendly permissive CORS
    },
    credentials: true
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Apply global API rate limiter
app.use("/api", apiLimiter);

// Mount API routes under /api (spec.md Section A8.2 & D2)
app.use("/api", caseRoutes);

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
