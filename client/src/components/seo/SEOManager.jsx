import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getCategoryBySlug } from "../../services/categoryService";
import { getCollections } from "../../services/collectionService";

const SITE_URL = "https://bhavani-art-world.onrender.com";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

const STATIC_SEO = {
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

const cleanText = (value, fallback = "") =>
  String(value ?? fallback).replace(/\s+/g, " ").trim();

const toSlugTitle = (slug) =>
  cleanText(slug)
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const upsertMeta = (attribute, name, content) => {
  if (!content) return;

  let element = document.head.querySelector(
    `meta[${attribute}="${name}"]`
  );

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
};

const upsertLink = (rel, href) => {
  let element = document.head.querySelector(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
};

const upsertJsonLd = (id, data) => {
  let script = document.head.querySelector(
    `script[data-seo-jsonld="${id}"]`
  );

  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-seo-jsonld", id);
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(data);
};

const removeJsonLd = (id) => {
  document.head
    .querySelector(`script[data-seo-jsonld="${id}"]`)
    ?.remove();
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
  const safeDescription = description || DEFAULT_SEO.description;
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

  upsertLink("canonical", safeCanonical);
};

const setSiteStructuredData = () => {
  upsertJsonLd("website", {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Bhavani's Art World",
    url: SITE_URL,
    description:
      "Handcrafted Tanjore paintings, traditional Indian art, custom artwork, and unique handmade creations.",
  });
};

const setBreadcrumbStructuredData = (items) => {
  upsertJsonLd("breadcrumbs", {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  });
};

const setCollectionListStructuredData = (collections) => {
  const activeCollections = (collections || []).filter(
    (collection) => collection?.isActive !== false
  );

  /*
   * There is currently only a public /collections route in AppRoutes.
   * Individual collection URLs are intentionally NOT invented here.
   */
  upsertJsonLd("collection-list", {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Bhavani's Art World Collections",
    url: `${SITE_URL}/collections`,
    numberOfItems: activeCollections.length,
    itemListElement: activeCollections
      .slice(0, 100)
      .map((collection, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: cleanText(collection?.title, "Art Collection"),
      })),
  });
};

const SEOManager = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    /*
     * ProductDetails owns SEO for /product/:id after its product API response.
     * Never overwrite product metadata from this global manager.
     */
    if (pathname.startsWith("/product/")) {
      return;
    }

    let cancelled = false;

    const applySEO = async () => {
      if (pathname === "/shop") {
        const params = new URLSearchParams(search);
        const categorySlug = cleanText(params.get("category"));

        if (categorySlug) {
          const fallbackName = toSlugTitle(categorySlug);

          try {
            const data = await getCategoryBySlug(categorySlug);
            if (cancelled) return;

            const category = data?.category || data?.data || data;
            const categoryName = cleanText(
              category?.title || category?.name || fallbackName,
              fallbackName
            );
            const categoryDescription = cleanText(
              category?.description,
              `Explore ${categoryName} artwork and handcrafted creations from Bhavani's Art World.`
            ).slice(0, 160);

            const canonicalUrl =
              `${SITE_URL}/shop?category=${encodeURIComponent(categorySlug)}`;

            setSEO({
              title: `${categoryName} | Shop | Bhavani's Art World`,
              description: categoryDescription,
              canonicalUrl,
              image: category?.image || undefined,
              imageAlt: categoryName,
            });

            setBreadcrumbStructuredData([
              { name: "Home", url: SITE_URL },
              { name: "Shop", url: `${SITE_URL}/shop` },
              { name: categoryName, url: canonicalUrl },
            ]);
            return;
          } catch (error) {
            console.warn(
              "Category SEO lookup failed; using fallback metadata.",
              error
            );

            if (cancelled) return;

            const canonicalUrl =
              `${SITE_URL}/shop?category=${encodeURIComponent(categorySlug)}`;

            setSEO({
              title: `${fallbackName} | Shop | Bhavani's Art World`,
              description:
                `Explore ${fallbackName} artwork and handcrafted creations from Bhavani's Art World.`,
              canonicalUrl,
            });

            setBreadcrumbStructuredData([
              { name: "Home", url: SITE_URL },
              { name: "Shop", url: `${SITE_URL}/shop` },
              { name: fallbackName, url: canonicalUrl },
            ]);
            return;
          }
        }
      }

      if (pathname === "/collections") {
        const seo = STATIC_SEO["/collections"];

        setSEO({
          title: seo.title,
          description: seo.description,
          canonicalUrl: `${SITE_URL}/collections`,
        });

        setBreadcrumbStructuredData([
          { name: "Home", url: SITE_URL },
          { name: "Collections", url: `${SITE_URL}/collections` },
        ]);

        try {
          const data = await getCollections();
          if (!cancelled) {
            setCollectionListStructuredData(data?.collections || []);
          }
        } catch (error) {
          console.warn(
            "Collection structured-data lookup failed; keeping static collection SEO.",
            error
          );
          if (!cancelled) {
            removeJsonLd("collection-list");
          }
        }
        return;
      }

      const seo = STATIC_SEO[pathname] || DEFAULT_SEO;
      const canonicalUrl = STATIC_SEO[pathname]
        ? pathname === "/"
          ? SITE_URL
          : `${SITE_URL}${pathname}`
        : SITE_URL;

      setSEO({
        title: seo.title,
        description: seo.description,
        canonicalUrl,
      });

      if (pathname === "/") {
        setBreadcrumbStructuredData([
          { name: "Home", url: SITE_URL },
        ]);
      } else if (STATIC_SEO[pathname]) {
        setBreadcrumbStructuredData([
          { name: "Home", url: SITE_URL },
          { name: seo.title.split(" | ")[0], url: canonicalUrl },
        ]);
      } else {
        removeJsonLd("breadcrumbs");
        removeJsonLd("collection-list");
      }
    };

    setSiteStructuredData();
    applySEO();

    return () => {
      cancelled = true;
    };
  }, [pathname, search]);

  return null;
};

export default SEOManager;
