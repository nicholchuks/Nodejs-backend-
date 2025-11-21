// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import jwt from "jsonwebtoken";
import User from "./models/userModel.js";

import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import configRoutes from "./routes/configRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import testRoutes from "./routes/testRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { securityMiddleware } from "./middleware/securityMiddleware.js";

import { swaggerUi, swaggerSpec } from "./api-docs/swagger.js";
import { Server } from "socket.io";

import path from "path";

dotenv.config();

const app = express();
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "public")));

// Core middlewares
app.use(express.json());
app.disable("x-powered-by");
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Security & Swagger
securityMiddleware(app);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/config", configRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api", testRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Database + Server start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    const server = app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );

    // ------------------- Socket.io Setup -------------------
    const io = new Server(server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    // Attach io to app for controllers
    app.set("io", io);

    const onlineUsers = new Set();

    // Authenticate sockets
    io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth?.token;
        if (!token) return next(new Error("No token provided"));

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return next(new Error("User not found"));

        socket.user = user;
        next();
      } catch (error) {
        next(new Error("Authentication failed"));
      }
    });

    io.on("connection", (socket) => {
      const user = socket.user;
      onlineUsers.add(user._id.toString());

      socket.join(user._id.toString());
      console.log("User connected:", user.name);

      // Test listener
      socket.on("testRoomMessage", (data) => {
        console.log(`📩 Received from ${user.name}:`, data);
        io.to(user._id.toString()).emit("roomMessage", {
          from: "server",
          message: data.message,
        });
      });

      // Emit online users to admin sockets safely
      const emitOnlineUsers = () => {
        const adminSockets = Array.from(io.sockets.sockets.values()).filter(
          (s) => s.user?.role === "admin"
        );
        adminSockets.forEach((s) =>
          s.emit("onlineUsersUpdated", { onlineUsers: Array.from(onlineUsers) })
        );
      };

      emitOnlineUsers();

      socket.on("disconnect", () => {
        onlineUsers.delete(user._id.toString());
        console.log("User disconnected:", user._id);
        emitOnlineUsers();
      });
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// // server.js
// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import cors from "cors";

// import jwt from "jsonwebtoken";
// import User from "./models/userModel.js";

// import taskRoutes from "./routes/taskRoutes.js";
// import authRoutes from "./routes/authRoutes.js";
// import adminRoutes from "./routes/adminRoutes.js";
// import configRoutes from "./routes/configRoutes.js";
// import uploadRoutes from "./routes/uploadRoutes.js";
// import testRoutes from "./routes/testRoutes.js";

// import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
// import { securityMiddleware } from "./middleware/securityMiddleware.js";

// import { swaggerUi, swaggerSpec } from "./api-docs/swagger.js";
// import { Server } from "socket.io";

// import path from "path";

// dotenv.config();

// const app = express();

// const __dirname = path.resolve();

// app.use(express.static(path.join(__dirname, "public")));

// //  Core middlewares
// app.use(express.json()); // Parse JSON body
// app.disable("x-powered-by");
// app.use(cookieParser());
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//   })
// );

// //  Security middlewares (Helmet, XSS, CORS, etc.)
// securityMiddleware(app);
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// //  Routes
// app.use("/api/tasks", taskRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/config", configRoutes);
// app.use("/api/upload", uploadRoutes);
// app.use("/api", testRoutes);

// //  Error handling
// app.use(notFound);
// app.use(errorHandler);

// // Database + Server Start
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("Connected to MongoDB");
//     const server = app.listen(process.env.PORT, () =>
//       console.log(` Server running on port ${process.env.PORT}`)
//     );
//     // ------------------- Socket.io Setup -------------------
//     const io = new Server(server, {
//       cors: {
//         origin: "http://localhost:3000", // Replace with your frontend URL in production
//         methods: ["GET", "POST"],
//         credentials: true,
//       },
//     });

//     io.use(async (socket, next) => {
//       try {
//         const token = socket.handshake.auth?.token;

//         if (!token) {
//           return next(new Error("No token provided"));
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         const user = await User.findById(decoded.id);

//         if (!user) {
//           return next(new Error("User not found"));
//         }

//         socket.user = user; // attach user to the socket

//         next();
//       } catch (error) {
//         next(new Error("Authentication failed"));
//       }
//     });

//     // Make io accessible in controllers
//     app.set("io", io);

//     //Add user-specific room logic INSIDE io.on("connection")
//     const onlineUsers = new Set(); // track online users

//     io.on("connection", (socket) => {
//       const user = socket.user;
//       onlineUsers.add(user._id.toString());

//       // join private room
//       socket.join(user._id.toString());

//       console.log("User connected:", user.name);

//       // Temporary test listener
//       socket.on("testRoomMessage", (data) => {
//         console.log(`📩 Received from ${user.name}:`, data);
//         // Send back to the same user room
//         io.to(user._id.toString()).emit("roomMessage", {
//           from: "server",
//           message: data.message,
//         });
//       });

//       // Emit online users to all admin sockets
//       const adminSockets = Array.from(
//         io?.sockets?.sockets?.values() || []
//       ).filter((s) => s.user?.role === "admin");

//       adminSockets.forEach((s) =>
//         s.emit("onlineUsersUpdated", { onlineUsers: Array.from(onlineUsers) })
//       );

//       socket.on("disconnect", () => {
//         onlineUsers.delete(user._id.toString());
//         console.log("User disconnected:", user._id);

//         // Update online users for admins
//         const adminSockets = Array.from(
//           io?.sockets?.sockets?.values() || []
//         ).filter((s) => s.user?.role === "admin");
//         adminSockets.forEach((s) =>
//           s.emit("onlineUsersUpdated", { onlineUsers: Array.from(onlineUsers) })
//         );
//       });
//     });
//   })
//   .catch((err) => console.error("MongoDB connection error:", err));
