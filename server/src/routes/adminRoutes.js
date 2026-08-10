const express = require("express");

const {
  getAdminProfile,
  getDashboardStats,
  updateUserStatus,
  updateUserRole,
} = require("../controllers/adminController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// All admin routes require authentication
// and administrator access.
router.use(protect);
router.use(adminOnly);

// Admin profile
router.get(
  "/profile",
  getAdminProfile
);

// Dashboard statistics + users
router.get(
  "/stats",
  getDashboardStats
);

// Activate / deactivate user
router.patch(
  "/users/:id/status",
  updateUserStatus
);

// Change user role
router.patch(
  "/users/:id/role",
  updateUserRole
);

module.exports = router;