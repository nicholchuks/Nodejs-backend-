const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// Routes
router.get("/", taskController.getTasks);
router.get("/completed", taskController.getCompletedTasks);
router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
