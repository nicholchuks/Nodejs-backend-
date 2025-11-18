// controllers/taskController.js
import Task from "../models/taskModel.js";
import asyncHandler from "express-async-handler";
import ErrorResponse from "../utils/errorResponse.js";
import { ValidationError, DatabaseError } from "../utils/customErrors.js";
import { emitAdminStats } from "./adminController.js";

// GET /api/tasks
// Description: Fetch tasks with search, filters & pagination
export const getTasks = asyncHandler(async (req, res) => {
  const { search, status, startDate, endDate, page = 1, limit = 5 } = req.query;

  let query = {};

  // 🧍 If the logged-in user is NOT an admin, show only their own tasks
  if (req.user.role !== "admin") {
    query.user = req.user._id;
  }

  // 🔍 Search
  if (search) query.title = { $regex: search, $options: "i" };

  // ⚙️ Status filter
  if (status) query.status = status;

  // 📅 Date range
  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  // ⏩ Pagination
  const skip = (page - 1) * limit;

  // 🧾 Fetch tasks based on role
  const tasks = await Task.find(query)
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const totalTasks = await Task.countDocuments(query);

  res.status(200).json({
    success: true,
    role: req.user.role, // ✅ shows the user's role
    totalTasks,
    currentPage: Number(page),
    totalPages: Math.ceil(totalTasks / limit),
    results: tasks.length,
    tasks,
  });
});

// GET single task
export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return next(new ErrorResponse("Task not found", 404));
  res.json(task);
});

// CREATE new task
export const addTask = asyncHandler(async (req, res) => {
  const { title, description, status } = req.body;
  const userId = req.user.id;

  if (!title || !description) {
    return next(new ValidationError("Task title is required"));
  }

  const newTask = await Task.create({
    title,
    description,
    status,
    user: userId,
  });

  const io = req.app.get("io");
  const onlineUsers = req.app.get("onlineUsers"); // we'll store this globally

  // After the private emit
  io.to(req.user._id.toString()).emit("taskCreated", { task: newTask });

  // Update admin dashboard
  await emitAdminStats(io, onlineUsers);

  res.status(201).json(newTask);
});

// UPDATE a task
export const editTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return next(new ErrorResponse("Task not found", 404));

  //  Only allow the owner or admin to update
  if (task.user.toString() !== req.user.id && req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Not authorized to edit this task" });
  }

  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  const io = req.app.get("io");
  const onlineUsers = req.app.get("onlineUsers"); // we'll store this globally

  // After the private emit
  io.to(req.user._id.toString()).emit("taskUpdated", { task: updatedTask });

  // Update admin dashboard
  await emitAdminStats(io, onlineUsers);
  res.json(updatedTask);
});

// DELETE a task
export const removeTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return next(new ErrorResponse("Task not found", 404));

  //  Only allow the owner or admin to delete
  if (task.user.toString() !== req.user.id && req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Not authorized to delete this task" });
  }

  await task.deleteOne();

  const io = req.app.get("io");
  const onlineUsers = req.app.get("onlineUsers");

  io.to(task.user.toString()).emit("taskDeleted", { taskId: req.params.id });
  await emitAdminStats(io, onlineUsers);

  res.json({ message: "Task deleted successfully" });
});

// Toggle a task
export const toggleTaskCompletion = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  // Toggle between completed and pending
  if (task.status === "completed") {
    task.status = "pending";
    task.completedAt = null;
  } else {
    task.status = "completed";
    task.completedAt = new Date();
  }

  const updatedTask = await task.save();

  const io = req.app.get("io");
  const onlineUsers = req.app.get("onlineUsers");

  io.to(task.user.toString()).emit("taskToggled", { task: updatedTask });
  await emitAdminStats(io, onlineUsers);

  res.status(200).json({
    message: `Task status changed to "${updatedTask.status}"`,
    task: {
      id: updatedTask._id,
      title: updatedTask.title,
      status: updatedTask.status,
      completedAt: updatedTask.completedAt,
      updatedAt: updatedTask.updatedAt,
    },
  });
};

// ✅ Get all completed tasks
export const getCompletedTasks = asyncHandler(async (req, res) => {
  const completedTasks = await Task.find({
    status: "completed",
    user: req.user._id,
  });

  // Emit updated completed tasks count & list
  const io = req.app.get("io");
  const onlineUsers = req.app.get("onlineUsers");
  io.to(req.user._id.toString()).emit("completedTasksUpdated", {
    tasks: completedTasks,
  });
  await emitAdminStats(io, onlineUsers);

  res.status(200).json({
    count: completedTasks.length,
    tasks: completedTasks,
  });
});

// ✅ Get all pending tasks
export const getPendingTasks = asyncHandler(async (req, res) => {
  const pendingTasks = await Task.find({
    status: "pending",
    user: req.user._id,
  });

  // Emit updated pending tasks count & list
  const io = req.app.get("io");
  const onlineUsers = req.app.get("onlineUsers");
  io.to(req.user._id.toString()).emit("pendingTasksUpdated", {
    tasks: pendingTasks,
  });
  await emitAdminStats(io, onlineUsers);

  res.status(200).json({
    count: pendingTasks.length,
    tasks: pendingTasks,
  });
});

// ✅ Get all completed tasks
// export const getCompletedTasks = async (req, res) => {
//   const completedTasks = await Task.find({ status: "completed" });
//   res.status(200).json({
//     count: completedTasks.length,
//     tasks: completedTasks,
//   });
// };

// // ✅ Get all pending tasks
// export const getPendingTasks = async (req, res) => {
//   const pendingTasks = await Task.find({ status: "pending" });
//   res.status(200).json({
//     count: pendingTasks.length,
//     tasks: pendingTasks,
//   });
// };

// export const editTask = asyncHandler(async (req, res) => {
//   const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

//   if (!task) {
//     res.status(404);
//     throw new Error("Task not found");
//   }

//   const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//   });

//   res.json(updatedTask);
// });

// export const removeTask = asyncHandler(async (req, res) => {
//   const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

//   if (!task) {
//     res.status(404);
//     throw new Error("Task not found");
//   }

//   await task.deleteOne();
//   res.json({ message: "Task deleted successfully" });
// });

// export const getTask = asyncHandler(async (req, res) => {

//   const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

//   if (!task) {
//     res.status(404);
//     throw new Error("Task not found");
//   }

//   res.json(task);
// });
