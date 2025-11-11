import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import ErrorResponse from "../utils/errorResponse.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1️⃣ Check for token (cookie first, then header)
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2️⃣ No token found
  if (!token) {
    throw new ErrorResponse("Not authorized, token missing", 401);
  }

  try {
    // 3️⃣ Verify the access token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Find and attach user
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    // 🔁 If token expired, attempt to use refresh token
    if (error.name === "TokenExpiredError") {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        throw new ErrorResponse("Session expired, please log in again", 401);
      }

      try {
        // Verify refresh token
        const decodedRefresh = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );

        // Generate new access token
        const newAccessToken = jwt.sign(
          { id: decodedRefresh.id },
          process.env.JWT_SECRET,
          { expiresIn: "15m" } // short-lived
        );

        // Send new token in response header for frontend to store
        res.setHeader("x-new-token", newAccessToken);

        // Attach user to request
        req.user = await User.findById(decodedRefresh.id).select("-password");

        console.log("✅ Access token refreshed automatically.");
        next();
      } catch {
        throw new ErrorResponse(
          "Invalid refresh token, please log in again",
          401
        );
      }
    } else {
      console.error("JWT verification failed:", error.message);
      throw new ErrorResponse("Not authorized, token invalid", 401);
    }
  }
});
