const Product = require("../models/Product");
const Category = require("../models/Category");
// =====================================================
// SYNC CATEGORY ITEM COUNT
// Counts active products only and supports both slug
// and legacy title category values.
// =====================================================

const syncCategoryItemCount = async (categoryValue) => {
  const value = String(categoryValue || "").trim();
  if (!value) return;

  const categoryDoc = await Category.findOne({
    $or: [
      { slug: value.toLowerCase() },
      { title: value },
    ],
  });

  if (!categoryDoc) return;

  const match = [{ category: categoryDoc.slug }];
  if (
    categoryDoc.title &&
    categoryDoc.title !== categoryDoc.slug
  ) {
    match.push({ category: categoryDoc.title });
  }

  const itemCount = await Product.countDocuments({
    $or: match,
    isActive: { $ne: false },
  });

  await Category.findByIdAndUpdate(categoryDoc._id, {
    itemCount,
  });
};


// =====================================================
// PUBLIC PRODUCTS
// =====================================================

const getProducts = async (
  req,
  res
) => {
  try {
    const {
      category,
      featured,
      bestSeller,
      newArrival,
    } = req.query;

    const filter = {
      isActive: { $ne: false },
    };

    // =================================================
    // CATEGORY FILTER
    //
    // New products:
    // category = slug
    //
    // Old products:
    // category = title
    //
    // Both are supported.
    // =================================================

    if (category) {
      const normalizedCategory =
        String(category)
          .trim()
          .toLowerCase();

      const categoryDoc =
        await Category.findOne({
          slug: normalizedCategory,
        });

      if (categoryDoc) {
        filter.category = {
          $in: [
            categoryDoc.slug,
            categoryDoc.title,
          ],
        };
      } else {
        filter.category =
          normalizedCategory;
      }
    }

    if (featured === "true") {
      filter.isFeatured = true;
    }

    if (bestSeller === "true") {
      filter.isBestSeller = true;
    }

    if (newArrival === "true") {
      filter.isNew = true;
    }

    const products =
      await Product.find(
        filter
      ).sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(
      "Get products error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch products",
    });
  }
};

// =====================================================
// ADMIN ALL PRODUCTS
// Active + muted
// =====================================================

const getAdminProducts =
  async (req, res) => {
    try {
      const products =
        await Product.find({}).sort({
          createdAt: -1,
        });

      return res.status(200).json({
        success: true,
        count: products.length,
        products,
      });
    } catch (error) {
      console.error(
        "Get admin products error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch admin products",
      });
    }
  };

// =====================================================
// GET ONE PRODUCT
// =====================================================

const getProductById =
  async (req, res) => {
    try {
      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {
        return res.status(404).json({
          success: false,
          message:
            "Product not found",
        });
      }

      await syncCategoryItemCount(product.category);

      return res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      console.error(
        "Get product error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch product",
      });
    }
  };

// =====================================================
// NORMALIZE CATEGORY
// =====================================================

const normalizeCategory = async (
  category
) => {
  const value =
    String(category || "")
      .trim();

  if (!value) {
    return "";
  }

  const lower =
    value.toLowerCase();

  const categoryDoc =
    await Category.findOne({
      $or: [
        { slug: lower },
        { title: value },
      ],
    });

  if (!categoryDoc) {
    throw new Error(
      "Selected category does not exist"
    );
  }

  if (categoryDoc.isActive === false) {
    throw new Error(
      "Selected category is muted"
    );
  }

  // ALWAYS save slug
  return categoryDoc.slug;
};

// =====================================================
// CREATE PRODUCT
// =====================================================

