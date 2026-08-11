const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    stream.end(buffer);
  });
};

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image",
      });
    }

    const result = await uploadToCloudinary(
      req.file.buffer,
      "bhavani-art-world/products"
    );

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      image: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      },
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    res.status(500).json({
      success: false,
      message: "Image upload failed",
    });
  }
};

module.exports = {
  uploadImage,
};