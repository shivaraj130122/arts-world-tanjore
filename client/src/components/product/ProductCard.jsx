import { Link } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiEye } from "react-icons/fi";
import { motion } from "framer-motion";
import { formatCurrency } from "../../utils/helpers";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import Badge from "../ui/Badge";
import PriceTag from "../ui/PriceTag";
import Rating from "../ui/Rating";
import ProductImage from "../ui/ProductImage";

// `onQuickView` is optional — pages that don't pass it (Cart, Wishlist)
// simply don't render the quick-view button, so existing usage is unaffected.
const ProductCard = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const {
    _id,
    name,
    price,
    oldPrice,
    originalPrice,
    image,
    category,
    rating,
    reviewCount,
    isNew,
    stock,
    badge,
  } = product;

  // Support both the original `oldPrice` field and the richer `originalPrice`
  // field used by constants/products.js, without breaking either caller.
  const strikePrice = originalPrice || oldPrice;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-sm hover:shadow-lg"
    >
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
        {badge ? (
          <Badge variant="primary">{badge}</Badge>
        ) : (
          isNew && <Badge variant="primary">New</Badge>
        )}
        {stock === "low-stock" && <Badge variant="warning">Low Stock</Badge>}
      </div>

      <button
        onClick={() => toggleWishlist(product)}
        aria-label="Toggle wishlist"
        className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-primary shadow-sm transition hover:bg-secondary hover:text-primary"
      >
        <FiHeart className={isWishlisted(_id) ? "fill-primary" : ""} />
      </button>

      <Link to={`/product/${_id}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden bg-background">
          <ProductImage
            src={image}
            alt={name}
            className="transition-transform duration-300 group-hover:scale-105"
          />
          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onQuickView(product);
              }}
              className="absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-center gap-2 rounded-full bg-primary/95 py-2 text-xs font-medium text-background opacity-0 backdrop-blur transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
            >
              <FiEye size={14} /> Quick View
            </button>
          )}
        </div>
      </Link>

      <div className="space-y-1.5 p-4">
        {category && (
          <p className="text-xs uppercase tracking-wide text-secondary-dark">{category}</p>
        )}
        <Link to={`/product/${_id}`}>
          <h3 className="line-clamp-1 font-heading text-base font-semibold text-text">
            {name}
          </h3>
        </Link>

        {typeof rating === "number" && <Rating value={rating} count={reviewCount} />}

        <div className="flex items-center justify-between pt-1">
          {strikePrice ? (
            <PriceTag price={price} oldPrice={strikePrice} />
          ) : (
            <span className="font-semibold text-primary">{formatCurrency(price)}</span>
          )}
          <button
            onClick={() => addToCart(product)}
            aria-label="Add to cart"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-background transition hover:bg-primary-light"
          >
            <FiShoppingCart size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
