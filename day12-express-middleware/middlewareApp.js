const express = require("express");
const app = express();
const PORT = 3000;

// Middleware #1: Logger
const logger = (req, res, next) => {
  const currentTime = new Date().toLocaleTimeString();
  console.log(`[${currentTime}] ${req.method} ${req.url}`);
  next();
};

// Middleware #2: Auth
const auth = (req, res, next) => {
  const { user } = req.query;
  if (user === "Nicholas") {
    next();
  } else {
    const error = new Error("Unauthorized access. You must be Nicholas!");
    error.status = 401;
    next(error);
  }
};

// Middleware #3: Error Handler
const errorHandler = (err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  res.status(err.status || 500).json({ message: err.message });
};

// Apply logger to all routes
app.use(logger);

// Public Route
app.get("/", (req, res) => {
  res.send("Welcome to the public route!");
});

// Protected Route
app.get("/admin", auth, (req, res) => {
  res.send("Welcome, Nicholas! You have admin access.");
});

// Error Handler (should always be the last middleware)
app.use(errorHandler);

// Start server
app.listen(PORT, () =>
  console.log(`\nServer running on http://localhost:${PORT}\n`)
);
