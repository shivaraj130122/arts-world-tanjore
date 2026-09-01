import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getCategoryBySlug } from "../../services/categoryService";
import { getCollections } from "../../services/collectionService";
import { trackEvent } from "../../services/analytics";
import { getCategorySeoContent } from "./seoContent";
import {
  createBreadcrumbSchema,
  createItemListSchema,
  createOrganizationSchema,
  createLocalBusinessSchema,
  createWebPageSchema,
  createWebsiteSchema,
  getSiteUrl,
} from "./structuredData";

const SITE_URL = getSiteUrl();
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

const STATIC_SEO = {
  "/": {
    title: "Bhavani's Art World | Tanjore Paintings & Handcrafted Art",
    description:
      "Explore handcrafted Tanjore paintings, traditional Indian art, custom artwork, and unique handmade creations from Bhavani's Art World.",
  },
  "/shop": {
    title: "Shop Tanjore Paintings & Handmade Art | Bhavani's Art World",
    description:
      "Shop Tanjore paintings, fabric paintings, saree border paintings, blouse paintings, handmade gifts and custom artwork from Bhavani's Art World.",
  },
  "/about": {
    title: "About Bhavani's Art World | Tanjore Art & Craftsmanship",
    description:
      "Learn about Bhavani's Art World, our approach to Tanjore paintings, traditional Indian art, handmade crafts, and personalized artwork.",
  },
  "/collections": {
    title: "Art Collections | Bhavani's Art World",
    description:
      "Explore curated Tanjore paintings, handmade fabric art, custom creations, wedding art, gifting ideas, and traditional Indian artwork.",
  },
  "/custom-orders": {
    title: "Custom Artwork & Portraits | Bhavani's Art World",
    description:
      "Request a custom hand-painted artwork or personalized creation from Bhavani's Art World, made to order with traditional craftsmanship.",
  },
  "/return-policy": {
    title: "Return & Refund Policy | Bhavani's Art World",
    description:
      "Read the return, refund, exchange, and damaged-product policy for purchases from Bhavani's Art World.",
  },  "/contact": {
    title: "Contact Bhavani's Art World | Tanjore Art & Custom Orders",
    description:
      "Contact Bhavani's Art World for Tanjore paintings, handcrafted artwork, custom orders, product questions, and art enquiries.",
  },
};

const DEFAULT_SEO = {
  title: "Bhavani's Art World | Handcrafted Tanjore Art",
  description:
    "Bhavani's Art World showcases handcrafted Tanjore paintings, custom artwork, and unique handmade creations.",
};

const PRIVATE_ROUTES = new Set([
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/profile",
  "/cart",
  "/checkout",
  "/wishlist",
]);

const setRobots = (value) => upsertMeta("name", "robots", value);

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
  let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
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
  let script = document.head.querySelector(`script[data-seo-jsonld="${id}"]`);
  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-seo-jsonld", id);
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
};

const removeJsonLd = (id) => {
  document.head.querySelector(`script[data-seo-jsonld="${id}"]`)?.remove();
};

// eslint-disable-next-line react-refresh/only-export-components
export const setSEO = ({
  title,
  description,
  canonicalUrl,
  image = DEFAULT_IMAGE,
  imageAlt = "Bhavani's Art World",
  type = "website",
  robots = "index, follow",
}) => {
  const safeTitle = title || DEFAULT_SEO.title;
  const safeDescription = description || DEFAULT_SEO.description;
  const safeCanonical = canonicalUrl || SITE_URL;

  document.title = safeTitle;
  upsertMeta("name", "description", safeDescription);
  setRobots(robots);
  upsertMeta("property", "og:type", type);
  upsertMeta("property", "og:title", safeTitle);
  upsertMeta("property", "og:description", safeDescription);
  upsertMeta("property", "og:url", safeCanonical);
  upsertMeta("property", "og:site_name", "Bhavani's Art World");
  upsertMeta("property", "og:locale", "en_IN");
  upsertMeta("property", "og:image", image);
  upsertMeta("property", "og:image:alt", imageAlt);
  upsertMeta("property", "og:image:width", "1200");
  upsertMeta("property", "og:image:height", "630");
  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", safeTitle);
  upsertMeta("name", "twitter:description", safeDescription);
  upsertMeta("name", "twitter:image", image);
  upsertMeta("name", "twitter:image:alt", imageAlt);
  upsertLink("canonical", safeCanonical);
};

const setGlobalStructuredData = () => {
  upsertJsonLd("organization", createOrganizationSchema());
  upsertJsonLd("local-business", createLocalBusinessSchema());
  upsertJsonLd("website", createWebsiteSchema());
};

const setPageStructuredData = ({ title, description, canonicalUrl, image }) => {
  upsertJsonLd(
    "webpage",
    createWebPageSchema({
      name: title,
      description,
      url: canonicalUrl,
      image,
    })
  );
};

const setBreadcrumbStructuredData = (items) => {
  upsertJsonLd("breadcrumbs", createBreadcrumbSchema(items));
};

const setCollectionListStructuredData = (collections) => {
  const items = (collections || [])
    .filter((collection) => collection?.isActive !== false)
    .slice(0, 100)
    .map((collection) => ({
      name: cleanText(collection?.title, "Art Collection"),
    }));

  upsertJsonLd(
    "collection-list",
    createItemListSchema({
      name: "Bhavani's Art World Collections",
      url: `${SITE_URL}/collections`,
      items,
    })
  );
};

