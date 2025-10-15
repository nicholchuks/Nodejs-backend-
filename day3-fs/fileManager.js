const fs = require("fs");

function createFile(filename, content) {
  fs.writeFileSync(filename, content);
  console.log(`${filename} created.`);
}

function readFile(filename) {
  const data = fs.readFileSync(filename, "utf-8");
  console.log(`${filename} content:\n${data}`);
}

function deleteToFile(filename) {
  fs.unlink(filename);
  console.log(`Content deleted from ${filename}`);
}

module.exports = { createFile, readFile, deleteToFile };
