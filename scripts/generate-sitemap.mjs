import fs from "node:fs/promises";
import path from "node:path";

const SITE_URL = "https://bhavaniartworld.shop";
const API_BASE_URL = (process.env.VITE_API_URL || process.env.API_BASE_URL || "").replace(/\/+$/, "");

if (!API_BASE_URL) {
  throw new Error("Missing API base URL. Set VITE_API_URL or API_BASE_URL before running the sitemap generator.");
}

const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status} while fetching ${url}`);
  return response.json();
};

const escapeXml = (value) => String(value)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&apos;");

const absoluteUrl = (value) => {
  if (!value) return "";
  try { return new URL(String(value), SITE_URL).href; } catch { return ""; }
};

const normalizeList = (data, key) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const normalizeDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
};

const addUrl = (urls, item) => {
  if (!urls.some((entry) => entry.loc === item.loc)) urls.push(item);
};

const main = async () => {
  const [productsData, categoriesData] = await Promise.all([
    fetchJson(`${API_BASE_URL}/products`),
    fetchJson(`${API_BASE_URL}/categories`),
  ]);

  const products = normalizeList(productsData, "products");
  const categories = normalizeList(categoriesData, "categories");
  const urls = [];

  const coreRoutes = [
    ["/", "weekly", "1.0"],
    ["/shop", "daily", "0.9"],
    ["/collections", "weekly", "0.8"],
    ["/custom-orders", "monthly", "0.8"],
    ["/about", "monthly", "0.7"],
    ["/contact", "monthly", "0.6"],
  ];

  for (const [route, changefreq, priority] of coreRoutes) {
    addUrl(urls, { loc: `${SITE_URL}${route}`, changefreq, priority });
  }

  for (const category of categories) {
    if (category?.isActive === false || !category?.slug) continue;
    addUrl(urls, {
      loc: `${SITE_URL}/shop?category=${encodeURIComponent(category.slug)}`,
      changefreq: "weekly",
      priority: "0.8",
      lastmod: normalizeDate(category.updatedAt || category.updated_at),
    });
  }

  for (const product of products) {
    if (product?.isActive === false) continue;
    const id = product?._id ?? product?.id;
    if (!id) continue;

    const imageCandidates = [
      ...(Array.isArray(product?.images) ? product.images : []),
      product?.image,
    ].filter(Boolean).map(absoluteUrl).filter(Boolean);

    addUrl(urls, {
      loc: `${SITE_URL}/product/${encodeURIComponent(id)}`,
      changefreq: "weekly",
      priority: "0.8",
      lastmod: normalizeDate(product.updatedAt || product.updated_at || product.createdAt),
      images: [...new Set(imageCandidates)].slice(0, 10),
      imageTitle: product?.name || "Bhavani's Art World artwork",
    });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map((item) => `  <url>
    <loc>${escapeXml(item.loc)}</loc>${item.lastmod ? `
    <lastmod>${escapeXml(item.lastmod)}</lastmod>` : ""}
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>${(item.images || []).map((image) => `
    <image:image>
      <image:loc>${escapeXml(image)}</image:loc>${item.imageTitle ? `
      <image:title>${escapeXml(item.imageTitle)}</image:title>` : ""}
    </image:image>`).join("")}
  </url>`).join("\n")}
</urlset>
`;

  const output = path.resolve("client/public/sitemap.xml");
  await fs.writeFile(output, xml, "utf8");
  console.log(`Sitemap generated: ${output}`);
  console.log(`URLs included: ${urls.length}`);
  console.log(`Image URLs included: ${urls.reduce((count, item) => count + (item.images?.length || 0), 0)}`);
};

main().catch((error) => {
  console.error("Sitemap generation failed:", error);
  process.exit(1);
});
