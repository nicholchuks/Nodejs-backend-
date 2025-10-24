let tasks = [];

// Get all tasks
exports.getTasks = (req, res) => {
  res.status(200).json(tasks);
};

// Get completed tasks only
exports.getCompletedTasks = (req, res) => {
  const completedTasks = tasks.filter((t) => t.completed);
  res.status(200).json(completedTasks);
};

// Create a new task
exports.createTask = (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });

  const newTask = {
    id: tasks.length + 1,
    title,
    completed: false,
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
};

// Update a task (title or completion status)
exports.updateTask = (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  const task = tasks.find((t) => t.id === parseInt(id));
  if (!task) return res.status(404).json({ message: "Task not found" });

  if (title) task.title = title;
  if (completed !== undefined) task.completed = completed;

  res.status(200).json(task);
};

// Delete a task
exports.deleteTask = (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter((t) => t.id !== parseInt(id));
  res.status(200).json({ message: `Task ${id} deleted` });
};
