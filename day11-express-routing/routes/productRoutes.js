const express = require("express");
const router = express.Router();

// GET all products
router.get("/", (req, res) => {
  res.send("Fetching all products...");
});

// POST a new product
router.post("/", (req, res) => {
  res.send("New product added!");
});

module.exports = router;
