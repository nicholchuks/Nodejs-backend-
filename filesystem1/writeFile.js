const fs = require("fs");

//create a file
fs.writeFile("example.txt", "this is an example", (err) => {
  if (err) console.log(err);
  else {
    console.log("file successfully created");
    fs.readFile("example.txt", "utf8", (err, file) => {
      if (err) console.log(err);
      else console.log(file);
    });
  }
});

//to rename a file
fs.rename("example.txt", "example2.txt", (err) => {
  if (err) console.log(err);
  else console.log("sucessfully renamed the file");
});

//to append a file
fs.appendFile("example2.txt", " Some data being appended", (err) => {
  if (err) console.log(err);
  else console.log("Successfully appended some file to the data.");
});

//to delete a file
fs.unlink("example2.txt", (err) => {
  if (err) console.log(err);
  else console.log("successfully deleted file");
});

const fs = require("fs");

const readStream = fs.createReadStream("./example.txt", "utf8");
const writeStream = fs.createWriteStream("./example2.txt");
readStream.on("data", (chunk) => {
  writeStream.write(chunk);
});
