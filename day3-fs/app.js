// const fs = require("fs");

// // Write to a file
// fs.writeFileSync(
//   "message.txt",
//   "Hello, this is my first Node.js file operation!"
// );
// console.log("✅ File created successfully.");

// // Read from the file
// const data = fs.readFileSync("message.txt", "utf-8");
// console.log("📖 File content:", data);

// // Append data to file
// fs.appendFileSync("message.txt", "\nThis is an additional line.");
// console.log("➕ Text appended successfully.");

// // Delete the file (optional test)
// fs.unlinkSync("message.txt");
// console.log("🗑️ File deleted successfully.");

// const fileManager = require("./fileManager");

// fileManager.createFile("notes.txt", "Learning Node.js File System 🚀");
// fileManager.appendToFile("notes.txt", "\nI love learning backend development!");
// fileManager.readFile("notes.txt");

const taskManager = require("./taskManager");

taskManager.createFile("tasks.txt", "Learning Node.js File System");
taskManager.readFile("tasks.txt");
taskManager.deleteFile("tasks.txt");
