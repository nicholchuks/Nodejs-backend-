// models/taskModel.js
let tasks = [];
let idCounter = 1;

export const getAllTasks = () => tasks;

export const getTaskById = (id) => tasks.find((t) => t.id === id);

export const createTask = (title, description) => {
  const newTask = { id: idCounter++, title, description };
  tasks.push(newTask);
  return newTask;
};

export const updateTask = (id, data) => {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;
  tasks[index] = { ...tasks[index], ...data };
  return tasks[index];
};

export const deleteTask = (id) => {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
};
