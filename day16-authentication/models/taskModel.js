// import mongoose from "mongoose";

// const taskSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: [true, "Task title is required"],
//       trim: true,
//       minlength: [3, "Title must be at least 3 characters long"],
//     },
//     description: {
//       type: String,
//       trim: true,
//       default: "No description provided",
//     },
//     status: {
//       type: String,
//       enum: ["pending", "in-progress", "completed"],
//       default: "pending",
//     },
//   },
//   { timestamps: true } // automatically adds createdAt and updatedAt
// );

// const Task = mongoose.model("Task", taskSchema);

// export default Task;

// models/taskModel.js
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a task title"],
    },
    description: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    isCompleted: {
      type: Boolean,
      default: false, // Default to false (not completed)
    },
    completedAt: {
      type: Date,
      default: null, // Automatically set when task is marked as completed
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
