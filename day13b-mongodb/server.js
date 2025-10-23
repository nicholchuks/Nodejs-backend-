const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();

// Use the environment variable for security
const ATLAS_URI = process.env.MONGO_URI;

const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

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
app.get("/", (req, res) => {
  res.send("Welcome to Task Manager API 🚀");
});

// Start server

// YWElajwXUvy84Aqb

// chukwunicholas91_db_user
