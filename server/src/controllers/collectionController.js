const Collection = require("../models/Collection");
const Category = require("../models/Category");

// =====================================================
// PUBLIC COLLECTIONS
// =====================================================

const getCollections = async (req, res) => {
  try {
    const collections =
      await Collection.find({
        isActive: { $ne: false },
      }).sort({
        sortOrder: 1,
        title: 1,
      });

    return res.status(200).json({
      success: true,
      count: collections.length,
      collections,
    });
  } catch (error) {
    console.error(
      "Get collections error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch collections",
    });
  }
};

// =====================================================
// ADMIN COLLECTIONS
// =====================================================

const getAdminCollections = async (
  req,
  res
) => {
  try {
    const collections =
      await Collection.find({}).sort({
        sortOrder: 1,
        title: 1,
      });

    return res.status(200).json({
      success: true,
      count: collections.length,
      collections,
    });
  } catch (error) {
    console.error(
      "Get admin collections error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch admin collections",
    });
  }
};

// =====================================================
// GET ONE COLLECTION
// =====================================================

const getCollectionBySlug = async (
  req,
  res
) => {
  try {
    const collection =
      await Collection.findOne({
        slug: req.params.slug,
        isActive: true,
      });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    return res.status(200).json({
      success: true,
      collection,
    });
  } catch (error) {
    console.error(
      "Get collection error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch collection",
    });
  }
};

// =====================================================
// CREATE
// =====================================================

const createCollection = async (
  req,
  res
) => {
  try {
    const {
      _id,
      title,
      description,
      slug,
      image,
      category,
      isActive,
      sortOrder,
    } = req.body;

    const normalizedId =
      String(_id || "").trim();

    const normalizedTitle =
      String(title || "").trim();

    const normalizedSlug =
      String(slug || "")
        .trim()
        .toLowerCase();

    const normalizedCategory =
      String(category || "")
        .trim()
        .toLowerCase();

    if (
      !normalizedId ||
      !normalizedTitle ||
      !normalizedSlug
    ) {
      return res.status(400).json({
        success: false,
        message:
          "ID, title and slug are required",
      });
    }

    if (normalizedCategory) {
      const categoryExists =
        await Category.findOne({
          slug: normalizedCategory,
          isActive: { $ne: false },
        });

      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message:
            "Selected category does not exist",
        });
      }
    }

    const existing =
      await Collection.findOne({
        $or: [
          { _id: normalizedId },
          { slug: normalizedSlug },
        ],
      });

    if (existing) {
      return res.status(409).json({
        success: false,
        message:
          "A collection with this ID or slug already exists",
      });
    }

    const collection =
      await Collection.create({
        _id: normalizedId,
        title: normalizedTitle,
        description: String(
          description || ""
        ).trim(),
        slug: normalizedSlug,
        image: String(
          image || ""
        ).trim(),
        category: normalizedCategory,
        isActive: isActive !== false,
        sortOrder: Number(
          sortOrder || 0
        ),
      });

    return res.status(201).json({
      success: true,
      message:
        "Collection created successfully",
      collection,
    });
  } catch (error) {
    console.error(
      "Create collection error:",
      error.message
    );

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to create collection",
    });
  }
};

// =====================================================
// UPDATE
// =====================================================

const updateCollection = async (
  req,
  res
) => {
  try {
    const collectionId =
      req.params.id;

    const current =
      await Collection.findById(
        collectionId
      );

    if (!current) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    const {
      title,
      description,
      slug,
      image,
      category,
      isActive,
      sortOrder,
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

    if (image !== undefined) {
      updateData.image =
        String(image || "").trim();
    }

    if (category !== undefined) {
      const normalizedCategory =
        String(category || "")
          .trim()
          .toLowerCase();

      if (normalizedCategory) {
        const categoryExists =
          await Category.findOne({
            slug: normalizedCategory,
            isActive: {
              $ne: false,
            },
          });

        if (!categoryExists) {
          return res.status(400).json({
            success: false,
            message:
              "Selected category does not exist",
          });
        }
      }

      updateData.category =
        normalizedCategory;
    }

    if (isActive !== undefined) {
      updateData.isActive =
        Boolean(isActive);
    }

    if (sortOrder !== undefined) {
      updateData.sortOrder =
        Number(sortOrder);
    }

    if (
      updateData.slug &&
      updateData.slug !== current.slug
    ) {
      const duplicate =
        await Collection.findOne({
          slug: updateData.slug,
          _id: { $ne: collectionId },
        });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message:
            "Another collection already uses this slug",
        });
      }
    }

    const collection =
      await Collection.findByIdAndUpdate(
        collectionId,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    return res.status(200).json({
      success: true,
      message:
        "Collection updated successfully",
      collection,
    });
  } catch (error) {
    console.error(
      "Update collection error:",
      error.message
    );

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to update collection",
    });
  }
};

// =====================================================
// MUTE / UNMUTE
// =====================================================

const updateCollectionStatus =
  async (req, res) => {
    try {
      const { isActive } = req.body;

      if (typeof isActive !== "boolean") {
        return res.status(400).json({
          success: false,
          message:
            "isActive must be a boolean",
        });
      }

      const collection =
        await Collection.findByIdAndUpdate(
          req.params.id,
          {
            isActive,
          },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!collection) {
        return res.status(404).json({
          success: false,
          message:
            "Collection not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: isActive
          ? "Collection activated successfully"
          : "Collection muted successfully",
        collection,
      });
    } catch (error) {
      console.error(
        "Update collection status error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to update collection status",
      });
    }
  };

// =====================================================
// DELETE
// =====================================================

const deleteCollection = async (
  req,
  res
) => {
  try {
    const collection =
      await Collection.findByIdAndDelete(
        req.params.id
      );

    if (!collection) {
      return res.status(404).json({
        success: false,
        message:
          "Collection not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Collection deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete collection error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete collection",
    });
  }
};

module.exports = {
  getCollections,
  getAdminCollections,
  getCollectionBySlug,
  createCollection,
  updateCollection,
  updateCollectionStatus,
  deleteCollection,
};