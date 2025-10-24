// utils/errorResponse.js

class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message); // Call parent Error constructor
    this.statusCode = statusCode; // Custom property for HTTP status

    // Capture the stack trace for debugging
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorResponse;
