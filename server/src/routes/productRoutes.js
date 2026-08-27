const express = require("express");

const {
  getProducts,
  getAdminProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateProductStatus,
  deleteProduct,
} = require("../controllers/productController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router =
  express.Router();

// =====================================================
// ADMIN
// =====================================================

router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAdminProducts
);

router.post(
  "/",
  protect,
  adminOnly,
  createProduct
);

router.put(
  "/:id",
  protect,
  adminOnly,
  updateProduct
);

router.patch(
  "/:id/status",
  protect,
  adminOnly,
  updateProductStatus
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);

// =====================================================
// PUBLIC
// =====================================================

router.get(
  "/",
  getProducts
);

router.get(
  "/:id",
  getProductById
);

module.exports = router;