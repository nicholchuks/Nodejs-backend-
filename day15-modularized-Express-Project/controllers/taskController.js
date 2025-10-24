// controllers/taskController.js
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../models/taskModel.js";

export const getTasks = (req, res) => {
  res.json(getAllTasks());
};

export const getTask = (req, res) => {
  const task = getTaskById(Number(req.params.id));
  task ? res.json(task) : res.status(404).json({ message: "Task not found" });
};

export const addTask = (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });
  const task = createTask(title, description);
  res.status(201).json(task);
};

export const editTask = (req, res) => {
  const task = updateTask(Number(req.params.id), req.body);
  task ? res.json(task) : res.status(404).json({ message: "Task not found" });
};

export const removeTask = (req, res) => {
  const success = deleteTask(Number(req.params.id));
  success
    ? res.json({ message: "Task deleted" })
    : res.status(404).json({ message: "Task not found" });
};
