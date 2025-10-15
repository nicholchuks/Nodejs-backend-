const EventEmitter = require("events");

// 1. Create a custom class that inherits EventEmitter
class UserActivity extends EventEmitter {
  constructor() {
    super();
    this.status = "offline";
  }

  // A method to simulate a user action
  login(username) {
    this.status = "online";
    // 2. Use 'emit' to broadcast the event notification
    this.emit("userLoggedIn", username, new Date());
  }

  // A method to simulate a user action
  logout(username) {
    this.status = "offline";
    this.emit("userLoggedOut", username);
  }
}

// Create an instance of the custom event emitter
const activityTracker = new UserActivity();

// 3. Use 'on' to attach listeners (handlers) to the event

// Listener 1: Simple console log
activityTracker.on("userLoggedIn", (user, time) => {
  console.log(
    `[Notification] User: ${user} logged in at ${time.toLocaleTimeString()}`
  );
});

// Listener 2: Perform a specific action (e.g., update a database)
activityTracker.on("userLoggedIn", (user) => {
  console.log(`[Database] Triggering database update for user: ${user}`);
});

// Listener 3: Attach a one-time listener for the logout event
activityTracker.once("userLoggedOut", (user) => {
  console.log(
    `[Cleanup] One-time cleanup triggered for ${user}. This will not run again.`
  );
});

console.log("--- Starting Activity Simulation ---");

// --- Triggering Events ---
activityTracker.login("Alice"); // Emits 'userLoggedIn', runs 2 listeners.
activityTracker.logout("Alice"); // Emits 'userLoggedOut', runs 1 listener.

// Trying to log out again—the 'once' listener is already gone.
console.log("\nTrying to log out again...");
activityTracker.logout("Alice"); // Emits 'userLoggedOut', but no listeners remain.

console.log("--- Simulation Finished ---");
