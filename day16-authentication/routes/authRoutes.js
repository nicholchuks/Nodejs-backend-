import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
} from "../controllers/authController.js";

import upload from "../middleware/uploadMiddleware.js";
import { rateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/register", upload.single("image"), registerUser);
router.get("/verify/:token", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);

router.post("/login", loginUser);
app.use("/api/auth/login", rateLimiter);

router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

export default router;
