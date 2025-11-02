// controllers/adminController.js
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Task from "../models/taskModel.js";

// @desc    Get platform stats (admin only)
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = asyncHandler(async (req, res) => {
  // 📊 Count total users and tasks
  const totalUsers = await User.countDocuments();
  const totalTasks = await Task.countDocuments();

  // 🟢 Filter tasks by status
  const completedTasks = await Task.countDocuments({ status: "completed" });
  const pendingTasks = await Task.countDocuments({ status: "pending" });
  const inProgressTasks = await Task.countDocuments({ status: "in-progress" });

  // 📈 Send stats back
  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
    },
  });
});
