import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve("client");
const REQUIRED_FILES = [
  "index.html",
  "public/robots.txt",
  "public/sitemap.xml",
];

const REQUIRED_HTML_PATTERNS = [
  /<meta\s+[\s\S]*?name=["']description["']/i,
  /<meta\s+[\s\S]*?property=["']og:title["']/i,
  /<meta\s+[\s\S]*?property=["']og:description["']/i,
  /<meta\s+[\s\S]*?name=["']twitter:card["']/i,
  /<link\s+[\s\S]*?rel=["']canonical["']/i,
];

const exists = async (file) => {
  try {
    await fs.access(path.join(ROOT, file));
    return true;
  } catch {
    return false;
  }
};

const main = async () => {
  let failed = false;

  console.log("Bhavani's Art World — Phase 2H SEO audit");
  console.log("-----------------------------------------");

  for (const file of REQUIRED_FILES) {
    const ok = await exists(file);
    console.log(`${ok ? "PASS" : "FAIL"} ${file}`);
    if (!ok) failed = true;
  }

  const indexPath = path.join(ROOT, "index.html");
  let indexHtml = "";

  try {
    indexHtml = await fs.readFile(indexPath, "utf8");
  } catch {
    console.log("FAIL client/index.html could not be read");
    process.exit(1);
  }
for (const pattern of REQUIRED_HTML_PATTERNS) {
  const ok = pattern.test(indexHtml);
  console.log(
    `${ok ? "PASS" : "FAIL"} ${pattern.source}`
  );
  if (!ok) failed = true;
}
  

  const sitemapPath = path.join(ROOT, "public/sitemap.xml");

  try {
    const sitemap = await fs.readFile(sitemapPath, "utf8");
    const hasUrlset =
      sitemap.includes("<urlset") &&
      sitemap.includes("sitemaps.org/schemas/sitemap/0.9");
    const hasUrl = sitemap.includes("<url>");

    console.log(`${hasUrlset ? "PASS" : "FAIL"} sitemap XML structure`);
    console.log(`${hasUrl ? "PASS" : "FAIL"} sitemap contains URL entries`);

    if (!hasUrlset || !hasUrl) failed = true;
  } catch {
    // Already reported by REQUIRED_FILES.
  }

  const robotsPath = path.join(ROOT, "public/robots.txt");

  try {
    const robots = await fs.readFile(robotsPath, "utf8");
    const hasSitemap =
      robots.includes("Sitemap: https://bhavani-art-world.onrender.com/sitemap.xml");
    const protectsAdmin = robots.includes("Disallow: /admin");

    console.log(`${hasSitemap ? "PASS" : "FAIL"} robots sitemap reference`);
    console.log(`${protectsAdmin ? "PASS" : "FAIL"} admin crawl restriction`);

    if (!hasSitemap || !protectsAdmin) failed = true;
  } catch {
    // Already reported by REQUIRED_FILES.
  }

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
