// controllers/taskController.js
import Task from "../models/taskModel.js";
import asyncHandler from "express-async-handler";
import ErrorResponse from "../utils/errorResponse.js";
import { ValidationError, DatabaseError } from "../utils/customErrors.js";

// GET /api/tasks
// Description: Fetch tasks with search, filters & pagination
export const getTasks = asyncHandler(async (req, res) => {
  const { search, status, startDate, endDate, page = 1, limit = 5 } = req.query;

  // 1️⃣ Create a query object
  let query = {};

  // 2️⃣ Keyword Search (case-insensitive)
  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  // 3️⃣ Filter by Status
  if (status) {
    query.status = status;
  }

  // 4️⃣ Date Range Filtering
  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  // 5️⃣ Pagination Logic
  const skip = (page - 1) * limit;

  // 6️⃣ Fetch Data
  const tasks = await Task.find(query)
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  // 7️⃣ Total Count for Pagination Info
  const totalTasks = await Task.countDocuments(query);

  // 8️⃣ Send Response
  res.status(200).json({
    success: true,
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

// export const getTask = asyncHandler(async (req, res) => {
//   const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

//   if (!task) {
//     res.status(404);
//     throw new Error("Task not found");
//   }

//   res.json(task);
// });

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
  res.status(201).json(newTask);
});

// UPDATE a task
export const editTask = asyncHandler(async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!updatedTask) return next(new ErrorResponse("Task not found", 404));
  res.json(updatedTask);
});

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

// DELETE a task
export const removeTask = asyncHandler(async (req, res) => {
  const deleted = await Task.findByIdAndDelete(req.params.id);
  if (!deleted) return next(new ErrorResponse("Task not found", 404));
  res.json({ message: "Task deleted" });
});

// export const removeTask = asyncHandler(async (req, res) => {
//   const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

//   if (!task) {
//     res.status(404);
//     throw new Error("Task not found");
//   }

//   await task.deleteOne();
//   res.json({ message: "Task deleted successfully" });
// });

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
export const getCompletedTasks = async (req, res) => {
  const completedTasks = await Task.find({ status: "completed" });
  res.status(200).json({
    count: completedTasks.length,
    tasks: completedTasks,
  });
};

// ✅ Get all pending tasks
export const getPendingTasks = async (req, res) => {
  const pendingTasks = await Task.find({ status: "pending" });
  res.status(200).json({
    count: pendingTasks.length,
    tasks: pendingTasks,
  });
};
