import { motion } from "framer-motion";
import Rating from "../ui/Rating";
import PriceTag from "../ui/PriceTag";
import Badge from "../ui/Badge";
import { formatCurrency } from "../../utils/helpers";

const STOCK_DISPLAY = (stock, stockCount) => {
  if (stock === "out-of-stock") return { label: "Out of Stock", variant: "warning" };
  if (typeof stockCount === "number" && stockCount > 0 && stockCount <= 3) {
    return { label: `Only ${stockCount} left`, variant: "warning" };
  }
  return { label: "In Stock", variant: "success" };
};

const ProductInfo = ({ product }) => {
  const { name, category, price, originalPrice, rating, reviewCount, stock, stockCount, sku } = product;
  const stockDisplay = STOCK_DISPLAY(stock, stockCount);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
    >
      {category && (
        <p className="text-xs uppercase tracking-wide text-secondary-dark">{category}</p>
      )}

      <h1 className="mt-1.5 font-heading text-2xl font-bold text-primary sm:text-3xl">
        {name}
      </h1>

      {typeof rating === "number" && (
        <div className="mt-3">
          <Rating value={rating} count={reviewCount} size={16} />
        </div>
      )}

      <div className="mt-4">
        {originalPrice ? (
          <PriceTag price={price} oldPrice={originalPrice} size="lg" />
        ) : (
          <span className="text-2xl font-semibold text-primary">{formatCurrency(price)}</span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Badge variant={stockDisplay.variant}>{stockDisplay.label}</Badge>
        {sku && <span className="text-xs text-text/40">SKU: {sku}</span>}
      </div>
    </motion.div>
  );
};

export default ProductInfo;
