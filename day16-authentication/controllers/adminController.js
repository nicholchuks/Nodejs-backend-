// controllers/adminController.js
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Task from "../models/taskModel.js";
import ErrorResponse from "../utils/errorResponse.js";

// Emit admin stats to all connected admins
export const emitAdminStats = async (io, onlineUsers) => {
  const totalUsers = await User.countDocuments();
  const totalTasks = await Task.countDocuments();
  const completedTasks = await Task.countDocuments({ status: "completed" });
  const pendingTasks = await Task.countDocuments({ status: "pending" });
  const inProgressTasks = await Task.countDocuments({ status: "in-progress" });

  const recentUsers = await User.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select("name email createdAt");

  const activeUsers = await Task.aggregate([
    { $group: { _id: "$user", taskCount: { $sum: 1 } } },
    { $sort: { taskCount: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 0,
        name: "$user.name",
        email: "$user.email",
        taskCount: 1,
      },
    },
  ]);

  const averageTasks =
    totalUsers > 0 ? (totalTasks / totalUsers).toFixed(2) : 0;

  const adminSockets = Array.from(io.sockets.sockets.values()).filter(
    (s) => s.user.role === "admin"
  );

  adminSockets.forEach((s) =>
    s.emit("adminStatsUpdated", {
      totalUsers,
      totalTasks,
      averageTasks,
      recentUsers,
      activeUsers,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      onlineUsers: Array.from(onlineUsers),
    })
  );
};

export const getAdminStats = asyncHandler(async (req, res) => {
  // 📊 Count total users and tasks
  const totalUsers = await User.countDocuments();
  const totalTasks = await Task.countDocuments();

  // 🟢 Filter tasks by status
  const completedTasks = await Task.countDocuments({ status: "completed" });
  const pendingTasks = await Task.countDocuments({ status: "pending" });
  const inProgressTasks = await Task.countDocuments({ status: "in-progress" });

  // ✅ Recent signups
  const recentUsers = await User.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select("name email createdAt");

  // ✅ Most active users
  const activeUsers = await Task.aggregate([
    { $group: { _id: "$user", taskCount: { $sum: 1 } } },
    { $sort: { taskCount: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 0,
        name: "$user.name",
        email: "$user.email",
        taskCount: 1,
      },
    },
  ]);

  // ✅ Average tasks per user
  const averageTasks =
    totalUsers > 0 ? (totalTasks / totalUsers).toFixed(2) : 0;

  // 📈 Send stats back
  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      totalTasks,
      averageTasks,
      recentUsers,
      activeUsers,
      completedTasks,
      pendingTasks,
      inProgressTasks,
    },
  });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password"); // hide passwords
  res.json(users);
});

// ✅ Admin: Delete a user by ID
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  // prevent admin from deleting themselves accidentally
  if (user._id.toString() === req.user._id.toString()) {
    return next(new ErrorResponse("Admins cannot delete themselves", 400));
  }

  await user.deleteOne();

  // Emit updated admin stats
  const io = req.app.get("io");
  const onlineUsers = req.app.get("onlineUsers");
  await emitAdminStats(io, onlineUsers);

  res.status(200).json({
    success: true,
    message: `User ${user.name} deleted successfully`,
  });
});
