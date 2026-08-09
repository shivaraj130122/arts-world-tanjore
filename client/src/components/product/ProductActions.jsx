import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiShoppingCart, FiHeart, FiZap, FiEdit3 } from "react-icons/fi";
import QuantitySelector from "./QuantitySelector";
import Button from "../ui/Button";

const ProductActions = ({
  product,
  quantity,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist,
}) => {
  const isOutOfStock = product.stock === "out-of-stock";
  const maxQuantity = typeof product.stockCount === "number" ? product.stockCount : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      className="space-y-5"
    >
      <div>
        <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-text/50">
          Quantity
        </span>
        <QuantitySelector
          quantity={quantity}
          onChange={onQuantityChange}
          maxQuantity={maxQuantity}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          size="lg"
          onClick={onAddToCart}
          disabled={isOutOfStock}
          className="flex-1 sm:flex-none"
        >
          <FiShoppingCart size={17} /> Add to Cart
        </Button>
        <Button
          size="lg"
          variant="secondary"
          onClick={onBuyNow}
          disabled={isOutOfStock}
          className="flex-1 sm:flex-none"
        >
          <FiZap size={17} /> Buy Now
        </Button>
        <button
          type="button"
          onClick={onToggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-primary/20 text-primary transition hover:bg-secondary hover:border-secondary"
        >
          <FiHeart size={18} className={isWishlisted ? "fill-primary" : ""} />
        </button>
      </div>

      {/* Custom order cross-sell — appropriate for a made-to-order art business */}
      <div className="rounded-2xl border border-secondary/30 bg-secondary/10 p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-primary">
          <FiEdit3 size={15} /> Need a Custom Design?
        </p>
        <p className="mt-1 text-sm text-text/60">
          Have something special in mind? Create a personalized artwork with us.
        </p>
        <Link
          to="/custom-orders"
          className="mt-2 inline-block text-sm font-medium text-secondary-dark underline underline-offset-4"
        >
          Request Custom Order
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductActions;
