import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve("client");
const SITE_URL = "https://bhavani-art-world.onrender.com";
const required = [
  "index.html",
  "public/robots.txt",
  "public/sitemap.xml",
  "src/components/seo/SEOManager.jsx",
  "src/components/seo/structuredData.js",
  "src/components/seo/ImageSEOManager.jsx",
  "src/components/seo/PublicSeoLinks.jsx",
];

const read = (file) => fs.readFile(path.join(ROOT, file), "utf8");
const exists = async (file) => {
  try { await fs.access(path.join(ROOT, file)); return true; } catch { return false; }
};

let failed = false;
const check = (label, ok) => {
  console.log(`${ok ? "PASS" : "FAIL"} ${label}`);
  if (!ok) failed = true;
};

const main = async () => {
  console.log("Bhavani's Art World — Phase 4B–4F SEO audit");
  console.log("-----------------------------------------------");

  for (const file of required) check(file, await exists(file));

  const robots = await read("public/robots.txt");
  check("robots allows public pages", robots.includes("Allow: /"));
  check("robots has sitemap", robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`));
  for (const route of ["/admin", "/cart", "/checkout", "/wishlist", "/login", "/register"]) {
    check(`robots blocks ${route}`, robots.includes(`Disallow: ${route}`));
  }

  const sitemap = await read("public/sitemap.xml");
  check("sitemap namespace", sitemap.includes("sitemaps.org/schemas/sitemap/0.9"));
  check("sitemap has core public routes", ["/shop", "/collections", "/custom-orders", "/about", "/contact"].every((r) => sitemap.includes(`${SITE_URL}${r}`)));
  check("sitemap excludes private routes", !/(\/admin|\/cart|\/checkout|\/wishlist|\/login|\/register)/.test(sitemap));
  check("sitemap has product URLs", sitemap.includes(`${SITE_URL}/product/`));
  check("sitemap supports image namespace", sitemap.includes("google.com/schemas/sitemap-image/1.1"));

  const manager = await read("src/components/seo/SEOManager.jsx");
  check("public route SEO includes custom orders", manager.includes("/custom-orders"));
  check("public route SEO includes contact", manager.includes("/contact"));
  check("private routes receive noindex", manager.includes("noindex, nofollow, noarchive"));
  check("shop search/sort receives noindex", manager.includes("noindex, follow, noarchive"));

  const links = await read("src/components/seo/PublicSeoLinks.jsx");
  for (const route of ["/shop", "/collections", "/custom-orders", "/about", "/contact"]) {
    check(`crawlable internal link ${route}`, links.includes(`{ to: \"${route}\"`));
  }

  const schema = await read("src/components/seo/structuredData.js");
  check("Organization schema", schema.includes("createOrganizationSchema"));
  check("WebSite schema", schema.includes("createWebsiteSchema"));
  check("WebPage schema", schema.includes("createWebPageSchema"));
  check("Breadcrumb schema", schema.includes("createBreadcrumbSchema"));
  check("Product schema", schema.includes("createProductSchema"));

  const product = await read("src/pages/ProductDetails.jsx");
  check("product page emits Product JSON-LD", product.includes('createProductSchema({ product, url: canonicalUrl })'));
  check("product page emits breadcrumbs", product.includes('createBreadcrumbSchema(['));

  if (failed) {
    console.error("\nPhase 4B–4F audit failed.");
    process.exit(1);
  }
  console.log("\nPhase 4B–4F audit passed.");
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
