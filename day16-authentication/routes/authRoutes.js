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

/**
 * @openapi
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.post("/register", upload.single("image"), registerUser);

/**
 * @openapi
 * /api/auth/verify/{token}:
 *   get:
 *     summary: Verify email address
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 */

router.get("/verify/:token", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login user and get token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */

router.post("/login", rateLimiter, loginUser);

/**
 * @openapi
 * /api/auth/forgot-password:
 *   post:
 *     summary: Send password reset link
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Reset link sent
 */

router.post("/forgot-password", forgotPassword);

/**
 * @openapi
 * /api/auth/reset-password/{token}:
 *   put:
 *     summary: Reset password using token
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *     responses:
 *       200:
 *         description: Password reset successful
 */

router.put("/reset-password/:token", resetPassword);

// Logout route

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 */

router.post("/logout", protect, logoutUser);

export default router;
