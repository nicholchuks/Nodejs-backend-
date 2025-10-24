// routes/taskRoutes.js
import express from "express";
import {
  getTasks,
  getTask,
  addTask,
  editTask,
  removeTask,
} from "../controllers/taskController.js";

const router = express.Router();

router.get("/", getTasks);
router.get("/:id", getTask);
router.post("/", addTask);
router.put("/:id", editTask);
router.delete("/:id", removeTask);

export default router;
