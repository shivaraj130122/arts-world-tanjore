const express = require("express");

const {
  getCollections,
  getAdminCollections,
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
// ADMIN
// =====================================================

router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAdminCollections
);

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

router.patch(
  "/:id/status",
  protect,
  adminOnly,
  updateCollectionStatus
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteCollection
);

// =====================================================
// PUBLIC
// =====================================================

router.get(
  "/:slug",
  getCollectionBySlug
);

router.get(
  "/",
  getCollections
);

module.exports = router;