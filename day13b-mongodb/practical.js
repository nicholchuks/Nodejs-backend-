const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json()); // To handle JSON requests

// Test GET route
app.get("/", (req, res) => {
  res.send("Welcome to Task Manager API 🚀");
});

// The POST route that was causing the "Cannot POST" error
app.post("/test-task", async (req, res) => {
  try {
    // 1. Log the incoming request to confirm it reached here
    console.log(
      "POST /test-task endpoint reached. Attempting to create Task..."
    );

    // 2. Create the task. Note: Since we are not using req.body,
    // we only need to provide data for required fields (title).
    const task = await Task.create({
      title: "Learn Express + MongoDB",
      description: "Built via /test-task route",
    });

    // 3. Send a clear success response (201 Created)
    res.status(201).json({
      message: "Task created successfully via test route!",
      data: task,
    });
  } catch (error) {
    // 4. Log the actual database/model error if it fails
    console.error("Error creating task in DB:", error.message);
    res.status(500).json({ message: error.message });
  }
});

mongoose
  .connect("mongodb://localhost:27017/myapp")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(3000, () => console.log("Server running on port 3000"));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
});

const User = mongoose.model("User", userSchema);

// ✅ User is now a model you can use to interact with your users collection.

// Create User

app.post("/users", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.status(201).json(user);
});

// Get Users

app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

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
