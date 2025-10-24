import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
    },
    description: {
      type: String,
      trim: true,
      default: "No description provided",
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

const Task = mongoose.model("Task", taskSchema);

// Changed from CommonJS (module.exports) to ES Module Default Export (export default)
export default Task;
