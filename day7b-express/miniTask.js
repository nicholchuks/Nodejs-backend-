const express = require("express");
const app = express();
const PORT = 3000;

// Middleware to parse JSON data in requests
app.use(express.json());

// In-memory task list
let tasks = [];

// 🏠 Home Route
app.get("/", (req, res) => {
  res.send("Welcome to my Express API 🚀");
});

// ℹ️ About Route
app.get("/about", (req, res) => {
  res.send("About Page – Built with Express.js");
});

// 🧾 Get all tasks
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// ➕ Add a new task
app.post("/api/tasks", (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Task title is required" });
  }

  const newTask = { id: tasks.length + 1, title };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// ✏️ Update an existing task
app.put("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const task = tasks.find((t) => t.id === parseInt(id));

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  if (!title) {
    return res.status(400).json({ error: "New title is required" });
  }

  task.title = title;
  res.json({ message: "Task updated successfully", task });
});

// ❌ Delete a task
app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const index = tasks.findIndex((t) => t.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks.splice(index, 1);
  res.json({ message: "Task deleted successfully" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
