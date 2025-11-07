import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import ErrorResponse from "../utils/errorResponse.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// =======================================================
// 📤 Upload any general image
// =======================================================
export const uploadImage = asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "uploads" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: result.secure_url,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Image upload failed",
    });
  }
});

// =======================================================
// 👤 Upload profile image (replaces existing one if exists)
// =======================================================
export const uploadProfileImage = asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete old image from Cloudinary if exists
    if (user.profileImage) {
      const publicId = user.profileImage.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`task-tracker/profiles/${publicId}`);
    }

    // Upload new one
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "task-tracker/profiles" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    user.profileImage = result.secure_url;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Profile image upload failed",
    });
  }
});

// =======================================================
// 🧩 Update profile details (name/email) + optional new image
// =======================================================
export const updateProfile = asyncHandler(async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Validate email uniqueness
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email already in use by another account",
        });
      }
      user.email = email;
    }

    // ✅ Update name if provided
    if (name) user.name = name;

    // ✅ If a new image is uploaded, replace the old one
    if (req.file) {
      if (user.profileImage) {
        const publicId = user.profileImage.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`task-tracker/profiles/${publicId}`);
      }

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "task-tracker/profiles" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      user.profileImage = result.secure_url;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while updating the profile",
    });
  }
});

// routes/uploadRoutes //

// routes/uploadRoutes.js
import express from "express";
import {
  uploadImage,
  uploadProfileImage,
  updateProfile,
} from "../controllers/uploadController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// 📸 General image upload (for posts, etc.)
router.post("/", protect, upload.single("image"), uploadImage);

// 👤 Upload or replace profile image
router.post("/profile", protect, upload.single("image"), uploadProfileImage);

// 🧩 Update profile details (name/email + optional new image)
router.put("/update-profile", protect, upload.single("image"), updateProfile);

export default router;
