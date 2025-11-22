import axiosInstance from "./axiosInstance";

// Fetch all tasks
export const fetchTasks = async () => {
  const res = await axiosInstance.get("/tasks");
  return res.data;
};

// Create a new task
export const createTask = async (taskData) => {
  const res = await axiosInstance.post("/tasks", taskData);
  return res.data;
};

// Update a task
export const updateTask = async (taskId, taskData) => {
  const res = await axiosInstance.put(`/tasks/${taskId}`, taskData);
  return res.data;
};

// Delete a task
export const deleteTask = async (taskId) => {
  const res = await axiosInstance.delete(`/tasks/${taskId}`);
  return res.data;
};
