const express = require("express");

const {
  getCategories,
  getAllCategoriesAdmin,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
} = require("../controllers/categoryController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// ADMIN ROUTES
// =====================================================

// Get ALL categories for Admin Dashboard
// Includes ACTIVE + MUTED categories
router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAllCategoriesAdmin
);

// Create category
router.post(
  "/",
  protect,
  adminOnly,
  createCategory
);

// Update category
router.put(
  "/:id",
  protect,
  adminOnly,
  updateCategory
);

// Mute / Unmute category
router.patch(
  "/:id/status",
  protect,
  adminOnly,
  updateCategoryStatus
);

// Delete category
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteCategory
);

// =====================================================
// PUBLIC ROUTES
// =====================================================

// Only ACTIVE categories
router.get("/", getCategories);

// Get one ACTIVE category
router.get("/:slug", getCategoryBySlug);

module.exports = router;