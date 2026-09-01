const express = require("express");

const {
  getMerchantProductFeed,
} = require("../controllers/merchantFeedController");

const router = express.Router();

router.get("/products.xml", getMerchantProductFeed);

module.exports = router;