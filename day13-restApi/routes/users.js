const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const dataFile = path.join(__dirname, "../data/users.json");

// Helper function to read users
function getUsers() {
  if (!fs.existsSync(dataFile)) return [];
  const data = fs.readFileSync(dataFile, "utf-8");
  return data ? JSON.parse(data) : [];
}

// Helper to save users
function saveUsers(users) {
  fs.writeFileSync(dataFile, JSON.stringify(users, null, 2));
}

// GET all users
router.get("/", (req, res) => {
  res.json(getUsers());
});

// POST a new user
router.post("/", (req, res) => {
  const users = getUsers();
  const newUser = { id: Date.now(), ...req.body };
  users.push(newUser);
  saveUsers(users);
  res.status(201).json(newUser);
});

// PUT update user
router.put("/:id", (req, res) => {
  const users = getUsers();
  const userIndex = users.findIndex((u) => u.id == req.params.id);
  if (userIndex === -1)
    return res.status(404).json({ message: "User not found" });
  users[userIndex] = { ...users[userIndex], ...req.body };
  saveUsers(users);
  res.json(users[userIndex]);
});

// DELETE a user
router.delete("/:id", (req, res) => {
  let users = getUsers();
  users = users.filter((u) => u.id != req.params.id);
  saveUsers(users);
  res.json({ message: "User deleted" });
});

module.exports = router;
