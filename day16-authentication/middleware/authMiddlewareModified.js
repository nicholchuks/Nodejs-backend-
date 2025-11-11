import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user (excluding password)
      req.user = await User.findById(decoded.id).select("-password");
      next(); // proceed to the next middleware/controller

      // console.log("Decoded user:", decoded);
      // console.log("Fetched user:", req.user);
    } catch (error) {
      console.error(error);
      res.status(401);
      return res.json({ message: "Not authorized, invalid token" });
    }
  }

  if (!token) {
    res.status(401);
    return res.json({ message: "Not authorized, no token provided" });
  }
};

import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import ErrorResponse from "../utils/errorResponse.js";

export const protects = asyncHandler(async (req, res, next) => {
  let token;

  // 1️⃣ Check for token in cookie first
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2️⃣ Fallback: check Authorization header (useful for Postman)
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 3️⃣ No token found
  if (!token) {
    throw new ErrorResponse("Not authorized, token missing", 401);
  }

  try {
    // 4️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5️⃣ Find the user associated with the token
    req.user = await User.findById(decoded.id).select("-password");

    // 6️⃣ Proceed to next middleware
    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    throw new ErrorResponse("Not authorized, token invalid", 401);
  }
});
