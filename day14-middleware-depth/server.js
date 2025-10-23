const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json()); // Built-in middleware for parsing JSON

// Logger Middleware
const logger = (req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next(); // Move to the next middleware or route
};

// Authentication Middleware
const auth = (req, res, next) => {
  const token = req.headers["authorization"];

  if (token === "mysecrettoken") {
    next(); // User is authenticated
  } else {
    res
      .status(401)
      .json({ error: "Unauthorized! Please provide a valid token." });
  }
};

app.use(logger); // Apply globally

app.get("/dashboard", auth, (req, res) => {
  res.json({ message: "Welcome to your dashboard 🚀" });
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
