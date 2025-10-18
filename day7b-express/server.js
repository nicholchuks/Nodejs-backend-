const express = require("express");
const app = express();

// Define a PORT for your server
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

let messages = [{ id: 1, name: "Nicholas", message: "Hello from Node.js!" }];

app.post("/api/messages", (req, res) => {
  const { name, message } = req.body;

  if (!name || !message) {
    return res.status(400).json({ error: "Name and message are required!" });
  }

  const newMessage = {
    id: messages.length + 1,
    name,
    message,
  };

  messages.push(newMessage);
  res
    .status(201)
    .json({ message: "Message added successfully!", data: newMessage });
});

app.get("/api/messages", (req, res) => {
  res.json(messages);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
