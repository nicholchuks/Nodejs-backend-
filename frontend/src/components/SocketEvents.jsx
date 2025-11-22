import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { toast } from "react-toastify";

const SocketEvents = () => {
  const { socket, connected } = useSocket();

  useEffect(() => {
    if (!connected || !socket) return;

    const handleRoomMessage = (data) => {
      toast.info(`Room message: ${data.message}`);
    };

    const handleOnlineUsersUpdated = ({ onlineUsers }) => {
      console.log("Online users:", onlineUsers);
    };

    socket.on("roomMessage", handleRoomMessage);
    socket.on("onlineUsersUpdated", handleOnlineUsersUpdated);

    return () => {
      socket.off("roomMessage", handleRoomMessage);
      socket.off("onlineUsersUpdated", handleOnlineUsersUpdated);
    };
  }, [connected, socket]);

  return null; // no UI needed
};

export default SocketEvents;

// import { useEffect } from "react";
// import { useSocket } from "../context/SocketContext"; // adjust path
// import { toast } from "react-toastify";

// export default function SocketEvents({ token, userId }) {
//   const socketContext = useSocket();

//   useEffect(() => {
//     if (!socketContext || !socketContext.socket) return;

//     const { socket } = socketContext;

//     socket.on("connect", () => {
//       console.log("🟢 WebSocket connected:", socket.id);
//       toast.success("WebSocket connected!");
//     });

//     socket.on("disconnect", () => {
//       console.log("🔴 WebSocket disconnected");
//       toast.error("WebSocket disconnected");
//     });

//     socket.on("taskCreated", ({ task }) => {
//       toast.info(`New task: ${task.title}`);
//     });

//     socket.on("taskUpdated", ({ task }) => {
//       toast.info(`Task updated: ${task.title}`);
//     });

//     socket.on("taskDeleted", ({ taskId }) => {
//       toast.warning(`Task deleted (ID: ${taskId})`);
//     });

//     socket.on("taskToggled", ({ task }) => {
//       toast.info(`Task "${task.title}" is now ${task.status}`);
//     });

//     return () => {
//       socket.off("connect");
//       socket.off("disconnect");
//       socket.off("taskCreated");
//       socket.off("taskUpdated");
//       socket.off("taskDeleted");
//       socket.off("taskToggled");
//     };
//   }, [socketContext]);

//   return null;
// }
