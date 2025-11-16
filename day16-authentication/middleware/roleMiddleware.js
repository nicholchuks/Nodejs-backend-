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

// export const authorizeRoles = (...allowedRoles) => {
//   return (req, res, next) => {
//     if (!req.user) {
//       return next(new ErrorResponse("Not authorized, no user found", 401));
//     }

//     if (!allowedRoles.includes(req.user.role)) {
//       return next(
//         new ErrorResponse(
//           `Access denied: ${req.user.role} cannot perform this action`,
//           403
//         )
//       );
//     }

//     next();
//   };
// };
