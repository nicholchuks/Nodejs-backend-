const express = require("express");
const router = express.Router();

let users = [
  { id: 1, name: "Nicholas", age: 25 },
  { id: 2, name: "Chuks", age: 27 },
];

// PUT – Replace entire user
router.put("/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, age } = req.body;

  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex === -1)
    return res.status(404).json({ message: "User not found" });

  users[userIndex] = { id: userId, name, age }; // full replacement
  res.json(users[userIndex]);
});

// PATCH – Update specific fields
router.patch("/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, age } = req.body;

  const user = users.find((u) => u.id === userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (name) user.name = name;
  if (age) user.age = age;

  res.json(user);
});

module.exports = router;
