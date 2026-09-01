const Category = require("../models/Category");
const Product = require("../models/Product");
const Collection = require("../models/Collection");
// =====================================================
// SYNC CATEGORY ITEM COUNT
// Counts active products only. Legacy title-based
// products are also supported.
// =====================================================

const syncCategoryItemCount = async (categoryDoc) => {
  if (!categoryDoc) return 0;

  const slug = String(categoryDoc.slug || "").trim();
  const title = String(categoryDoc.title || "").trim();

  const match = [];
  if (slug) match.push({ category: slug });
  if (title && title !== slug) match.push({ category: title });

  const itemCount = match.length
    ? await Product.countDocuments({
        $or: match,
        isActive: { $ne: false },
      })
    : 0;

  await Category.findByIdAndUpdate(categoryDoc._id, { itemCount });
  return itemCount;
};


// =====================================================
// GET ALL CATEGORIES
// Public: active categories only
// Admin can use /admin/all
// =====================================================

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      isActive: { $ne: false },
    }).sort({
      title: 1,
    });

    await Promise.all(
      categories.map(async (category) => {
        category.itemCount = await syncCategoryItemCount(category);
      })
    );

    return res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error(
      "Get categories error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

// =====================================================
// GET ALL CATEGORIES FOR ADMIN
// Active + muted
// =====================================================

const getAdminCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({
      title: 1,
    });

    await Promise.all(
      categories.map(async (category) => {
        category.itemCount = await syncCategoryItemCount(category);
      })
    );

    return res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error(
      "Get admin categories error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin categories",
    });
  }
};

// =====================================================
// GET CATEGORY BY SLUG
// =====================================================

const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({
      slug: req.params.slug,
      isActive: { $ne: false },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    console.error(
      "Get category by slug error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch category",
    });
  }
};

// =====================================================
// CREATE CATEGORY
// =====================================================

const createCategory = async (req, res) => {
  try {
    const {
      _id,
      title,
      description,
      slug,
      itemCount,
      image,
      isActive,
    } = req.body;

    const normalizedId = String(_id || "").trim();
    const normalizedTitle = String(title || "").trim();
    const normalizedSlug = String(slug || "")
      .trim()
      .toLowerCase();

    if (
      !normalizedId ||
      !normalizedTitle ||
      !normalizedSlug
    ) {
      return res.status(400).json({
        success: false,
        message: "ID, title and slug are required",
      });
    }

    const existingCategory =
      await Category.findOne({
        $or: [
          { _id: normalizedId },
          { slug: normalizedSlug },
        ],
      });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message:
          "A category with this ID or slug already exists",
      });
    }

    const category =
      await Category.create({
        _id: normalizedId,
        title: normalizedTitle,
        description: String(
          description || ""
        ).trim(),
        slug: normalizedSlug,
        itemCount: 0,
        image: String(image || "").trim(),
        isActive: isActive !== false,
      });

    category.itemCount = await syncCategoryItemCount(category);

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error(
      "Create category error:",
      error.message
    );

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to create category",
    });
  }
};

// =====================================================
// UPDATE CATEGORY
//
// IMPORTANT:
// If slug changes, all products using the old slug
// are moved to the new slug.
// =====================================================

const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const currentCategory =
      await Category.findById(categoryId);

    if (!currentCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const {
      title,
      description,
      slug,
      itemCount,
      image,
      isActive,
    } = req.body;

    const updateData = {};

    if (title !== undefined) {
      updateData.title =
        String(title).trim();
    }

    if (description !== undefined) {
      updateData.description =
        String(description || "").trim();
    }

    if (slug !== undefined) {
      updateData.slug =
        String(slug)
          .trim()
          .toLowerCase();
    }

    // itemCount is calculated automatically from active products.

    if (image !== undefined) {
      updateData.image =
        String(image || "").trim();
    }

    if (isActive !== undefined) {
      updateData.isActive =
        Boolean(isActive);
    }

    const oldSlug = currentCategory.slug;
    const newSlug =
      updateData.slug || oldSlug;

    // Prevent duplicate slug
    if (newSlug !== oldSlug) {
      const duplicate =
        await Category.findOne({
          slug: newSlug,
          _id: { $ne: categoryId },
        });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message:
            "Another category already uses this slug",
        });
      }
    }

    const category =
      await Category.findByIdAndUpdate(
        categoryId,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    // =================================================
    // Keep products connected when category slug changes
    // =================================================

    if (newSlug !== oldSlug) {
      await Product.updateMany(
        {
          $or: [
            { category: oldSlug },
            { category: currentCategory.title },
          ],
        },
        {
          $set: {
            category: newSlug,
          },
        }
      );

      // Collections using this category also follow
      if (Collection) {
        await Collection.updateMany(
          {
            $or: [
              { category: oldSlug },
              { category: currentCategory.title },
            ],
          },
          {
            $set: {
              category: newSlug,
            },
          }
        );
      }
    }

    category.itemCount = await syncCategoryItemCount(category);

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error(
      "Update category error:",
      error.message
    );

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to update category",
    });
  }
};

// =====================================================
// MUTE / UNMUTE CATEGORY
// =====================================================

const updateCategoryStatus = async (
  req,
  res
) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be a boolean",
      });
    }

    const category =
      await Category.findByIdAndUpdate(
        req.params.id,
        {
          isActive,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    category.itemCount = await syncCategoryItemCount(category);

    return res.status(200).json({
      success: true,
      message: isActive
        ? "Category activated successfully"
        : "Category muted successfully",
      category,
    });
  } catch (error) {
    console.error(
      "Update category status error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to update category status",
    });
  }
};

// =====================================================
// DELETE CATEGORY
// =====================================================

const deleteCategory = async (req, res) => {
  try {
    const category =
      await Category.findByIdAndDelete(
        req.params.id
      );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete category error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete category",
    });
  }
};

module.exports = {
  getCategories,
  getAdminCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
};