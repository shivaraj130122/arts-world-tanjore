const express = require("express");

const {
  getCollections,
  getCollectionBySlug,
  createCollection,
  updateCollection,
  deleteCollection,
} = require("../controllers/collectionController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getCollections);
router.get("/:slug", getCollectionBySlug);

// Admin routes
router.post(
  "/",
  protect,
  adminOnly,
  createCollection
);

router.put(
  "/:id",
  protect,
  adminOnly,
  updateCollection
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteCollection
);

module.exports = router;