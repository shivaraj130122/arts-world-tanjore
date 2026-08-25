const express = require("express");

const {
  getCollections,
  getAllCollectionsAdmin,
  getCollectionBySlug,
  createCollection,
  updateCollection,
  updateCollectionStatus,
  deleteCollection,
} = require("../controllers/collectionController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// ADMIN ROUTES
// =====================================================

// Get all collections including muted
router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAllCollectionsAdmin
);

// Create collection
router.post(
  "/",
  protect,
  adminOnly,
  createCollection
);

// Update collection
router.put(
  "/:id",
  protect,
  adminOnly,
  updateCollection
);

// Mute / Unmute collection
router.patch(
  "/:id/status",
  protect,
  adminOnly,
  updateCollectionStatus
);

// Delete collection
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteCollection
);

// =====================================================
// PUBLIC ROUTES
// =====================================================

// Get active collections only
router.get(
  "/",
  getCollections
);

// Get one active collection
router.get(
  "/:slug",
  getCollectionBySlug
);

module.exports = router;