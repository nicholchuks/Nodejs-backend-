import React, { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { fetchTasks } from "../api/taskApi";
import { toast } from "react-toastify";

const TaskList = () => {
  const { socket, connected, reconnect } = useSocket(); // include reconnect
  const [tasks, setTasks] = useState([]);

  // Fetch tasks on mount
  useEffect(() => {
    const getTasks = async () => {
      try {
        const data = await fetchTasks();
        setTasks(data.tasks);
      } catch (error) {
        toast.error("Failed to fetch tasks. Please login again.");
      }
    };
    getTasks();
  }, []);

  // Listen for WebSocket events safely
  useEffect(() => {
    if (!connected || !socket) return;

    // Reconnect automatically if token changes
    socket.on("connect_error", () => {
      reconnect();
    });

    const handleTaskCreated = ({ task }) => {
      setTasks((prev) => [task, ...prev]);
      toast.success(`New task created: ${task.title}`);
    };

    const handleTaskUpdated = ({ task }) => {
      setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
      toast.info(`Task updated: ${task.title}`);
    };

    const handleTaskDeleted = ({ taskId }) => {
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      toast.warn("Task deleted");
    };

    socket.on("taskCreated", handleTaskCreated);
    socket.on("taskUpdated", handleTaskUpdated);
    socket.on("taskDeleted", handleTaskDeleted);

    return () => {
      socket.off("taskCreated", handleTaskCreated);
      socket.off("taskUpdated", handleTaskUpdated);
      socket.off("taskDeleted", handleTaskDeleted);
      socket.off("connect_error"); // cleanup reconnect listener
    };
  }, [connected, socket, reconnect]);

  return (
    <div>
      <h2>Task List</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            {task.title} - {task.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