const SEOManager = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      trackEvent("page_view", {
        page_path: `${pathname}${search}`,
        page_location: window.location.href,
        page_title: document.title,
      });
    }

    if (pathname.startsWith("/product/")) return;

    let cancelled = false;

    const applySEO = async () => {
      setGlobalStructuredData();

      if (PRIVATE_ROUTES.has(pathname) || pathname.startsWith("/admin")) {
        const privateTitle = pathname.startsWith("/admin")
          ? "Admin | Bhavani's Art World"
          : "Bhavani's Art World";
        setSEO({
          title: privateTitle,
          description: "Private page of Bhavani's Art World.",
          canonicalUrl: SITE_URL,
          robots: "noindex, nofollow, noarchive",
        });
        removeJsonLd("breadcrumbs");
        removeJsonLd("collection-list");
        removeJsonLd("webpage");
        return;
      }

      if (pathname === "/shop") {
        const params = new URLSearchParams(search);
        const categorySlug = cleanText(params.get("category"));
        const hasSearchQuery = Boolean(cleanText(params.get("search")));
        const hasSortQuery = Boolean(cleanText(params.get("sort")));

        // Search/sort result URLs are useful for users but should not become
        // separate Google index entries. Category landing URLs remain indexable.
        if (!categorySlug && (hasSearchQuery || hasSortQuery)) {
          const seo = STATIC_SEO["/shop"];
          setSEO({
            title: seo.title,
            description: seo.description,
            canonicalUrl: `${SITE_URL}/shop`,
            robots: "noindex, follow, noarchive",
          });
          setPageStructuredData({
            title: seo.title,
            description: seo.description,
            canonicalUrl: `${SITE_URL}/shop`,
          });
          setBreadcrumbStructuredData([
            { name: "Home", url: SITE_URL },
            { name: "Shop", url: `${SITE_URL}/shop` },
          ]);
          removeJsonLd("collection-list");
          return;
        }

        if (categorySlug) {
          const fallbackName = toSlugTitle(categorySlug);
          const canonicalUrl = `${SITE_URL}/shop?category=${encodeURIComponent(categorySlug)}`;

          try {
            const data = await getCategoryBySlug(categorySlug);
            if (cancelled) return;
            const category = data?.category || data?.data || data;
            const categoryName = cleanText(category?.title || category?.name, fallbackName);
            const keywordContent = getCategorySeoContent(categorySlug);
            const categoryDescription = cleanText(
              keywordContent?.intro || category?.description,
              `Explore ${categoryName} artwork and handcrafted creations from Bhavani's Art World.`
            ).slice(0, 160);
            const categoryTitle = keywordContent
              ? `${keywordContent.primary} | Bhavani's Art World`
              : `${categoryName} | Shop | Bhavani's Art World`;
            const image = category?.image || DEFAULT_IMAGE;

            setSEO({
              title: categoryTitle,
              description: categoryDescription,
              canonicalUrl,
              image,
              imageAlt: categoryName,
            });
            setPageStructuredData({
              title: categoryTitle,
              description: categoryDescription,
              canonicalUrl,
              image,
            });
            setBreadcrumbStructuredData([
              { name: "Home", url: SITE_URL },
              { name: "Shop", url: `${SITE_URL}/shop` },
              { name: categoryName, url: canonicalUrl },
            ]);
            return;
          } catch (error) {
            console.warn("Category SEO lookup failed; using fallback metadata.", error);
            if (cancelled) return;
            setSEO({
              title: `${fallbackName} | Shop | Bhavani's Art World`,
              description: `Explore ${fallbackName} artwork and handcrafted creations from Bhavani's Art World.`,
              canonicalUrl,
            });
            setPageStructuredData({
              title: `${fallbackName} | Shop | Bhavani's Art World`,
              description: `Explore ${fallbackName} artwork and handcrafted creations from Bhavani's Art World.`,
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

      const seo = STATIC_SEO[pathname] || DEFAULT_SEO;
      const canonicalUrl = STATIC_SEO[pathname]
        ? pathname === "/" ? SITE_URL : `${SITE_URL}${pathname}`
        : SITE_URL;

      setSEO({ title: seo.title, description: seo.description, canonicalUrl });
      setPageStructuredData({
        title: seo.title,
        description: seo.description,
        canonicalUrl,
      });

      if (pathname === "/") {
        setBreadcrumbStructuredData([{ name: "Home", url: SITE_URL }]);
      } else if (STATIC_SEO[pathname]) {
        setBreadcrumbStructuredData([
          { name: "Home", url: SITE_URL },
          { name: seo.title.split(" | ")[0], url: canonicalUrl },
        ]);
      } else {
        removeJsonLd("breadcrumbs");
        removeJsonLd("collection-list");
      }

      if (pathname === "/collections") {
        try {
          const data = await getCollections();
          if (!cancelled) setCollectionListStructuredData(data?.collections || []);
        } catch (error) {
          console.warn("Collection structured-data lookup failed.", error);
          if (!cancelled) removeJsonLd("collection-list");
        }
      } else {
        removeJsonLd("collection-list");
      }
    };

    applySEO();
    return () => { cancelled = true; };
  }, [pathname, search]);

  return null;
};

export default SEOManager;

