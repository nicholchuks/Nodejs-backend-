// 🔍 Search tasks by title or description
export const searchTasks = asyncHandler(async (req, res) => {
  const query = req.query.query; // e.g. ?query=meeting

  if (!query) {
    return res.status(400).json({ message: "Please provide a search query" });
  }

  // Use MongoDB's $or + $regex for flexible search
  const results = await Task.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ],
  });

  if (results.length === 0) {
    return res.status(404).json({ message: "No matching tasks found" });
  }

  res.status(200).json(results);
});

// GET all tasks
export const getTasks = asyncHandler(async (req, res) => {
  const { completed, page = 1, limit = 5, sort = "createdAt" } = req.query;
  const filter = {};

  // Filter completed or pending
  if (completed === "true") filter.completed = true;
  if (completed === "false") filter.completed = false;

  // Pagination logic
  const skip = (page - 1) * limit;

  // Fetch tasks with filters, pagination, and sorting
  const tasks = await Task.find(filter)
    .sort({ [sort]: -1 }) // descending order
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination metadata
  const totalTasks = await Task.countDocuments(filter);

  res.json({
    totalTasks,
    page: parseInt(page),
    totalPages: Math.ceil(totalTasks / limit),
    tasks,
  });
});
