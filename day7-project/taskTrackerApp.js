const fs = require("fs/promises");
const { Command } = require("commander");
const program = new Command();

// --- Configuration ---
const TASKS_FILE = "tasks.json";

// --- Helper Functions for Data Persistence ---

/**
 * Ensures the tasks.json file exists and returns the current task list.
 * Initializes the file with an empty array if it doesn't exist.
 * @returns {Promise<Array<{id: number, text: string, completed: boolean}>>}
 */
async function loadTasks() {
  try {
    const data = await fs.readFile(TASKS_FILE, "utf8");
    // If file exists but is empty, return empty array
    return data.trim() ? JSON.parse(data) : [];
  } catch (error) {
    // If file does not exist (ENOENT), create it with an empty array
    if (error.code === "ENOENT") {
      await fs.writeFile(TASKS_FILE, "[]", "utf8");
      return [];
    }
    // Re-throw any other error
    throw error;
  }
}

/**
 * Saves the task list back to the JSON file.
 * @param {Array<Object>} tasks
 */
async function saveTasks(tasks) {
  try {
    const json = JSON.stringify(tasks, null, 2);
    await fs.writeFile(TASKS_FILE, json, "utf8");
  } catch (error) {
    console.error("Error saving tasks:", error.message);
  }
}

/**
 * Calculates the next unique ID for a new task.
 * @param {Array<Object>} tasks
 * @returns {number}
 */
function getNextId(tasks) {
  if (tasks.length === 0) {
    return 1;
  }
  // Find the max existing ID and add 1
  const maxId = tasks.reduce((max, task) => Math.max(max, task.id), 0);
  return maxId + 1;
}

// --- CLI Commands (Commander Actions) ---

/**
 * Adds a new task to the list.
 * @param {string} taskText
 */
async function addTask(taskText) {
  try {
    const tasks = await loadTasks();
    const newTask = {
      id: getNextId(tasks),
      text: taskText,
      completed: false,
    };

    tasks.push(newTask);
    await saveTasks(tasks);

    console.log(`✅ Task added (ID: ${newTask.id}): "${taskText}"`);
  } catch (error) {
    console.error("Failed to add task:", error.message);
  }
}

/**
 * Lists all existing tasks.
 */
async function listTasks() {
  try {
    const tasks = await loadTasks();
    console.log("\n--- Your Task List ---");

    if (tasks.length === 0) {
      console.log(
        'You have no tasks! Use "task-tracker add <text>" to create one.'
      );
    } else {
      tasks.forEach((task) => {
        const status = task.completed ? "✅" : "⏳";
        console.log(`${status} [${task.id}] ${task.text}`);
      });
    }
    console.log("----------------------\n");
  } catch (error) {
    console.error("Failed to list tasks:", error.message);
  }
}

/**
 * Deletes a task by its ID.
 * @param {string} taskId
 */
async function deleteTask(taskId) {
  const id = parseInt(taskId);

  if (isNaN(id)) {
    console.error("❌ Error: Task ID must be a number.");
    return;
  }

  try {
    const tasks = await loadTasks();
    const initialLength = tasks.length;

    // Filter out the task with the matching ID
    const updatedTasks = tasks.filter((task) => task.id !== id);

    if (updatedTasks.length === initialLength) {
      console.log(`⚠️ Task with ID ${id} not found.`);
    } else {
      await saveTasks(updatedTasks);
      console.log(`🗑️ Task ID ${id} deleted successfully.`);
    }
  } catch (error) {
    console.error("Failed to delete task:", error.message);
  }
}

// --- CLI Setup (Commander) ---

program
  .name("task-tracker")
  .description("A simple command-line task management application.")
  .version("1.0.0");

// Command: add <taskText>
program
  .command("add")
  .argument("<taskText>", "The description of the new task")
  .description("Add a new task to the list")
  .action(addTask);

// Command: list
program
  .command("list")
  .description("Display all current tasks")
  .action(listTasks);

// Command: delete <taskId>
program
  .command("delete")
  .argument("<taskId>", "The ID of the task to delete")
  .description("Delete a task by its ID")
  .action(deleteTask);

// Parse and run the commands
program.parse(process.argv);
