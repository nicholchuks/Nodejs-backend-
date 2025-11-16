// routes/adminRoutes.js

/**
 * @openapi
 * tags:
 *   name: Admin
 *   description: Admin-level operations
 */

import express from "express";
import {
  getAdminStats,
  deleteUser,
  getAllUsers,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";

import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * @openapi
 * /api/admin/stats:
 *   get:
 *     summary: Get admin statistics
 *     description: Admin-only analytics such as user count, verified users, etc.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Admin statistics retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 totalUsers: 125
 *                 verifiedUsers: 110
 *                 admins: 3
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - only admin can access this
 */

router.get("/stats", protect, authorize("admin"), getAdminStats);

/**
 * @openapi
 * /api/admin/users:
 *   get:
 *     summary: Get all registered users
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - admin only
 */

router.get("/users", protect, authorize("admin"), getAllUsers);

/**
 * @openapi
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User MongoDB ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: User removed
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin only
 */

router.delete("/users/:id", protect, authorize("admin"), deleteUser);

export default router;
// GET /api/admin/stats → Admin dashboard data
// router.get("/stats", protect, admin, getAdminStats);
// import { admin } from "../middleware/adminMiddleware.js";
