// import { io } from "socket.io-client";

// export const socket = io("http://localhost:5000", {
//   withCredentials: true,
//   transports: ["websocket"],
// });

// socket.on("connect", () => {
//   console.log("Connected:", socket.id);
// });

// socket.on("taskCreated", (data) => {
//   console.log("New task:", data);
// });

import io from "socket.io-client";

const token = localStorage.getItem("token");

export const socket = io("http://localhost:5000", {
  auth: { token },
  withCredentials: true,
});
