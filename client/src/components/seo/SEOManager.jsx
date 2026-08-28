import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://bhavani-art-world.onrender.com";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

const SEO_BY_PATH = {
  "/": {
    title: "Bhavani's Art World | Tanjore Paintings & Handcrafted Art",
    description:
      "Explore handcrafted Tanjore paintings, traditional Indian art, custom artwork, and unique handmade creations from Bhavani's Art World.",
  },
  "/shop": {
    title: "Shop Tanjore Paintings & Handcrafted Art | Bhavani's Art World",
    description:
      "Shop handcrafted Tanjore paintings, traditional Indian artwork, custom creations, and unique handmade products from Bhavani's Art World.",
  },
  "/about": {
    title: "About Bhavani's Art World | Tanjore Art & Craftsmanship",
    description:
      "Learn about Bhavani's Art World, our passion for Tanjore paintings, Indian craftsmanship, traditional artistry, and custom handmade creations.",
  },
  "/collections": {
    title: "Art Collections | Bhavani's Art World",
    description:
      "Explore curated Tanjore paintings, handmade fabric art, custom creations, wedding art, gifting ideas, and traditional Indian artwork.",
  },
};

const DEFAULT_SEO = {
  title: "Bhavani's Art World | Handcrafted Tanjore Art",
  description:
    "Bhavani's Art World showcases handcrafted Tanjore paintings, custom artwork, and unique handmade creations.",
};

const upsertMeta = (attribute, name, content) => {
  if (!content) return;

  let element = document.head.querySelector(
    `meta[${attribute}="${name}"]`
  );

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("attribute", attribute);
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
};

export const setSEO = ({
  title,
  description,
  canonicalUrl,
  image = DEFAULT_IMAGE,
  imageAlt = "Bhavani's Art World",
  type = "website",
}) => {
  const safeTitle = title || DEFAULT_SEO.title;
  const safeDescription =
    description || DEFAULT_SEO.description;
  const safeCanonical = canonicalUrl || SITE_URL;

  document.title = safeTitle;

  upsertMeta("name", "description", safeDescription);
  upsertMeta("name", "robots", "index, follow");

  upsertMeta("property", "og:type", type);
  upsertMeta("property", "og:title", safeTitle);
  upsertMeta("property", "og:description", safeDescription);
  upsertMeta("property", "og:url", safeCanonical);
  upsertMeta("property", "og:site_name", "Bhavani's Art World");
  upsertMeta("property", "og:locale", "en_IN");
  upsertMeta("property", "og:image", image);
  upsertMeta("property", "og:image:alt", imageAlt);

  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", safeTitle);
  upsertMeta("name", "twitter:description", safeDescription);
  upsertMeta("name", "twitter:image", image);
  upsertMeta("name", "twitter:image:alt", imageAlt);

  let canonical = document.head.querySelector(
    'link[rel="canonical"]'
  );

  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }

  canonical.setAttribute("href", safeCanonical);
};

const SEOManager = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    /*
     * ProductDetails owns SEO for /product/:id because it must wait for
     * the product API response before setting the product-specific title,
     * description, canonical URL and image.
     *
     * React effects in nested components can run before parent effects.
     * Therefore SEOManager must NOT overwrite product metadata after
     * ProductDetails has set it.
     */
    if (pathname.startsWith("/product/")) {
      return;
    }

    const seo = SEO_BY_PATH[pathname] || DEFAULT_SEO;

    const canonicalUrl = SEO_BY_PATH[pathname]
      ? pathname === "/"
        ? SITE_URL
        : `${SITE_URL}${pathname}`
      : SITE_URL;

    setSEO({
      title: seo.title,
      description: seo.description,
      canonicalUrl,
    });
  }, [pathname]);

  return null;
};

export default SEOManager;
