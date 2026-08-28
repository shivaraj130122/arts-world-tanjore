import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve("client");
const read = async (file) => fs.readFile(path.join(ROOT, file), "utf8");
const exists = async (file) => {
  try { await fs.access(path.join(ROOT, file)); return true; }
  catch { return false; }
};

const check = (label, ok) => {
  console.log(`${ok ? "PASS" : "FAIL"} ${label}`);
  return ok;
};

const main = async () => {
  let failed = false;
  console.log("Bhavani's Art World — Phase 5A–5H SEO audit");
  console.log("-----------------------------------------------");

  const files = [
    "src/components/seo/seoContent.js",
    "src/components/seo/SearchLandingContent.jsx",
    "src/components/seo/SEOManager.jsx",
    "src/components/seo/structuredData.js",
    "src/components/seo/ImageSEOManager.jsx",
    "src/pages/Home.jsx",
    "src/pages/Shop.jsx",
    "src/pages/ProductDetails.jsx",
    "src/pages/Collections.jsx",
    "src/pages/CustomOrders.jsx",
    "src/pages/About.jsx",
    "src/pages/Contact.jsx",
    "src/services/analytics.js",
  ];
  for (const file of files) if (!check(file, await exists(file))) failed = true;

  const keywordMap = await read("src/components/seo/seoContent.js");
  for (const term of [
    "Tanjore paintings",
    "Fabric Paintings",
    "Saree Border Paintings",
    "Blouse Paintings",
    "Handmade Gifts & Crafts",
    "Handmade Flower Bouquets",
    "Bhavani's Art World",
  ]) if (!check(`keyword target: ${term}`, keywordMap.includes(term))) failed = true;

  const manager = await read("src/components/seo/SEOManager.jsx");
  for (const term of ["getCategorySeoContent", "trackEvent", "createLocalBusinessSchema"]) {
    if (!check(`SEO manager includes ${term}`, manager.includes(term))) failed = true;
  }

  const content = await read("src/components/seo/SearchLandingContent.jsx");
  for (const term of ["HomepageSearchContent", "CategorySearchContent", "PageSearchContent", "Related artwork pages"]) {
    if (!check(`search content includes ${term}`, content.includes(term))) failed = true;
  }

  const schema = await read("src/components/seo/structuredData.js");
  if (!check("LocalBusiness schema", schema.includes("createLocalBusinessSchema"))) failed = true;
  if (!check("LocalBusiness address", schema.includes("PostalAddress"))) failed = true;
  if (!check("LocalBusiness telephone", schema.includes("+91 9880556398"))) failed = true;

  const productGallery = await read("src/components/product/ProductGallery.jsx");
  if (!check("product gallery descriptive alt text", productGallery.includes("Bhavani's Art World"))) failed = true;

  const product = await read("src/pages/ProductDetails.jsx");
  if (!check("product view analytics", product.includes('trackEvent("view_item"'))) failed = true;
  if (!check("product SEO metadata", product.includes("setSEO"))) failed = true;

  const shop = await read("src/pages/Shop.jsx");
  if (!check("shop list analytics", shop.includes('trackEvent("view_item_list"'))) failed = true;
  if (!check("category SEO content", shop.includes("CategorySearchContent"))) failed = true;

  const home = await read("src/pages/Home.jsx");
  if (!check("homepage keyword content", home.includes("HomepageSearchContent"))) failed = true;

  const robots = await read("public/robots.txt");
  if (!check("robots remains public", robots.includes("Allow: /"))) failed = true;

  const sitemap = await read("public/sitemap.xml");
  if (!check("sitemap has product URLs", sitemap.includes("/product/"))) failed = true;
  if (!check("sitemap has core routes", ["/shop", "/collections", "/custom-orders", "/about", "/contact"].every((x) => sitemap.includes(x)))) failed = true;

  if (failed) {
    console.error("\nPhase 5 audit failed.");
    process.exit(1);
  }
  console.log("\nPhase 5A–5H audit passed.");
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
