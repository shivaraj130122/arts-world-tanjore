const Collection = require("../models/Collection");

const getCollections = async (req, res) => {
  try {
    const collections = await Collection.find({
      isActive: true,
    }).sort({ sortOrder: 1, title: 1 });

    res.status(200).json({
      success: true,
      count: collections.length,
      collections,
    });
  } catch (error) {
    console.error("Get collections error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch collections",
    });
  }
};

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

    res.status(200).json({
      success: true,
      collection,
    });
  } catch (error) {
    console.error("Get collection error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch collection",
    });
  }
};

module.exports = {
  getCollections,
  getCollectionBySlug,
};