const mongoose = require("mongoose");

// Define the structure (schema) of a Task document
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Task title is required"],
  },
  description: {
    type: String,
    default: "No description provided",
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the Task model
module.exports = mongoose.model("Task", taskSchema);
