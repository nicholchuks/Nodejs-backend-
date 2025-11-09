import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import configRoutes from "./routes/configRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import helmet from "helmet";
import { rateLimiter } from "./middleware/rateLimiter.js";
import { securityMiddleware } from "./middleware/security.js";

dotenv.config();

const app = express();

app.use(express.json()); // to parse JSON body
app.use(helmet());
app.use(rateLimiter);
securityMiddleware(app);

app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
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
