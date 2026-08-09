// Centralizes all Shop product-discovery logic (search, category, price,
// availability, sorting) so Shop.jsx stays a thin coordinator instead of
// holding filtering logic inline.

import { categories } from "../constants/categories";

// Categories are linked app-wide via slug (e.g. ?category=tanjore-paintings),
// while products.js stores the human-readable category title. This map
// lets filtering accept the slug and match it to the right products.
const CATEGORY_TITLE_BY_SLUG = categories.reduce((acc, cat) => {
  acc[cat.slug] = cat.title;
  return acc;
}, {});

export const PAGE_SIZE = 8;

export const PRICE_RANGES = [
  { id: "all", label: "All Prices", min: 0, max: Infinity },
  { id: "under-2000", label: "Under \u20B92,000", min: 0, max: 2000 },
  { id: "2000-5000", label: "\u20B92,000 \u2013 \u20B95,000", min: 2000, max: 5000 },
  { id: "5000-10000", label: "\u20B95,000 \u2013 \u20B910,000", min: 5000, max: 10000 },
  { id: "10000-20000", label: "\u20B910,000 \u2013 \u20B920,000", min: 10000, max: 20000 },
  { id: "above-20000", label: "Above \u20B920,000", min: 20000, max: Infinity },
];

export const SORT_OPTIONS = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
  { id: "rating", label: "Rating: High to Low" },
  { id: "name-asc", label: "Name: A-Z" },
  { id: "name-desc", label: "Name: Z-A" },
];

export const AVAILABILITY_OPTIONS = [
  { id: "all", label: "All" },
  { id: "in-stock", label: "In Stock" },
  { id: "out-of-stock", label: "Out of Stock" },
];

export const DEFAULT_FILTERS = {
  search: "",
  category: "all",
  priceRange: "all",
  availability: "all",
  sort: "featured",
};

/**
 * Case-insensitive, whitespace-trimmed match against name/category/description.
 */
const matchesSearch = (product, rawQuery) => {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return true;
  const haystack = `${product.name} ${product.category} ${product.description || ""}`.toLowerCase();
  return haystack.includes(query);
};

const matchesCategory = (product, categorySlug) => {
  if (!categorySlug || categorySlug === "all") return true;
  const title = CATEGORY_TITLE_BY_SLUG[categorySlug];
  return product.category === title;
};

const matchesPriceRange = (product, rangeId) => {
  const range = PRICE_RANGES.find((r) => r.id === rangeId);
  if (!range || range.id === "all") return true;
  return product.price >= range.min && product.price < range.max;
};

const matchesAvailability = (product, availability) => {
  if (!availability || availability === "all") return true;
  if (availability === "in-stock") return product.stock !== "out-of-stock";
  if (availability === "out-of-stock") return product.stock === "out-of-stock";
  return true;
};

export const filterProducts = (products, filters) => {
  const { search = "", category = "all", priceRange = "all", availability = "all" } = filters;
  return products.filter(
    (product) =>
      matchesSearch(product, search) &&
      matchesCategory(product, category) &&
      matchesPriceRange(product, priceRange) &&
      matchesAvailability(product, availability)
  );
};

export const sortProducts = (products, sortId) => {
  const list = [...products];
  switch (sortId) {
    case "newest":
      return list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    case "price-low":
      return list.sort((a, b) => a.price - b.price);
    case "price-high":
      return list.sort((a, b) => b.price - a.price);
    case "rating":
      return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case "name-asc":
      return list.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return list.sort((a, b) => b.name.localeCompare(a.name));
    case "featured":
    default:
      return list.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  }
};

/**
 * Runs filtering then sorting in one pass — the single entry point Shop.jsx
 * (or any future page) should call.
 */
export const getFilteredAndSortedProducts = (products, filters) => {
  const filtered = filterProducts(products, filters);
  return sortProducts(filtered, filters.sort);
};

export const paginate = (items, page, pageSize = PAGE_SIZE) => {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
};

export const getTotalPages = (itemCount, pageSize = PAGE_SIZE) =>
  Math.max(1, Math.ceil(itemCount / pageSize));
