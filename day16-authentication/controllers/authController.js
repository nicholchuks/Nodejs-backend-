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

  // 1️⃣ Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ErrorResponse("User already exists", 400);
  }

  let profileImage = null;

  // 2️⃣ Upload to Cloudinary (if image exists)
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

  // 3️⃣ Generate verification token
  const verificationToken = crypto.randomBytes(20).toString("hex");
  const verificationTokenExpire = Date.now() + 10 * 60 * 1000; // 10 mins

  // 4️⃣ Create new user (unverified by default)
  const user = await User.create({
    name,
    email,
    password,
    role,
    profileImage,
    isVerified: false,
    verificationToken,
    verificationTokenExpire,
  });

  // 5️⃣ Prepare verification URL
  const verifyUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/verify/${verificationToken}`;

  const message = `
    <h2>Welcome, ${user.name}</h2>
    <p>Thanks for registering! Please verify your email below:</p>
    <a href="${verifyUrl}" target="_blank">${verifyUrl}</a>
    <p>This link will expire in 10 minutes.</p>
  `;

  try {
    // 6️⃣ Send verification email
    await sendEmail({
      to: user.email,
      subject: "Verify Your Email - Task Tracker",
      html: message,
    });

    res.status(201).json({
      success: true,
      message:
        "Registration successful! Please check your email to verify your account.",
      token: generateToken(user._id),
    });
  } catch (error) {
    // If email sending fails, clear token fields
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });

    throw new ErrorResponse("Email could not be sent", 500);
  }
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  // 1️⃣ Find user with this token and valid expiry
  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new ErrorResponse("Invalid or expired verification link", 400);
  }

  // 2️⃣ Mark user as verified
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpire = undefined;

  await user.save();

  // 3️⃣ Respond to client
  res.status(200).json({
    success: true,
    message: "Email verified successfully! You can now log in.",
  });
});

export const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // 1️⃣ Find the user
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("No user found with this email.");
  }

  // 2️⃣ Check if already verified
  if (user.isVerified) {
    res.status(400);
    throw new Error("This account is already verified.");
  }

  // 3️⃣ Generate a new verification token
  const verificationToken = crypto.randomBytes(32).toString("hex");
  user.verificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  user.verificationTokenExpire = Date.now() + 15 * 60 * 1000; // expires in 15 min
  await user.save({ validateBeforeSave: false });

  // 4️⃣ Create verification URL
  const verifyUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/verify/${verificationToken}`;

  // 5️⃣ Compose email
  const message = `
    <h2>Hello ${user.name},</h2>
    <p>We noticed you haven’t verified your account yet.</p>
    <p>Please click the link below to verify your email:</p>
    <a href="${verifyUrl}" target="_blank">${verifyUrl}</a>
    <p>This link will expire in 15 minutes.</p>
  `;

  // 6️⃣ Send email
  try {
    await sendEmail({
      to: user.email,
      subject: "Resend: Verify Your Email",
      html: message,
    });

    res.status(200).json({
      success: true,
      message: "Verification email resent successfully.",
    });
  } catch (error) {
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500);
    throw new Error("Email could not be sent. Try again later.");
  }
});

// Login user
// 🔐 Login user (with secure cookie)

// Generate Access Token
const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

// Generate Refresh Token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

// Login user
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1️⃣ Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new ErrorResponse("Invalid credentials", 400);
  }

  // 2️⃣ Check if verified
  if (!user.isVerified) {
    res.status(403);
    throw new ErrorResponse("Please verify your email before logging in.", 403);
  }

  // 3️⃣ Check password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(400);
    throw new ErrorResponse("Invalid credentials", 400);
  }

  // 4️⃣ Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // 5️⃣ Send tokens securely via cookies
  res.cookie("token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // 6️⃣ Respond
  res.status(200).json({
    success: true,
    message: "Login successful!",
    token: accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
    },
  });
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

// 🚪 Logout user (clear cookie)
export const logoutUser = asyncHandler(async (req, res) => {
  // 🧹 Clear access token cookie
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
  });

  // 🧹 Clear refresh token cookie (if implemented)
  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
  });

  // 🧠 Prevent caching of authenticated responses
  res.set("Cache-Control", "no-store");
  res.set("Pragma", "no-cache");

  res.status(200).json({
    success: true,
    message: "Logout successful. Authentication cookies cleared.",
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
