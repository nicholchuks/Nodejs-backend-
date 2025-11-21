import { io } from "socket.io-client";

// Replace with a real JWT from your login response
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MWNmZWFiNWNmNGU4NzhiYzI5YTg5MiIsImlhdCI6MTc2Mzc1NzE1NCwiZXhwIjoxNzYzNzU4MDU0fQ.jC8snIDrvb1fmGvpGz6wj-O90ksfYvy7ALleTpCJgXE";

const socket = io("http://localhost:5000", {
  auth: { token },
});

socket.on("connect", () => {
  console.log("🟢 Connected as:", socket.id);

  // Join your own room (server does this automatically)
  const userId = "gsdsdthdh26hdhgh7gwgui"; // you can also get this from decoded JWT
  console.log("Joined room:", userId);

  // Emit a test event to your room
  socket.emit("testRoomMessage", { message: "Hello from client!" });
});

// Listen to events sent from server to this room
socket.on("roomMessage", (data) => {
  console.log("📩 Message received in your room:", data);
});

socket.on("connect_error", (err) => {
  console.error("🔴 Connection Error:", err.message);
});

socket.on("disconnect", () => {
  console.log("🔵 Disconnected");
});
