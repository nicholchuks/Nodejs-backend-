// controllers/taskController.js
import Task from "../models/taskModel.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
import asyncHandler from "express-async-handler";
import ErrorResponse from "../utils/errorResponse.js";
import { ValidationError, DatabaseError } from "../utils/customErrors.js";

const Task = require("../models/Task");

// GET /api/tasks
// Description: Fetch tasks with search, filters & pagination
export const getAllTasks = asyncHandler(async (req, res) => {
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

// CREATE new task
export const addTask = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return next(new ValidationError("Task title is required"));
  }

  const newTask = await Task.create({ title, description });
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

// DELETE a task
export const removeTask = asyncHandler(async (req, res) => {
  const deleted = await Task.findByIdAndDelete(req.params.id);
  if (!deleted) return next(new ErrorResponse("Task not found", 404));
  res.json({ message: "Task deleted" });
});
