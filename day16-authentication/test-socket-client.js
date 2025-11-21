// import { io } from "socket.io-client";

// const socket = io("http://localhost:5000", {
//   auth: {
//     token:
//       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MWNmZWFiNWNmNGU4NzhiYzI5YTg5MiIsImlhdCI6MTc2MzYyMjkyOCwiZXhwIjoxNzYzNjIzODI4fQ.UbXZV9rlUC8bW7HBbMuCyo5cEUHGSr-U1QYvJEAIwCM",
//   },
// });

// socket.on("connect", () => console.log("Connected:", socket.id));
// socket.on("taskCreated", (data) => console.log("Task Created:", data));
// socket.on("taskUpdated", (data) => console.log("Task Updated:", data));
// socket.on("taskDeleted", (data) => console.log("Task Deleted:", data));
// socket.on("taskToggled", (data) => console.log("Task Toggled:", data));
// socket.on("onlineUsersUpdated", (data) =>
//   console.log("Online Users Updated:", data)
// );

// import { io } from "socket.io-client";

// const socket = io("http://localhost:4001", {
//   transports: ["websocket"],
// });

// socket.on("connect", () => {
//   console.log("🔵 Connected to Socket.IO server!");
// });

// socket.on("connect_error", (err) => {
//   console.log("🔴 Connection error:", err.message);
// });

// socket.on("disconnect", () => {
//   console.log("⚪ Disconnected from server");
// });

// test-socket-client.js
import { io } from "socket.io-client";

const socket = io("ws://localhost:4001", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("🟢 Connected to WebSocket test server");
  socket.emit("client-message", "Hello from client!");
});

socket.on("server-message", (msg) => {
  console.log("🔵 Received message from server:", msg);
});

socket.on("connect_error", (err) => {
  console.log("🔴 Connection error:", err.message);
});

socket.on("disconnect", () => {
  console.log("⚫ Disconnected from WebSocket server");
});
