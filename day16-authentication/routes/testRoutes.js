import express from "express";
import mongoose from "mongoose";

const router = express.Router();

/**
 * @route GET /api/test
 * @desc Test entire server, DB, and socket config
 */
router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Test route working!",
    server: "OK - Express running",
    mongo: mongoose.connection.readyState === 1 ? "Connected" : "Not Connected",
    socket: "Socket.io initialized on server",
    port: process.env.PORT,
    environment: process.env.NODE_ENV || "development",
  });
});

export default router;
