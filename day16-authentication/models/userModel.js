import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      match: [/.+\@.+\..+/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"], // allowed roles
      default: "user", // default role for new signups
    },
    profileImage: {
      type: String,
      default:
        "https://res.cloudinary.com/dtogqb89u/image/upload/v1762383000/task-tracker/profiles/default-avatar.png",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password; // 🚫 Automatically remove password from responses
        return ret;
      },
    },
    toObject: {
      transform(doc, ret) {
        delete ret.password; // also works for toObject()
        return ret;
      },
    },
  }
);

// 🔒 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔐 Compare passwords for login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🔑 Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and save to DB
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set token expiration (10 mins)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);
export default User;
