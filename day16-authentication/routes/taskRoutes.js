// routes/taskRoutes.js
import express from "express";
import {
  getTasks,
  getTask,
  addTask,
  editTask,
  removeTask,
  toggleTaskCompletion,
  getCompletedTasks,
  getPendingTasks,
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes (no token required)
router.get("/", getTasks);
router.get("/:id", getTask);

// Filter routes
router.get("/completed", protect, getCompletedTasks);
router.get("/pending", protect, getPendingTasks);

// Protected routes (token required)
router.post("/", protect, addTask);
router.put("/:id", protect, editTask);
router.delete("/:id", protect, removeTask);
router.patch("/:id/toggle", protect, toggleTaskCompletion);

export default router;
