import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  auth: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MWNmZWFiNWNmNGU4NzhiYzI5YTg5MiIsImlhdCI6MTc2Mzc5ODI4NywiZXhwIjoxNzYzNzk5MTg3fQ.akV8DWhNs-pdmvmYswDwhn9UC6Uetljr9kN7JQQje5E",
  },
});

socket.on("connect", () => console.log("Connected:", socket.id));
socket.on("taskCreated", (data) => console.log("Task Created:", data));
socket.on("taskUpdated", (data) => console.log("Task Updated:", data));
socket.on("taskDeleted", (data) => console.log("Task Deleted:", data));
socket.on("taskToggled", (data) => console.log("Task Toggled:", data));
socket.on("onlineUsersUpdated", (data) =>
  console.log("Online Users Updated:", data)
);