const createProduct =
  async (req, res) => {
    try {
      const payload = {
        ...req.body,
      };

      payload._id =
        String(
          payload._id || ""
        ).trim();

      payload.name =
        String(
          payload.name || ""
        ).trim();

      payload.category =
        await normalizeCategory(
          payload.category
        );

      if (
        !payload._id ||
        !payload.name ||
        !payload.category
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Product ID, name and category are required",
        });
      }

      const existing =
        await Product.findOne({
          _id: payload._id,
        });

      if (existing) {
        return res.status(409).json({
          success: false,
          message:
            "A product with this ID already exists",
        });
      }

      const product =
        await Product.create(
          payload
        );

      await syncCategoryItemCount(product.category);

      return res.status(201).json({
        success: true,
        message:
          "Product created successfully",
        product,
      });
    } catch (error) {
      console.error(
        "Create product error:",
        error.message
      );

      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "Failed to create product",
      });
    }
  };

// =====================================================
// UPDATE PRODUCT
//
// Supports Product ID editing.
//
// MongoDB _id cannot be changed directly.
// Therefore when ID changes:
// 1. create replacement document
// 2. delete old document
// =====================================================

const updateProduct =
  async (req, res) => {
    try {
      const oldId =
        req.params.id;

      const current =
        await Product.findById(
          oldId
        );

      if (!current) {
        return res.status(404).json({
          success: false,
          message:
            "Product not found",
        });
      }

      const payload = {
        ...req.body,
      };

      const requestedId =
        String(
          payload._id ??
            oldId
        ).trim();

      delete payload._id;

      payload.category =
        await normalizeCategory(
          payload.category ??
            current.category
        );

      // Same ID → normal update
      if (requestedId === oldId) {
        const oldCategory = current.category;

        const product =
          await Product.findByIdAndUpdate(
            oldId,
            payload,
            {
              new: true,
              runValidators: true,
            }
          );

        await syncCategoryItemCount(oldCategory);
        await syncCategoryItemCount(product.category);

        return res.status(200).json({
          success: true,
          message:
            "Product updated successfully",
          product,
        });
      }

      // New ID already exists
      const duplicate =
        await Product.findById(
          requestedId
        );

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message:
            "Another product already uses this ID",
        });
      }

      // Create replacement
      const replacement =
        await Product.create({
          ...current.toObject(),
          ...payload,
          _id: requestedId,
          category:
            payload.category,
        });

      // Delete old
      await Product.findByIdAndDelete(
        oldId
      );

      await syncCategoryItemCount(current.category);
      await syncCategoryItemCount(replacement.category);

      return res.status(200).json({
        success: true,
        message:
          "Product ID and product updated successfully",
        product: replacement,
      });
    } catch (error) {
      console.error(
        "Update product error:",
        error.message
      );

      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "Failed to update product",
      });
    }
  };

// =====================================================
// MUTE / UNMUTE
// =====================================================

const updateProductStatus =
  async (req, res) => {
    try {
      const { isActive } =
        req.body;

      if (
        typeof isActive !==
        "boolean"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "isActive must be true or false",
        });
      }

      const product =
        await Product.findByIdAndUpdate(
          req.params.id,
          {
            isActive,
          },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!product) {
        return res.status(404).json({
          success: false,
          message:
            "Product not found",
        });
      }

      await syncCategoryItemCount(product.category);

      return res.status(200).json({
        success: true,
        message: isActive
          ? "Product activated successfully"
          : "Product muted successfully",
        product,
      });
    } catch (error) {
      console.error(
        "Update product status error:",
        error.message
      );

      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "Failed to update product status",
      });
    }
  };

// =====================================================
// DELETE
// =====================================================

const deleteProduct =
  async (req, res) => {
    try {
      const product =
        await Product.findByIdAndDelete(
          req.params.id
        );

      if (!product) {
        return res.status(404).json({
          success: false,
          message:
            "Product not found",
        });
      }

      await syncCategoryItemCount(product.category);

      return res.status(200).json({
        success: true,
        message:
          "Product deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete product error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete product",
      });
    }
  };

module.exports = {
  getProducts,
  getAdminProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateProductStatus,
  deleteProduct,
};