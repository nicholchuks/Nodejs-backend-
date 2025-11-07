import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import ErrorResponse from "../utils/errorResponse.js";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  let profileImage = null;

  // 🖼️ If image is uploaded, send it to Cloudinary
  if (req.file) {
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

    profileImage = result.secure_url;
  }

  // 👤 Create new user
  const user = await User.create({
    name,
    email,
    password,
    role,
    profileImage, // may be null if not uploaded
  });

  if (user) {
    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// Login user
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Validate password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res.status(200).json({ message: "Login successfully!" });
});

// 📩 Forgot Password
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorResponse("No user found with this email", 404));
  }

  // Generate and store reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create password reset URL
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/reset/${resetToken}`;

  const message = `
    <h2>Hello ${user.name}</h2>
    <p>You requested a password reset.</p>
    <p>Please click the link below to reset your password:</p>
    <a href="${resetUrl}" target="_blank">${resetUrl}</a>
    <p>This link will expire in 10 minutes.</p>
  `;

  try {
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: message,
    });

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse("Email could not be sent", 500));
  }
});

// Reset Password
export const resetPassword = asyncHandler(async (req, res) => {
  // Get hashed token from params
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // Find user with valid token
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new ErrorResponse("Invalid or expired password reset token", 400);
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message:
      "Password reset successful. You can now log in with your new password.",
  });
});

// Register new user
// export const registerUser = asyncHandler(async (req, res, next) => {
//   const { name, email, password, role } = req.body;

//   // Check if user already exists
//   const userExists = await User.findOne({ email });
//   if (userExists) {
//     return res.status(400).json({ message: "User already exists" });
//   }

//   // Create new user
//   const user = await User.create({ name, email, password, role });

//   // Respond with user data and token
//   res.status(201).json({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     role: user.role,
//     token: generateToken(user._id),
//   });
// });
