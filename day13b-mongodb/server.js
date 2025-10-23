const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const Task = require("./models/Task");

// Use the environment variable for security
const ATLAS_URI = process.env.MONGO_URI;

const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// ---------------- CRUD Routes ----------------

// 🟢 Create a new task
app.post("/tasks", async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 🟡 Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🟣 Update a task by ID
app.put("/tasks/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated task
    });
    if (!updatedTask)
      return res.status(404).json({ message: "Task not found" });
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a task by ID
app.delete("/tasks/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask)
      return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// MongoDB connection
mongoose
  .connect(ATLAS_URI)
  .then(() =>
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    })
  )
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Learning sake
// function startServer() {
//   const app = require("./app"); // Assuming your express app is in app.js
//   const PORT = process.env.PORT || 3000;
//   app.listen(PORT, () => {
//     console.log(`Server listening on port ${PORT}`);
//   });
// }

// Test route
// app.get("/", (req, res) => {
//   res.send("Welcome to Task Manager API 🚀");
// });

// app.post("/test-task", async (req, res) => {
//   try {
//     const task = await Task.create({
//       title: "Learn Express + MongoDB",
//       description: "Build a simple REST API",
//     });
//     res.json(task);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// Start server

// YWElajwXUvy84Aqb

// chukwunicholas91_db_user
