// const http = require("http");

// const server = http.createServer((req, res) => {
//   if (req.url === "/") {
//     res.writeHead(200, { "Content-Type": "text/plain" });
//     res.end("Welcome to my Node.js Server 🚀");
//   } else if (req.url === "/about") {
//     res.writeHead(200, { "Content-Type": "text/plain" });
//     res.end("About this server: Built with pure Node.js");
//   } else {
//     res.writeHead(404, { "Content-Type": "text/plain" });
//     res.end("404: Page Not Found");
//   }
// });

// server.listen(3000, () => {
//   console.log("Server is running at http://localhost:3000");
// });

const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("🏠 Welcome to the Home Page!");
  } else if (req.url === "/about") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("ℹ️ About Page: This server is built with pure Node.js!");
  } else if (req.url === "/contact") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("📞 Contact Page: Reach us at contact@myserver.com");
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("❌ 404: Page Not Found");
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
