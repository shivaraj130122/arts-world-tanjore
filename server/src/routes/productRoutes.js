const express = require("express");

const {
  getProducts,
  getAdminProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
} = require("../controllers/productController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public product routes
router.get("/", getProducts);

// Admin product list - includes active + muted products
router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAdminProducts
);

router.get("/:id", getProductById);

// Admin-only product management
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

module.exports = router;