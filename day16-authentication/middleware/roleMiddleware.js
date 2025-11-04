// middleware/roleMiddleware.js
import ErrorResponse from "../utils/errorResponse.js";

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(
        new ErrorResponse("Not authorized to access this route", 403)
      );
    }
    next();
  };
};
