import { useEffect } from "react";
import { socket } from "./socket";

export default function TaskListener() {
  useEffect(() => {
    socket.on("taskAdded", (task) => {
      console.log("🔥 NEW TASK ARRIVED:", task);
    });

    socket.on("taskUpdated", (task) => {
      console.log("🔄 TASK UPDATED:", task);
    });

    socket.on("taskDeleted", (taskId) => {
      console.log("🗑 TASK DELETED:", taskId);
    });

    socket.on("taskToggled", (task) => {
      console.log("🔁 TASK TOGGLED:", task);
    });

    return () => {
      socket.off("taskAdded");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
      socket.off("taskToggled");
    };
  }, []);

  return null; // component doesn't render anything
}
