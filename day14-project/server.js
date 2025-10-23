const express = require("express");
const taskRoutes = require("./routes/tasksRoutes");

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Mount the task routes
app.use("/api/tasks", taskRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Modular Task Management API!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
