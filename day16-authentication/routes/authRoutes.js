import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
  logoutUser,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import rateLimiter from "../middleware/rateLimiter.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register", upload.single("image"), registerUser);
router.get("/verify/:token", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);

router.post("/login", rateLimiter, loginUser);

router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

// Logout route
router.post("/logout", protect, logoutUser);

export default router;
