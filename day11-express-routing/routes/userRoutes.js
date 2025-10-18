const express = require("express");
const router = express.Router();

// GET all users
router.get("/", (req, res) => {
  res.send("Fetching all users...");
});

// POST a new user
router.post("/", (req, res) => {
  res.send("New user created!");
});

module.exports = router;
