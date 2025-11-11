import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import configRoutes from "./routes/configRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import cookieParser from "cookie-parser";
import { securityMiddleware } from "./middleware/securityMiddleware.js";

dotenv.config();

const app = express();

// 🕵️‍♂️ Diagnostic middleware to trace req.query mutations (Express 5)
// Object.defineProperty(Object.getPrototypeOf(app.request), "query", {
//   configurable: true,
//   get() {
//     return this._query;
//   },
//   set(value) {
//     console.error("\n🚨 req.query overwrite attempt detected!");
//     console.error("🔍 URL:", this.originalUrl);

//     // Log the call stack to find which middleware is causing it
//     console.error("📜 Stack trace:");
//     console.error(new Error().stack);

//     this._query = value; // optional, keep it working
//   },
// });

// 🚨 Detect req.query mutation attempts (debugging mode)
// app.use((req, res, next) => {
//   Object.defineProperty(req, "query", {
//     configurable: true,
//     get() {
//       return this._query || {};
//     },
//     set(value) {
//       console.log(
//         `🚨 req.query overwrite attempt detected on: ${req.originalUrl}`
//       );
//       console.log(
//         "🔍 Middleware or route above this line is reassigning req.query!"
//       );
//       this._query = value;
//     },
//   });
//   next();
// });

app.use(express.json()); // to parse JSON body
app.disable("x-powered-by");
app.use(cookieParser());
securityMiddleware(app);

app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/config", configRoutes);
app.use("/api/upload", uploadRoutes);

app.use(notFound);
app.use(errorHandler);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("MongoDB connection error:", err));
