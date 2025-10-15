const EventEmitter = require("events");
const eventEmitter = new EventEmitter();

const userName = "Nicholas";
const userMessage = "Node.js is awesome!";

eventEmitter.on("userLogin", (user) => {
  console.log(`${user} logged in.`);
});

eventEmitter.on("userMessage", (user, message) => {
  console.log(`${user} sent a message: ${message}`);
});

eventEmitter.on("userLogout", (user) => {
  console.log(`${user} logged out.`);
});

// Simulating user activity
eventEmitter.emit("userLogin", userName);
eventEmitter.emit("userMessage", userName, userMessage);
eventEmitter.emit("userLogout", userName);
