import { errorResponse } from "../utils/apiResponse.js";

/**
 * Centralized error handling middleware (spec.md Section D4)
 */
export const errorHandler = (err, req, res, next) => {
  // Log error internally for debugging, never expose secrets to client
  console.error(`[Error] ${req.method} ${req.url}:`, err.message || err);

  // Zod Validation Error
  if (err.name === "ZodError") {
    const issues = err.issues || [];
    const formatted = issues.map((i) => ({
      field: i.path.join("."),
      message: i.message
    }));
    return errorResponse(res, "Validation failed", 400, "VALIDATION_ERROR", formatted);
  }

  // Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === "CastError") {
    return errorResponse(res, `Invalid ID format for ${err.path}`, 400, "INVALID_ID");
  }

  // Custom Application Error
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || (statusCode === 404 ? "NOT_FOUND" : statusCode === 409 ? "CONFLICT" : "INTERNAL_SERVER_ERROR");
  const message = err.message || "An unexpected error occurred. Please try again.";

  return errorResponse(res, message, statusCode, errorCode, err.details || []);
};

/**
 * 404 Not Found Middleware
 */
export const notFoundHandler = (req, res) => {
  return errorResponse(res, `Route ${req.method} ${req.originalUrl} not found`, 404, "ROUTE_NOT_FOUND");
};
