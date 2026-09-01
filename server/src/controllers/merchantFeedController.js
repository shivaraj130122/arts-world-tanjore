const Product = require("../models/Product");

const SITE_URL = "https://bhavani-art-world.onrender.com";

const escapeXml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const cleanText = (value = "") =>
  String(value)
    .replace(/\s+/g, " ")
    .trim();

const absoluteUrl = (value) => {
  if (!value) return "";

  const image = String(value).trim();

  if (!image) return "";

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  if (image.startsWith("/")) {
    return `${SITE_URL}${image}`;
  }

  return `${SITE_URL}/${image}`;
};

const getAvailability = (product) => {
  if (
    product.stock === "out-of-stock" ||
    Number(product.stockCount) <= 0
  ) {
    return "out_of_stock";
  }

  return "in_stock";
};

const getMerchantProductFeed = async (req, res) => {
  try {
    const products = await Product.find({
      isActive: { $ne: false },
    })
      .sort({ createdAt: -1 })
      .lean();

    const items = products
      .map((product) => {
        const productId = cleanText(product._id);
        const title = cleanText(product.name);

        const description = cleanText(
          product.description ||
            `${title} from Bhavani's Art World.`
        );

        const productUrl =
          `${SITE_URL}/product/${encodeURIComponent(productId)}`;

        const images = [
          ...(Array.isArray(product.images) ? product.images : []),
          product.image,
        ]
          .filter(Boolean)
          .map(absoluteUrl)
          .filter(Boolean)
          .filter(
            (image, index, list) =>
              list.indexOf(image) === index
          );

        const imageUrl = images[0];

        if (!productId || !title || !imageUrl) {
          return null;
        }

        const price = Number(product.price);

        if (!Number.isFinite(price) || price < 0) {
          return null;
        }

        const additionalImages = images
          .slice(1, 10)
          .map(
            (image) =>
              `      <g:additional_image_link>${escapeXml(
                image
              )}</g:additional_image_link>`
          )
          .join("\n");

        return `    <item>
      <g:id>${escapeXml(productId)}</g:id>
      <g:title>${escapeXml(title.slice(0, 150))}</g:title>
      <g:description>${escapeXml(description.slice(0, 5000))}</g:description>
      <g:link>${escapeXml(productUrl)}</g:link>
      <g:image_link>${escapeXml(imageUrl)}</g:image_link>
${additionalImages}
      <g:price>${price.toFixed(2)} INR</g:price>
      <g:availability>${getAvailability(product)}</g:availability>
      <g:condition>new</g:condition>
      <g:brand>Bhavani's Art World</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
    </item>`;
      })
      .filter(Boolean)
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Bhavani's Art World Products</title>
    <link>${SITE_URL}</link>
    <description>Products from Bhavani's Art World</description>
${items}
  </channel>
</rss>`;

    res.status(200);
    res.set("Content-Type", "application/xml; charset=utf-8");
    res.send(xml);
  } catch (error) {
    console.error("Merchant product feed error:", error);

    res
      .status(500)
      .type("text/plain")
      .send("Unable to generate Merchant Center product feed.");
  }
};

module.exports = {
  getMerchantProductFeed,
};