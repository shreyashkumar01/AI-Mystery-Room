/**
 * Consistent API Response Helper conforming to spec.md Section D2
 */

export const successResponse = (res, data = {}, message = "Request completed successfully", statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const errorResponse = (res, message = "Request failed", statusCode = 500, code = "SERVER_ERROR", details = []) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: {
      code,
      details: Array.isArray(details) ? details : [details]
    }
  });
};
