import express from "express";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Test endpoint for environment and DB setup
router.get("/check", (req, res) => {
  res.json({
    success: true,
    message: "Configuration is working correctly!",
    environment: process.env.NODE_ENV,
    port: process.env.PORT,
    mongoURI: process.env.MONGO_URI ? "Mongo URI is set" : "Mongo URI missing",
    jwtSecret: process.env.JWT_SECRET
      ? "JWT Secret is set"
      : "JWT Secret missing",
  });
});

export default router;
