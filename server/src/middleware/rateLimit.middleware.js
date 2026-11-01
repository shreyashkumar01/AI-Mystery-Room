import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes.",
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      details: []
    }
  }
});

export const caseCreationLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20, // Max 20 mystery generations per 10 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Generation limit reached. Please wait a few minutes before creating another mystery.",
    error: {
      code: "GENERATION_RATE_LIMIT",
      details: []
    }
  }
});
