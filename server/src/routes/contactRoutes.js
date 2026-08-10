const express = require("express");

const {
  createContactMessage,
  getContactMessages,
  getContactMessageById,
  updateContactMessageStatus,
  deleteContactMessage,
} = require("../controllers/contactController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Customer contact form
router.post(
  "/",
  createContactMessage
);

// Admin contact message management
router.get(
  "/",
  protect,
  adminOnly,
  getContactMessages
);

router.get(
  "/:id",
  protect,
  adminOnly,
  getContactMessageById
);

router.put(
  "/:id/status",
  protect,
  adminOnly,
  updateContactMessageStatus
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteContactMessage
);

module.exports = router;