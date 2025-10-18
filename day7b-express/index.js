const express = require("express");
const app = express();
const PORT = 3000;

// --- 1. Custom Middleware: Request Logger ---
/**
 * Logs the HTTP method, URL, and current time for every incoming request.
 */
const requestLogger = (req, res, next) => {
  // Get the current time in a readable format
  const currentTime = new Date().toLocaleTimeString();

  // Log the required format
  console.log(`Method: ${req.method}, URL: ${req.url}, Time: ${currentTime}`);

  // MUST call next() to pass control to the next middleware or route handler
  next();
};

// --- 2. Apply Middleware ---
// Apply the requestLogger middleware globally to all routes
app.use(requestLogger);

// Note: We don't need express.json() for this specific example,
// but it's good practice to place it after the logger if you needed it:
// app.use(express.json());

// --- 3. Define Routes ---

// A simple GET route to test the logger
app.get("/status", (req, res) => {
  res.status(200).send("Server is active and request logged successfully.");
});

// A different route to show the URL changes
app.get("/data/users", (req, res) => {
  res.status(200).send("Fetching user data...");
});

// --- 4. Start Server ---
app.listen(PORT, () => {
  console.log(`\nServer running on http://localhost:${PORT}`);
  console.log("Test the routes to see the logger output in the console.\n");
});
