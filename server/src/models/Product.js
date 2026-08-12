const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    originalPrice: {
      type: Number,
      default: null,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    stock: {
      type: String,
      enum: ["in-stock", "low-stock", "out-of-stock"],
      default: "in-stock",
    },

    badge: {
      type: String,
      default: "",
      trim: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isBestSeller: {
      type: Boolean,
      default: false,
    },

    isNew: {
      type: Boolean,
      default: false,
    },

    image: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    stockCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    material: {
      type: String,
      default: "",
      trim: true,
    },

    style: {
      type: String,
      default: "",
      trim: true,
    },

    dimensions: {
      type: String,
      default: "",
      trim: true,
    },

    frame: {
      type: String,
      default: null,
      trim: true,
    },

    handmade: {
      type: Boolean,
      default: true,
    },

    customizable: {
      type: Boolean,
      default: false,
    },
   isActive: {
  type: Boolean,
  default: true,
   },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);