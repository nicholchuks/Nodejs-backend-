/**
 * @openapi
 * tags:
 *   name: Upload
 *   description: File upload endpoints
 */

/**
 * @openapi
 * /api/upload:
 *   post:
 *     summary: Upload an image
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Upload successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadResponse'
 */

// routes/uploadRoutes.js
import express from "express";
import {
  uploadImage,
  uploadProfileImage,
  updateProfile,
  removeProfileImage,
} from "../controllers/uploadController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", protect, upload.single("image"), uploadImage);
router.post("/profile", protect, upload.single("image"), uploadProfileImage);

// Update profile details (name/email/image)
router.put("/profile/update", protect, upload.single("image"), updateProfile);

// Remove profile image
router.delete("/profile/remove", protect, removeProfileImage);

export default router;
