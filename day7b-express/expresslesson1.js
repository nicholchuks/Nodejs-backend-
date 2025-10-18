const express = require("express");
const app = express();

// Define a PORT for your server
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to my Express API 🚀");
});

// About route
app.get("/about", (req, res) => {
  res.send("About Page – Built with Express.js");
});

// API endpoint: Get app info
app.get("/api/info", (req, res) => {
  res.json({
    appName: "Express API Demo",
    version: "1.0.0",
    author: "Nicholas",
    timestamp: new Date().toISOString(),
  });
});

// API endpoint: Get list of users
app.get("/api/users", (req, res) => {
  const users = [
    { id: 1, name: "Alice", role: "Admin" },
    { id: 2, name: "Bob", role: "Editor" },
    { id: 3, name: "Charlie", role: "Viewer" },
  ];
  res.status(200).json(users);
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).send("404 - Page Not Found ❌");
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
