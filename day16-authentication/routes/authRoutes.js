import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register", upload.single("image"), registerUser);

router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

export default router;
