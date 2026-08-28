import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = {
  featured: "client/src/components/home/FeaturedProducts.jsx",
  newArrivals: "client/src/components/home/NewArrivals.jsx",
  bestSellers: "client/src/components/home/BestSellers.jsx",
};

let failed = false;

const pass = (message) => console.log(`PASS ${message}`);
const fail = (message) => {
  failed = true;
  console.log(`FAIL ${message}`);
};

const read = (relative) => {
  const absolute = path.join(root, relative);
  if (!fs.existsSync(absolute)) {
    fail(relative);
    return "";
  }
  pass(relative);
  return fs.readFileSync(absolute, "utf8");
};

console.log("Bhavani's Art World — Phase 6 live homepage products audit");
console.log("------------------------------------------------------------");

const featured = read(files.featured);
const newArrivals = read(files.newArrivals);
const bestSellers = read(files.bestSellers);

const check = (source, pattern, message) => {
  if (pattern.test(source)) pass(message);
  else fail(message);
};

check(featured, /getProducts/, "FeaturedProducts uses product API service");
check(featured, /getProducts\(\{\s*featured:\s*["']true["']\s*\}\)/,
  "FeaturedProducts requests featured products");

check(newArrivals, /getProducts/, "NewArrivals uses product API service");
check(newArrivals, /getProducts\(\{\s*newArrival:\s*["']true["']\s*\}\)/,
  "NewArrivals requests new arrival products");

check(bestSellers, /getProducts/, "BestSellers uses product API service");
check(bestSellers, /getProducts\(\{\s*bestSeller:\s*["']true["']\s*\}\)/,
  "BestSellers requests best seller products");

// The checks above intentionally look for the old static names only to catch regressions.
// A matching name is a failure condition, so correct those messages when present.
const forbidden = [
  [featured, /\{\s*featuredProducts\s*\}/, "FeaturedProducts no longer imports static featuredProducts"],
  [newArrivals, /\{\s*newArrivals\s*\}/, "NewArrivals no longer imports static newArrivals"],
  [bestSellers, /\{\s*bestSellers\s*\}/, "BestSellers no longer imports static bestSellers"],
];

for (const [source, pattern, message] of forbidden) {
  if (!pattern.test(source)) pass(message);
  else fail(message);
}

if (failed) {
  console.log("\nPhase 6 audit failed.");
  process.exit(1);
}

console.log("\nPhase 6 audit passed.");



