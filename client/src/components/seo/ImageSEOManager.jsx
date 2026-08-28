import { useEffect } from "react";

/*
 * Phase 2G
 * Ensures images that are already rendered by the application have
 * useful fallback alt text when an image has no alt attribute.
 *
 * This intentionally does NOT rewrite meaningful existing alt text.
 * It also skips decorative images explicitly marked aria-hidden.
 */
const getFallbackAlt = (image) => {
  const explicit = image.getAttribute("data-seo-alt")?.trim();
  if (explicit) return explicit;

  const src = image.getAttribute("src") || "";
  const filename = src.split("/").pop()?.split("?")[0] || "";

  if (!filename) {
    return "Bhavani's Art World artwork";
  }

  const readable = filename
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return readable
    ? `${readable} | Bhavani's Art World`
    : "Bhavani's Art World artwork";
};

const ImageSEOManager = () => {
  useEffect(() => {
    const applyFallbackAlt = (root = document) => {
      root.querySelectorAll?.("img").forEach((image) => {
        if (image.hasAttribute("aria-hidden")) return;

        const alt = image.getAttribute("alt");
        if (alt !== null && alt.trim() !== "") return;

        image.setAttribute("alt", getFallbackAlt(image));
      });
    };

    applyFallbackAlt();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof Element)) continue;

          if (node.matches("img")) {
            const alt = node.getAttribute("alt");
            if (
              !node.hasAttribute("aria-hidden") &&
              (!alt || !alt.trim())
            ) {
              node.setAttribute("alt", getFallbackAlt(node));
            }
          }

          applyFallbackAlt(node);
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
};

export default ImageSEOManager;
