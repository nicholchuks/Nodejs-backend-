// middleware/errorMiddleware.js
import ErrorResponse from "../utils/errorResponse.js";

// Handle 404 errors
export const notFound = (req, res, next) => {
  const error = new ErrorResponse(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

// Global error handler
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message); // Logs only in server console (not in client)

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong. Please try again later.",
  });
};
