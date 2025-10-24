// routes/taskRoutes.js
import express from "express";
import {
  getTasks,
  getTask,
  addTask,
  editTask,
  removeTask,
  searchTasks,
} from "../controllers/taskController.js";

const router = express.Router();

router.get("/", getTasks);
router.get("/search", searchTasks);
router.get("/:id", getTask);
router.post("/", addTask);
router.put("/:id", editTask);
router.delete("/:id", removeTask);

export default router;
