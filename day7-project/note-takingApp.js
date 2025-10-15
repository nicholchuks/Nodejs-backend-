const fs = require("fs/promises");
const readline = require("readline");
const path = require("path");

// --- Configuration ---
const NOTES_FILE = "notes.txt";

// --- Initialization ---

// Create a readline interface for user interaction
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Helper function to ensure the file exists before attempting to read/write
async function ensureFileExists() {
  try {
    await fs.access(NOTES_FILE);
  } catch (error) {
    // If access fails (file doesn't exist), create it with an empty string.
    await fs.writeFile(NOTES_FILE, "", "utf8");
  }
}

// --- Core Application Functions ---

/**
 * Reads all notes and prints them to the console.
 */
async function viewNotes() {
  try {
    await ensureFileExists();
    const data = await fs.readFile(NOTES_FILE, "utf8");

    console.log("\n--- Your Notes ---");

    // Split data by newline and filter out empty lines
    const notes = data.split("\n").filter((line) => line.trim() !== "");

    if (notes.length === 0) {
      console.log("You have no notes yet.");
    } else {
      notes.forEach((note, index) => {
        console.log(`${index + 1}. ${note}`);
      });
    }
    console.log("------------------");
  } catch (error) {
    console.error("Error reading notes:", error.message);
  }
}

/**
 * Prompts the user for a new note and appends it to the file.
 */
function addNote() {
  rl.question("📝 Enter your new note: ", async (noteContent) => {
    if (noteContent.trim()) {
      try {
        // Append the new note followed by a newline character
        await fs.appendFile(NOTES_FILE, `- ${noteContent.trim()}\n`, "utf8");
        console.log(`\nNote added: "${noteContent.trim()}"`);
      } catch (error) {
        console.error("Error adding note:", error.message);
      }
    } else {
      console.log("Note cannot be empty.");
    }
    showMenu();
  });
}

/**
 * Prompts the user to confirm clearing all notes.
 */
function clearNotes() {
  rl.question(
    "⚠️ Are you sure you want to delete ALL notes? (y/N): ",
    async (answer) => {
      if (answer.toLowerCase() === "y") {
        try {
          // Overwrite the file with an empty string
          await fs.writeFile(NOTES_FILE, "", "utf8");
          console.log("\n✅ All notes have been cleared.");
        } catch (error) {
          console.error("Error clearing notes:", error.message);
        }
      } else {
        console.log("\nOperation cancelled.");
      }
      showMenu();
    }
  );
}

// --- Menu and User Interface ---

function showMenu() {
  console.log("\n===== Note App CLI =====");
  console.log("1. View Notes");
  console.log("2. Add New Note");
  console.log("3. Clear All Notes");
  console.log("4. Exit");
  console.log("========================");

  rl.question("Select an option (1-4): ", (choice) => {
    switch (choice.trim()) {
      case "1":
        viewNotes().then(showMenu);
        break;
      case "2":
        addNote(); // Calls showMenu inside the callback
        break;
      case "3":
        clearNotes(); // Calls showMenu inside the callback
        break;
      case "4":
        console.log("\nGoodbye! 👋");
        rl.close();
        break;
      default:
        console.log("\nInvalid choice. Please select 1, 2, 3, or 4.");
        showMenu();
        break;
    }
  });
}

// Start the application
showMenu();
