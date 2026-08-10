const Category = require("../models/Category");

// GET /api/categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({
      title: 1,
    });

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

// GET /api/categories/:slug
const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({
      slug: req.params.slug,
      isActive: true,
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
      "Get category error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch category",
    });
  }
};

// POST /api/categories
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

    if (
      !_id ||
      !title ||
      !description ||
      !slug
    ) {
      return res.status(400).json({
        success: false,
        message:
          "ID, title, description and slug are required",
      });
    }

    const normalizedSlug = slug
      .trim()
      .toLowerCase();

    const existingCategory =
      await Category.findOne({
        $or: [
          { _id: String(_id).trim() },
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
        _id: String(_id).trim(),
        title: String(title).trim(),
        description: String(
          description
        ).trim(),
        slug: normalizedSlug,
        itemCount: Number(
          itemCount ?? 0
        ),
        image: String(
          image ?? ""
        ).trim(),
        isActive:
          isActive !== false,
      });

    return res.status(201).json({
      success: true,
      message:
        "Category created successfully",
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

// PUT /api/categories/:id
const updateCategory = async (req, res) => {
  try {
    const categoryId =
      req.params.id;

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

    if (
      description !== undefined
    ) {
      updateData.description =
        String(
          description
        ).trim();
    }

    if (slug !== undefined) {
      updateData.slug =
        String(slug)
          .trim()
          .toLowerCase();
    }

    if (
      itemCount !== undefined
    ) {
      updateData.itemCount =
        Number(itemCount);
    }

    if (image !== undefined) {
      updateData.image =
        String(image ?? "").trim();
    }

    if (
      isActive !== undefined
    ) {
      updateData.isActive =
        Boolean(isActive);
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

    if (!category) {
      return res.status(404).json({
        success: false,
        message:
          "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Category updated successfully",
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

// DELETE /api/categories/:id
const deleteCategory = async (
  req,
  res
) => {
  try {
    const category =
      await Category.findByIdAndDelete(
        req.params.id
      );

    if (!category) {
      return res.status(404).json({
        success: false,
        message:
          "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Category deleted successfully",
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
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};