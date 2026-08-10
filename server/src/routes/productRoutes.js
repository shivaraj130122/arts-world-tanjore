const express = require("express");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public product routes
router.get("/", getProducts);
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

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);

module.exports = router;