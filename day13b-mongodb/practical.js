const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json()); // To handle JSON requests

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
