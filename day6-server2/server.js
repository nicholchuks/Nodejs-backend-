const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, "pages");

  switch (req.url) {
    case "/":
      filePath += "/index.html";
      break;
    case "/about":
      filePath += "/about.html";
      break;
    case "/contact":
      filePath += "/contact.html";
      break;
    default:
      filePath += "/404.html";
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/html" });
      return res.end("<h1>Server Error</h1>");
    }

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
