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
};

const DEFAULT_SEO = {
  title: "Bhavani's Art World | Handcrafted Tanjore Art",
  description:
    "Bhavani's Art World showcases handcrafted Tanjore paintings, custom artwork, and unique handmade creations.",
};

const setMeta = (attribute, name, content) => {
  if (!content) return;

  let element = document.head.querySelector(`meta[${attribute}="${name}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
};

const setCanonical = (url) => {
  let element = document.head.querySelector('link[rel="canonical"]');

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }

  element.setAttribute("href", url);
};

const SEOManager = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = SEO_BY_PATH[pathname] || DEFAULT_SEO;
    const canonicalPath = SEO_BY_PATH[pathname] ? pathname : "/";

    const canonicalUrl =
      canonicalPath === "/"
        ? SITE_URL
        : `${SITE_URL}${canonicalPath}`;

    document.title = seo.title;

    setMeta("name", "description", seo.description);
    setMeta("name", "robots", "index, follow");

    setMeta("property", "og:type", "website");
    setMeta("property", "og:title", seo.title);
    setMeta("property", "og:description", seo.description);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:site_name", "Bhavani's Art World");
    setMeta("property", "og:locale", "en_IN");
    setMeta("property", "og:image", DEFAULT_IMAGE);
    setMeta("property", "og:image:width", "1200");
    setMeta("property", "og:image:height", "630");
    setMeta("property", "og:image:alt", "Bhavani's Art World");

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", seo.title);
    setMeta("name", "twitter:description", seo.description);
    setMeta("name", "twitter:image", DEFAULT_IMAGE);
    setMeta("name", "twitter:image:alt", "Bhavani's Art World");

    setCanonical(canonicalUrl);
  }, [pathname]);

  return null;
};

export default SEOManager;
