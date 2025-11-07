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
