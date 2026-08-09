// Small, dependency-free helpers shared across the app.

export const formatCurrency = (amount, currency = "INR") => {
  const value = Number(amount) || 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
};

export const truncateText = (text = "", maxLength = 80) => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
};

export const classNames = (...classes) => classes.filter(Boolean).join(" ");

export const slugify = (text = "") =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
