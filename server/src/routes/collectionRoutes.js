const express = require("express");

const {
  getCollections,
  getCollectionBySlug,
} = require("../controllers/collectionController");

const router = express.Router();

router.get("/", getCollections);
router.get("/:slug", getCollectionBySlug);

module.exports = router;