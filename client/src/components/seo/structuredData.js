const SITE_URL = "https://bhavani-art-world.onrender.com";
const SITE_NAME = "Bhavani's Art World";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

const clean = (value, fallback = "") =>
  String(value ?? fallback).replace(/\s+/g, " ").trim();

const absoluteUrl = (value, fallback = DEFAULT_IMAGE) => {
  const text = clean(value);
  if (!text) return fallback;
  try {
    return new URL(text, SITE_URL).href;
  } catch {
    return fallback;
  }
};

export const getSiteUrl = () => SITE_URL;

export const createOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: { "@type": "ImageObject", url: `${SITE_URL}/og-image.png` },
});

export const createWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  description: "Handcrafted Tanjore paintings, traditional Indian art, custom artwork, and unique handmade creations.",
  publisher: { "@id": `${SITE_URL}/#organization` },
});

export const createWebPageSchema = ({ name, description, url, image = DEFAULT_IMAGE }) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${url}#webpage`,
  name: clean(name, SITE_NAME),
  description: clean(description),
  url,
  isPartOf: { "@id": `${SITE_URL}/#website` },
  about: { "@id": `${SITE_URL}/#organization` },
  primaryImageOfPage: { "@type": "ImageObject", url: absoluteUrl(image) },
});

export const createBreadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: clean(item.name, "Page"),
    item: item.url,
  })),
});

const getAvailability = (product) =>
  product?.stock === "out-of-stock" || Number(product?.stockCount) <= 0
    ? "https://schema.org/OutOfStock"
    : "https://schema.org/InStock";

export const createProductSchema = ({ product, url }) => {
  const name = clean(product?.name, "Handcrafted Artwork");
  const description = clean(product?.description, `${name} from ${SITE_NAME}.`);
  const images = [...(Array.isArray(product?.images) ? product.images : []), product?.image]
    .filter(Boolean).map((image) => absoluteUrl(image))
    .filter((image, index, list) => list.indexOf(image) === index);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name,
    description,
    url,
    image: images.length ? images : [DEFAULT_IMAGE],
    sku: clean(product?.sku),
    brand: { "@type": "Brand", name: SITE_NAME },
    category: clean(product?.category),
    material: clean(product?.material) || undefined,
    color: clean(product?.style) || undefined,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "INR",
      price: Number(product?.price ?? 0).toFixed(2),
      availability: getAvailability(product),
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  if (Number(product?.rating) > 0 && Number(product?.reviewCount) > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(product.rating).toFixed(1),
      reviewCount: Math.floor(Number(product.reviewCount)),
      bestRating: "5",
      worstRating: "1",
    };
  }

  return Object.fromEntries(Object.entries(schema).filter(([, value]) => value !== undefined && value !== ""));
};

export const createItemListSchema = ({ name, url, items }) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name,
  url,
  numberOfItems: items.length,
  itemListElement: items.slice(0, 100).map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: clean(item.name, "Artwork"),
    ...(item.url ? { url: item.url } : {}),
  })),
});
