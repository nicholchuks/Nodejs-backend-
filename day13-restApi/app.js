const express = require("express");
const app = express();
const userRoutes = require("./routes/users");

app.use(express.json());
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Modular REST API 🚀");
});

app.use((req, res) => {
  res.status(404).json({ message: "404 Not Found" });
});

app.listen(3000, () => console.log("Server running on port 3000"));
