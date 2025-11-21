import { Server } from "socket.io";

const io = new Server(4001, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

console.log("Socket.io test server running on port 4001");
