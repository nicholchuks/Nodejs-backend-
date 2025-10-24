// utils/customErrors.js
import ErrorResponse from "./errorResponse.js";

// 🔐 Authentication Error (401)
export class AuthError extends ErrorResponse {
  constructor(message = "Not authorized") {
    super(message, 401);
  }
}

// 🚫 Forbidden Error (403)
export class ForbiddenError extends ErrorResponse {
  constructor(message = "Access forbidden") {
    super(message, 403);
  }
}

// 📝 Validation Error (400)
export class ValidationError extends ErrorResponse {
  constructor(message = "Invalid data provided") {
    super(message, 400);
  }
}

// 🧱 Database Error (500)
export class DatabaseError extends ErrorResponse {
  constructor(message = "Database operation failed") {
    super(message, 500);
  }
}
