// routes/adminRoutes.js
import express from "express";
import {
  getAdminStats,
  deleteUser,
  getAllUsers,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
// import { admin } from "../middleware/adminMiddleware.js";

import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// GET /api/admin/stats → Admin dashboard data
// router.get("/stats", protect, admin, getAdminStats);
router.get("/stats", protect, authorize("admin"), getAdminStats);
router.get("/users", protect, authorize("admin"), getAllUsers);
router.delete("/users/:id", protect, authorize("admin"), deleteUser);

export default router;
