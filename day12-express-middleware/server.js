const express = require("express");
const app = express();
const PORT = 3000;

// Custom Middleware for Authentication Simulation
const authMiddleware = (req, res, next) => {
  const { user } = req.query;
  if (user === "Nicholas") {
    console.log("User authenticated!");
    next(); // Proceed to route
  } else {
    res
      .status(401)
      .send("Unauthorized: You must be Nicholas to access this page!");
  }
};

// Apply middleware only to this route
app.get("/dashboard", authMiddleware, (req, res) => {
  res.send("Welcome to your dashboard, Nicholas!");
});

// Normal public route (no middleware)
app.get("/", (req, res) => {
  res.send("Public Home Page – No login required!");
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
