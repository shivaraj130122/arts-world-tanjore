const express = require("express");

const {
  getCategories,
  getAdminCategories,
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
// ADMIN
// =====================================================

router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAdminCategories
);

router.post(
  "/",
  protect,
  adminOnly,
  createCategory
);

router.put(
  "/:id",
  protect,
  adminOnly,
  updateCategory
);

router.patch(
  "/:id/status",
  protect,
  adminOnly,
  updateCategoryStatus
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteCategory
);

// =====================================================
// PUBLIC
// =====================================================

router.get(
  "/:slug",
  getCategoryBySlug
);

router.get(
  "/",
  getCategories
);

module.exports = router;