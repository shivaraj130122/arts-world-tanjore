import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHeart, FiShoppingCart, FiEye } from "react-icons/fi";
import { formatCurrency } from "../../utils/helpers";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import Badge from "../ui/Badge";
import PriceTag from "../ui/PriceTag";
import Rating from "../ui/Rating";

// Horizontal layout used only by Shop's List view — image on the left,
// details and actions on the right. Uses the same Cart/Wishlist context as
// ProductCard, so behavior stays identical between Grid and List.
const ProductListItem = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const {
    _id,
    name,
    price,
    originalPrice,
    image,
    category,
    description,
    rating,
    reviewCount,
    isNew,
    stock,
    badge,
  } = product;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group flex gap-4 rounded-2xl border border-primary/10 bg-white p-3 shadow-sm transition hover:shadow-lg sm:gap-6 sm:p-4"
    >
      <Link
        to={`/product/${_id}`}
        className="relative w-28 shrink-0 overflow-hidden rounded-xl bg-background sm:w-44"
      >
        <div className="relative aspect-square w-full overflow-hidden">
          <img
            src={image || "/placeholder-product.jpg"}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {badge ? (
            <Badge variant="primary">{badge}</Badge>
          ) : (
            isNew && <Badge variant="primary">New</Badge>
          )}
        </div>
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        {category && (
          <p className="text-xs uppercase tracking-wide text-secondary-dark">{category}</p>
        )}
        <Link to={`/product/${_id}`}>
          <h3 className="mt-0.5 line-clamp-1 font-heading text-base font-semibold text-text sm:text-lg">
            {name}
          </h3>
        </Link>
        {description && (
          <p className="mt-1 line-clamp-2 hidden text-sm text-text/60 sm:block">
            {description}
          </p>
        )}

        {typeof rating === "number" && (
          <Rating value={rating} count={reviewCount} className="mt-2" />
        )}

        <div className="mt-2 flex items-center gap-3">
          {originalPrice ? (
            <PriceTag price={price} oldPrice={originalPrice} />
          ) : (
            <span className="font-semibold text-primary">{formatCurrency(price)}</span>
          )}
          {stock === "out-of-stock" && <Badge variant="warning">Out of Stock</Badge>}
          {stock === "low-stock" && <Badge variant="warning">Low Stock</Badge>}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            onClick={() => addToCart(product)}
            disabled={stock === "out-of-stock"}
            className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-medium text-background transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiShoppingCart size={14} /> Add to Cart
          </button>
          <button
            onClick={() => toggleWishlist(product)}
            aria-label="Toggle wishlist"
            className="grid h-9 w-9 place-items-center rounded-full border border-primary/20 text-primary transition hover:bg-secondary hover:border-secondary"
          >
            <FiHeart size={15} className={isWishlisted(_id) ? "fill-primary" : ""} />
          </button>
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              aria-label="Quick view"
              className="hidden h-9 w-9 place-items-center rounded-full border border-primary/20 text-primary transition hover:bg-primary/10 sm:grid"
            >
              <FiEye size={15} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductListItem;
