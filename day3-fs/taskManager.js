const fs = require("fs");

function createFile(filename, content) {
  fs.writeFileSync(filename, content);
  console.log(`${filename} created.`);
}

function readFile(filename) {
  try {
    const data = fs.readFileSync(filename, "utf-8");
    console.log(`${filename} content:\n${data}`);
  } catch (err) {
    console.error(`❌ Error reading ${filename}:`, err.message);
  }
}

function readFile(filename) {
  const data = fs.readFileSync(filename, "utf-8");
  console.log(`${filename} content:\n${data}`);
}

function deleteFile(filename) {
  fs.unlinkSync(filename);
  console.log(`Content deleted from ${filename}`);
}

module.exports = { createFile, readFile, deleteFile };
