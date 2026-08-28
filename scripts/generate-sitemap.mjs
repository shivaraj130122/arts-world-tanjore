import fs from "node:fs/promises";
import path from "node:path";

const SITE_URL = "https://bhavani-art-world.onrender.com";
const API_BASE_URL = (
  process.env.VITE_API_URL || process.env.API_BASE_URL || ""
).replace(/\/+$/, "");

if (!API_BASE_URL) {
  throw new Error(
    "Missing API base URL. Set VITE_API_URL or API_BASE_URL before running the sitemap generator."
  );
}

const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status} while fetching ${url}`);
  return response.json();
};

const escapeXml = (value) => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&apos;");

const normalizeList = (data, key) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const addUrl = (urls, loc, changefreq, priority, lastmod) => {
  if (!urls.some((item) => item.loc === loc)) {
    urls.push({ loc, changefreq, priority, lastmod });
  }
};

const validLastmod = (value) => {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

const main = async () => {
  const [productsData, categoriesData] = await Promise.all([
    fetchJson(`${API_BASE_URL}/products`),
    fetchJson(`${API_BASE_URL}/categories`),
  ]);

  const products = normalizeList(productsData, "products");
  const categories = normalizeList(categoriesData, "categories");
  const urls = [];

  addUrl(urls, `${SITE_URL}/`, "weekly", "1.0");
  addUrl(urls, `${SITE_URL}/shop`, "daily", "0.9");
  addUrl(urls, `${SITE_URL}/collections`, "weekly", "0.8");
  addUrl(urls, `${SITE_URL}/custom-orders`, "monthly", "0.8");
  addUrl(urls, `${SITE_URL}/about`, "monthly", "0.7");
  addUrl(urls, `${SITE_URL}/contact`, "monthly", "0.6");

  for (const category of categories) {
    if (category?.isActive === false || !category?.slug) continue;
    addUrl(
      urls,
      `${SITE_URL}/shop?category=${encodeURIComponent(category.slug)}`,
      "weekly",
      "0.8",
      validLastmod(category.updatedAt)
    );
  }

  for (const product of products) {
    if (product?.isActive === false) continue;
    const id = product?._id ?? product?.id;
    if (!id) continue;
    addUrl(
      urls,
      `${SITE_URL}/product/${encodeURIComponent(id)}`,
      "weekly",
      "0.8",
      validLastmod(product.updatedAt || product.createdAt)
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((item) => `  <url>
    <loc>${escapeXml(item.loc)}</loc>${item.lastmod ? `
    <lastmod>${escapeXml(item.lastmod)}</lastmod>` : ""}
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join("\n")}
</urlset>
`;

  const output = path.resolve("client/public/sitemap.xml");
  await fs.writeFile(output, xml, "utf8");
  console.log(`Sitemap generated: ${output}`);
  console.log(`URLs included: ${urls.length}`);
};

main().catch((error) => {
  console.error("Sitemap generation failed:", error);
  process.exit(1);
});
