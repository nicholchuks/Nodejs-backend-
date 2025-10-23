let tasks = []; // Temporary in-memory data

exports.getTasks = (req, res) => {
  res.status(200).json(tasks);
};

exports.createTask = (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });

  const newTask = { id: tasks.length + 1, title };
  tasks.push(newTask);
  res.status(201).json(newTask);
};

exports.updateTask = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const task = tasks.find((t) => t.id === parseInt(id));
  if (!task) return res.status(404).json({ message: "Task not found" });

  task.title = title || task.title;
  res.status(200).json(task);
};

exports.deleteTask = (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter((t) => t.id !== parseInt(id));
  res.status(200).json({ message: `Task ${id} deleted` });
};
