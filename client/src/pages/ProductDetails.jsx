import { useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import ProductGallery from "../components/product/ProductGallery";
import ProductImageLightbox from "../components/product/ProductImageLightbox";
import ProductInfo from "../components/product/ProductInfo";
import ProductActions from "../components/product/ProductActions";
import ProductInformation from "../components/product/ProductInformation";
import RelatedProducts from "../components/product/RelatedProducts";
import { products } from "../constants/products";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishlist";

// Looks up the product straight from the existing local product data — no
// backend call exists yet, so this is the same data source Shop.jsx and the
// Home sections already use.
const findProductById = (id) => products.find((p) => p._id === id);

const ProductNotFound = () => (
  <Container className="section-y flex min-h-[60vh] flex-col items-center justify-center text-center">
    <p className="font-heading text-6xl font-bold text-secondary">404</p>
    <h1 className="mt-3 font-heading text-2xl font-bold text-primary">
      Artwork Not Found
    </h1>
    <p className="mt-2 max-w-md text-sm text-text/60">
      Sorry, we couldn&apos;t find the artwork you&apos;re looking for.
    </p>
    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
      <Link to="/shop">
        <Button size="lg">Back to Shop</Button>
      </Link>
      <Link to="/shop">
        <Button size="lg" variant="outline">
          Explore Our Collection
        </Button>
      </Link>
    </div>
  </Container>
);

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const product = useMemo(() => findProductById(id), [id]);

  // Gallery falls back to the single `image` field when `images` is empty,
  // and to an empty array (handled gracefully by ProductGallery) if neither
  // exists — no fake image files are ever invented.
  const galleryImages = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.images) && product.images.length > 0) return product.images;
    if (product.image) return [product.image];
    return [];
  }, [product]);

  const [quantity, setQuantity] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  if (!product) {
    return <ProductNotFound />;
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate("/cart");
  };

  return (
    <div>
      <Container className="pt-6">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1.5 text-xs text-text/50"
        >
          <Link to="/" className="transition hover:text-primary">
            Home
          </Link>
          <FiChevronRight size={12} />
          <Link to="/shop" className="transition hover:text-primary">
            Shop
          </Link>
          {product.category && (
            <>
              <FiChevronRight size={12} />
              <Link
                to={`/shop?category=${product.category
                  .toLowerCase()
                  .replace(/\s+&\s+/g, "-")
                  .replace(/\s+/g, "-")}`}
                className="transition hover:text-primary"
              >
                {product.category}
              </Link>
            </>
          )}
          <FiChevronRight size={12} />
          <span className="max-w-[160px] truncate text-primary sm:max-w-xs">
            {product.name}
          </span>
        </nav>
      </Container>

      <Container className="section-y">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
          <ProductGallery
            images={galleryImages}
            name={product.name}
            onOpenLightbox={setLightboxIndex}
          />

          <div>
            <ProductInfo product={product} />

            <div className="mt-6">
              <ProductActions
                product={product}
                quantity={quantity}
                onQuantityChange={setQuantity}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                isWishlisted={isWishlisted(product._id)}
                onToggleWishlist={() => toggleWishlist(product)}
              />
            </div>

            <Link
              to="/shop"
              className="mt-6 inline-block text-sm font-medium text-primary underline underline-offset-4"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        <ProductInformation product={product} />
      </Container>

      <RelatedProducts currentProduct={product} />

      <ProductImageLightbox
        images={galleryImages}
        activeIndex={lightboxIndex}
        name={product.name}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
};

export default ProductDetails;
