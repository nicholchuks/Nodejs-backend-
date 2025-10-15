const fs = require("fs");
const readline = require("readline");

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const NOTES_FILE = "notes.txt";

// Helper: Read existing notes
function readNotes() {
  if (!fs.existsSync(NOTES_FILE)) return [];
  const data = fs.readFileSync(NOTES_FILE, "utf8");
  return data ? data.split("\n").filter((line) => line.trim() !== "") : [];
}

// Helper: Save notes to file
function saveNotes(notes) {
  fs.writeFileSync(NOTES_FILE, notes.join("\n"));
}

function showMenu() {
  console.log("\n📋 What do you want to do?");
  console.log("1. Add a note");
  console.log("2. View all notes");
  console.log("3. Delete a note");
  console.log("4. Exit");

  rl.question("Enter your choice (1-4): ", (choice) => {
    switch (choice) {
      case "1":
        addNote();
        break;
      case "2":
        viewNotes();
        break;
      case "3":
        deleteNote();
        break;
      case "4":
        console.log("👋 Goodbye!");
        rl.close();
        break;
      default:
        console.log("❌ Invalid choice, please try again.");
        showMenu();
    }
  });
}

function addNote() {
  rl.question("📝 Enter your note: ", (note) => {
    const notes = readNotes();
    notes.push(note);
    saveNotes(notes);
    console.log("✅ Note added!");
    showMenu();
  });
}

function viewNotes() {
  const notes = readNotes();
  if (notes.length === 0) {
    console.log("📭 No notes found.");
  } else {
    console.log("\n🗒️ Your Notes:");
    notes.forEach((note, i) => console.log(`${i + 1}. ${note}`));
  }
  showMenu();
}

function deleteNote() {
  const notes = readNotes();
  if (notes.length === 0) {
    console.log("📭 No notes to delete.");
    return showMenu();
  }

  console.log("\n🗑️ Select a note to delete:");
  notes.forEach((note, i) => console.log(`${i + 1}. ${note}`));

  rl.question("Enter the number of the note: ", (num) => {
    const index = parseInt(num) - 1;
    if (index >= 0 && index < notes.length) {
      notes.splice(index, 1);
      saveNotes(notes);
      console.log("✅ Note deleted!");
    } else {
      console.log("❌ Invalid number.");
    }
    showMenu();
  });
}

console.log("Welcome to CLI Notes App 🗒️");
showMenu();
