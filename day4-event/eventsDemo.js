// const EventEmitter = require("events");

// const eventEmitter = new EventEmitter();

// // Register (listen) for an event
// eventEmitter.on("greet", (name) => {
//   console.log(`Hello, ${name}! Welcome to Node.js events 🚀`);
// });

// eventEmitter.on("greet", () => {
//   console.log("This is another listener for the same event!");
// });

// const EventEmitter = require("events");
// const eventEmitter = new EventEmitter();

// eventEmitter.on("order", () => {
//   console.log("🛒 Order received!");
// });

// eventEmitter.on("order", () => {
//   console.log("📦 Order is being processed...");
// });

// eventEmitter.on("order", () => {
//   console.log("🚚 Order shipped!");
// });

// eventEmitter.emit("order");

const EventEmitter = require("events");
const eventEmitter = new EventEmitter();

eventEmitter.on("userConnected", (username) => {
  console.log(`✅ ${username} has connected.`);
});

eventEmitter.on("userDisconnected", (username) => {
  console.log(`❌ ${username} has disconnected.`);
});

// Simulating user activity
eventEmitter.emit("userConnected", "Nicholas");
setTimeout(() => eventEmitter.emit("userDisconnected", "Nicholas"), 2000);

module.exports = eventEmitter;
