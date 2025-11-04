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
