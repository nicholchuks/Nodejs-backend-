import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import ErrorResponse from "../utils/errorResponse.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// Upload any image
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ErrorResponse("No file uploaded", 400);
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
});

// Upload or replace profile image only
export const uploadProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) throw new ErrorResponse("No image uploaded", 400);

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

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { profileImage: result.secure_url },
    { new: true }
  ).select("-password");

  res.status(200).json({
    success: true,
    message: "Profile image updated successfully",
    imageUrl: result.secure_url,
    user,
  });
});

// 🧠 Update profile details (name/email) + optional image
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

    // ✅ Validate email uniqueness (if email is being changed)
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

    // ✅ If new image uploaded, handle Cloudinary upload + cleanup
    if (req.file) {
      // Delete old image if exists
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

// Remove profile image and clean Cloudinary
export const removeProfileImage = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new ErrorResponse("User not found", 404);
  if (!user.profileImage)
    throw new ErrorResponse("No profile image to remove", 400);

  const publicId = user.profileImage.split("/").pop().split(".")[0];
  await cloudinary.uploader.destroy(`task-tracker/profiles/${publicId}`);

  user.profileImage = "";
  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile image removed successfully",
  });
});
