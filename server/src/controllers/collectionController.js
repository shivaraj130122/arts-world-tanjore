const Collection = require("../models/Collection");

// GET /api/collections
const getCollections = async (req, res) => {
  try {
    const collections = await Collection.find().sort({
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

// GET /api/collections/:slug
const getCollectionBySlug = async (req, res) => {
  try {
    const collection = await Collection.findOne({
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
      message: "Failed to fetch collection",
    });
  }
};

// POST /api/collections
const createCollection = async (req, res) => {
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

    if (
      !_id ||
      !title ||
      !slug
    ) {
      return res.status(400).json({
        success: false,
        message:
          "ID, title and slug are required",
      });
    }

    const normalizedId =
      String(_id).trim();

    const normalizedSlug =
      String(slug)
        .trim()
        .toLowerCase();

    const existingCollection =
      await Collection.findOne({
        $or: [
          { _id: normalizedId },
          { slug: normalizedSlug },
        ],
      });

    if (existingCollection) {
      return res.status(409).json({
        success: false,
        message:
          "A collection with this ID or slug already exists",
      });
    }

    const collection =
      await Collection.create({
        _id: normalizedId,
        title: String(title).trim(),
        description: String(
          description ?? ""
        ).trim(),
        slug: normalizedSlug,
        image: String(
          image ?? ""
        ).trim(),
        category: String(
          category ?? ""
        ).trim(),
        isActive:
          isActive !== false,
        sortOrder: Number(
          sortOrder ?? 0
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

// PUT /api/collections/:id
const updateCollection = async (
  req,
  res
) => {
  try {
    const collectionId =
      req.params.id;

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

    if (
      description !== undefined
    ) {
      updateData.description =
        String(
          description ?? ""
        ).trim();
    }

    if (slug !== undefined) {
      updateData.slug =
        String(slug)
          .trim()
          .toLowerCase();
    }

    if (image !== undefined) {
      updateData.image =
        String(
          image ?? ""
        ).trim();
    }

    if (
      category !== undefined
    ) {
      updateData.category =
        String(
          category ?? ""
        ).trim();
    }

    if (
      isActive !== undefined
    ) {
      updateData.isActive =
        Boolean(isActive);
    }

    if (
      sortOrder !== undefined
    ) {
      updateData.sortOrder =
        Number(sortOrder);
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

// DELETE /api/collections/:id
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
  getCollectionBySlug,
  createCollection,
  updateCollection,
  deleteCollection,
};