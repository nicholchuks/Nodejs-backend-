const http = require("http");

// Define the port for the server to listen on
const PORT = 3000;
// Define the specific path we want to handle
const API_PATH = "/api/info";

// Data to be served as JSON
const infoData = {
  appName: "Simple API Server",
  version: "1.0.0",
  status: "OK",
  timestamp: new Date().toISOString(),
};

// Convert the JavaScript object to a JSON string
const jsonResponse = JSON.stringify(infoData, null, 2);

// Create the request listener function (the core of the server)
const requestListener = (req, res) => {
  // 1. Check the requested URL path
  if (req.url === API_PATH) {
    // --- Handle the API path ---

    // A. Set the HTTP status code and headers
    // Status 200 (OK)
    // Content-Type: application/json tells the client how to interpret the data
    res.writeHead(200, {
      "Content-Type": "application/json",
      // Set the Content-Length header for better performance
      "Content-Length": Buffer.byteLength(jsonResponse),
    });

    // B. Send the JSON string and finalize the response
    res.end(jsonResponse);
  } else {
    // --- Handle all other paths (404 Not Found) ---

    // Status 404 (Not Found)
    res.writeHead(404, { "Content-Type": "text/plain" });

    // Send a simple error message and finalize the response
    res.end("404 Not Found: Only the path /api/info is supported.");
  }
};

// Create the server instance
const server = http.createServer(requestListener);

// Start the server listening on the defined port
server.listen(PORT, () => {
  console.log(`Server is running and listening on port ${PORT}`);
  console.log(`Access the API at: http://localhost:${PORT}${API_PATH}`);
});
