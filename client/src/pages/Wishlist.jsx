import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import ProductCard from "../components/product/ProductCard";
import { useWishlist } from "../hooks/useWishlist";

const Wishlist = () => {
  const { items } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="container-app section-y">
        <h1 className="mb-8 text-center font-heading text-3xl font-bold text-primary">
          Your Wishlist
        </h1>
        <EmptyState
          icon={FiHeart}
          title="Your wishlist is empty"
          description="Save the pieces you love here so you can find them again easily."
        >
          <Link to="/shop">
            <Button size="lg">Explore Shop</Button>
          </Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="container-app section-y">
      <h1 className="mb-8 font-heading text-3xl font-bold text-primary">Your Wishlist</h1>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
