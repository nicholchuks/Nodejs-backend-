// middleware/errorMiddleware.js
import ErrorResponse from "../utils/errorResponse.js";

// Handle 404 errors
export const notFound = (req, res, next) => {
  const error = new ErrorResponse(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

// Global error handler

// Centralized error handling middleware

export const errorHandler = (err, req, res, next) => {
  console.error("🔥 Error:", err.message);

  // Handle CORS errors
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS Error: This origin is not allowed.",
    });
  }

  // Handle rate limit errors
  if (err.status === 429) {
    return res.status(429).json({
      success: false,
      message: err.message || "Too many requests. Try again later.",
    });
  }

  // Default fallback for unexpected errors
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
