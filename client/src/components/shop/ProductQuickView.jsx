import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiX, FiShoppingCart, FiHeart } from "react-icons/fi";
import PriceTag from "../ui/PriceTag";
import Rating from "../ui/Rating";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";

const STOCK_LABEL = {
  "in-stock": { label: "In Stock", variant: "success" },
  "low-stock": { label: "Low Stock", variant: "warning" },
  "out-of-stock": { label: "Out of Stock", variant: "warning" },
};

// Accessible modal: closable via backdrop click or the close button,
// product details filled in from whichever product is passed. Shared
// between the Shop page and the Home page's Featured Products section so
// there's only one Quick View implementation in the codebase.
const ProductQuickView = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/40 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`Quick view — ${product.name}`}
            className="relative grid w-full max-w-2xl grid-cols-1 gap-6 overflow-hidden rounded-3xl bg-white p-6 sm:grid-cols-2 sm:p-8"
          >
            <button
              onClick={onClose}
              aria-label="Close quick view"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-background text-primary hover:bg-primary/10"
            >
              <FiX size={18} />
            </button>

            <div className="relative aspect-square overflow-hidden rounded-2xl bg-background">
              <img
                src={product.image || "/placeholder-product.jpg"}
                alt={product.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="flex flex-col justify-center">
              <p className="text-xs uppercase tracking-wide text-secondary-dark">
                {product.category}
              </p>
              <h3 className="mt-1 font-heading text-xl font-bold text-primary">
                {product.name}
              </h3>

              {typeof product.rating === "number" && (
                <Rating value={product.rating} count={product.reviewCount} className="mt-2" />
              )}

              <div className="mt-4">
                <PriceTag
                  price={product.price}
                  oldPrice={product.originalPrice || product.oldPrice}
                  size="lg"
                />
              </div>

              {product.description && (
                <p className="mt-3 text-sm leading-relaxed text-text/65">
                  {product.description}
                </p>
              )}

              {product.stock && STOCK_LABEL[product.stock] && (
                <Badge variant={STOCK_LABEL[product.stock].variant} className="mt-3 w-fit">
                  {STOCK_LABEL[product.stock].label}
                </Badge>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  onClick={() => addToCart(product)}
                  disabled={product.stock === "out-of-stock"}
                >
                  <FiShoppingCart size={16} /> Add to Cart
                </Button>
                <Button variant="outline" onClick={() => toggleWishlist(product)}>
                  <FiHeart size={16} className={isWishlisted(product._id) ? "fill-primary" : ""} />
                  Wishlist
                </Button>
              </div>

              <Link
                to={`/product/${product._id}`}
                className="mt-5 text-sm font-medium text-primary underline underline-offset-4"
              >
                View full details
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductQuickView;
