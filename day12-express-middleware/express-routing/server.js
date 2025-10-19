const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("🏠 Welcome to the Home Page!");
});

app.get("/about", (req, res) => {
  res.send("ℹ️ About Page – Built with Express.js!");
});

app.get("/contact", (req, res) => {
  res.send("📞 Contact us at contact@myserver.com");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
