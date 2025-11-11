// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import configRoutes from "./routes/configRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { securityMiddleware } from "./middleware/securityMiddleware.js";

dotenv.config();

const app = express();

//  Core middlewares
app.use(express.json()); // Parse JSON body
app.disable("x-powered-by");
app.use(cookieParser());

//  Security middlewares (Helmet, XSS, CORS, etc.)
securityMiddleware(app);

//  Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/config", configRoutes);
app.use("/api/upload", uploadRoutes);

//  Error handling
app.use(notFound);
app.use(errorHandler);

// Database + Server Start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () =>
      console.log(` Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("MongoDB connection error:", err));
