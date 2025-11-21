import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  auth: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MWNmZWFiNWNmNGU4NzhiYzI5YTg5MiIsImlhdCI6MTc2Mzc1NTI3OCwiZXhwIjoxNzYzNzU2MTc4fQ.vd-uRRYE8bVNCM1Nzl7gT44LkL5SCh6erUgSGQncqe4",
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
