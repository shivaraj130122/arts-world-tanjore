import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve("client");
const SITE_URL = "https://bhavaniartworld.shop";
const REQUIRED_FILES = [
  "index.html",
  "public/robots.txt",
  "public/sitemap.xml",
  "src/components/seo/SEOManager.jsx",
  "src/components/seo/structuredData.js",
  "src/components/seo/ImageSEOManager.jsx",
];

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
  console.log("Bhavani's Art World — Complete SEO audit");
  console.log("------------------------------------------");

  for (const file of REQUIRED_FILES) {
    if (!check(file, await exists(file))) failed = true;
  }

  const index = await read("index.html");
  const patterns = [
    ["meta description", /<meta\s+[^>]*name=["']description["']/i],
    ["canonical", /<link\s+[^>]*rel=["']canonical["']/i],
    ["Open Graph title", /property=["']og:title["']/i],
    ["Open Graph description", /property=["']og:description["']/i],
    ["Twitter card", /name=["']twitter:card["']/i],
    ["Google verification", /name=["']google-site-verification["']/i],
  ];
  for (const [label, pattern] of patterns) if (!check(label, pattern.test(index))) failed = true;

  const robots = await read("public/robots.txt");
  for (const [label, text] of [
    ["robots allows public crawling", "Allow: /"],
    ["robots references sitemap", `Sitemap: ${SITE_URL}/sitemap.xml`],
    ["robots blocks admin", "Disallow: /admin"],
    ["robots blocks checkout", "Disallow: /checkout"],
  ]) if (!check(label, robots.includes(text))) failed = true;

  const sitemap = await read("public/sitemap.xml");
  if (!check("sitemap XML namespace", sitemap.includes("sitemaps.org/schemas/sitemap/0.9"))) failed = true;
  if (!check("sitemap contains URL entries", /<url>/.test(sitemap))) failed = true;
  if (!check("sitemap contains product URLs", sitemap.includes(`<loc>${SITE_URL}/product/`))) failed = true;
  if (!check("sitemap contains public core routes", ["/shop", "/collections", "/custom-orders", "/about", "/contact"].every((route) => sitemap.includes(`${SITE_URL}${route}`)))) failed = true;
  if (!check("sitemap contains no admin URLs", !sitemap.includes(`${SITE_URL}/admin`))) failed = true;

  const manager = await read("src/components/seo/SEOManager.jsx");
  const schema = await read("src/components/seo/structuredData.js");
  const product = await read("src/pages/ProductDetails.jsx");
  for (const [label, text, source] of [
    ["Organization schema implementation", "createOrganizationSchema", schema],
    ["WebSite schema implementation", "createWebsiteSchema", schema],
    ["WebPage schema implementation", "createWebPageSchema", schema],
    ["Breadcrumb schema implementation", "createBreadcrumbSchema", schema],
    ["Product schema implementation", "createProductSchema", schema],
    ["Product page uses Product schema", "createProductSchema", product],
    ["SEO manager uses WebPage schema", "setPageStructuredData", manager],
  ]) if (!check(label, source.includes(text))) failed = true;

  if (failed) {
    console.error("\nSEO audit failed.");
    process.exit(1);
  }
  console.log("\nSEO audit passed.");
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
