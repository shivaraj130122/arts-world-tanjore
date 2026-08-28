import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import ProductGallery from "../components/product/ProductGallery";
import ProductImageLightbox from "../components/product/ProductImageLightbox";
import ProductInfo from "../components/product/ProductInfo";
import ProductActions from "../components/product/ProductActions";
import ProductInformation from "../components/product/ProductInformation";
import RelatedProducts from "../components/product/RelatedProducts";

import { getProductById } from "../services/productService";
import { setSEO } from "../components/seo/SEOManager";
import {
  createBreadcrumbSchema,
  createProductSchema,
} from "../components/seo/structuredData";
import { useCart } from "../hooks/useCart";
import { PageSearchContent } from "../components/seo/SearchLandingContent";
import { trackEvent } from "../services/analytics";
import { useWishlist } from "../hooks/useWishlist";

const SITE_URL = "https://bhavani-art-world.onrender.com";

const ProductNotFound = () => {
  useEffect(() => {
    setSEO({
      title: "Artwork Not Found | Bhavani's Art World",
      description:
        "The requested artwork could not be found. Explore handcrafted Tanjore paintings and other artwork at Bhavani's Art World.",
      canonicalUrl: `${SITE_URL}/shop`,
    });
  }, []);

  return (
    <Container className="section-y">
      <div className="mx-auto max-w-xl text-center">
        <div className="font-heading text-6xl font-bold text-primary/20">
          404
        </div>
        <h1 className="mt-4 font-heading text-3xl font-semibold text-primary">
          Artwork Not Found
        </h1>
        <p className="mt-3 text-sm leading-6 text-text/60">
          Sorry, we couldn&apos;t find the artwork you&apos;re looking for.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link to="/shop">
            <Button>Back to Shop</Button>
          </Link>
          <Link to="/collections">
            <Button variant="secondary">Explore Our Collection</Button>
          </Link>
        </div>
      </div>
    </Container>
  );
};

const ProductLoading = () => (
  <Container className="section-y">
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
      <div className="aspect-square animate-pulse rounded-2xl bg-primary/5" />
      <div className="space-y-5">
        <div className="h-5 w-32 animate-pulse rounded bg-primary/5" />
        <div className="h-10 w-3/4 animate-pulse rounded bg-primary/5" />
        <div className="h-24 w-full animate-pulse rounded bg-primary/5" />
        <div className="h-12 w-40 animate-pulse rounded bg-primary/5" />
      </div>
    </div>
  </Container>
);

const upsertJsonLd = (id, data) => {
  let script = document.head.querySelector(`script[data-seo-jsonld="${id}"]`);
  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-seo-jsonld", id);
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
};

const removeJsonLd = (id) => {
  document.head.querySelector(`script[data-seo-jsonld="${id}"]`)?.remove();
};

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getProductById(id);

        if (isMounted) {
          setProduct(data.product || null);
        }
      } catch (requestError) {
        console.error("Failed to load product:", requestError);

        if (isMounted) {
          setProduct(null);
          setError(
            requestError.message || "Unable to load this artwork."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (id) {
      loadProduct();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!product) return;

    const productTitle = String(product.name || "Handcrafted Artwork").trim();
    const productDescription = String(
      product.description ||
        `Explore ${productTitle} from Bhavani's Art World, featuring handcrafted Indian artistry and traditional Tanjore-inspired craftsmanship.`
    )
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 160);

    const productImage =
      product.image ||
      (Array.isArray(product.images) ? product.images[0] : null);

    const canonicalUrl = `${SITE_URL}/product/${encodeURIComponent(product._id || id)}`;

    setSEO({
      title: `${productTitle} | Bhavani's Art World`,
      description: productDescription,
      canonicalUrl,
      image: productImage || undefined,
      imageAlt: productTitle,
      type: "product",
    });

    upsertJsonLd("product", createProductSchema({ product, url: canonicalUrl }));
    trackEvent("view_item", {
      currency: "INR",
      value: Number(product.price) || 0,
      items: [{
        item_id: String(product._id || id),
        item_name: productTitle,
        item_category: product.category || "Artwork",
        price: Number(product.price) || 0,
      }],
    });
    upsertJsonLd("product-breadcrumbs", createBreadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "Shop", url: `${SITE_URL}/shop` },
      ...(product.category ? [{
        name: product.category,
        url: `${SITE_URL}/shop?category=${encodeURIComponent(
          String(product.category).toLowerCase().replace(/\s+&\s+/g, "-").replace(/\s+/g, "-")
        )}`,
      }] : []),
      { name: productTitle, url: canonicalUrl },
    ]));

    return () => {
      removeJsonLd("product");
      removeJsonLd("product-breadcrumbs");
    };
  }, [product, id]);

  if (isLoading) {
    return <ProductLoading />;
  }

  if (!product || error) {
    return <ProductNotFound />;
  }

  return (
    <ProductDetailsContent
      key={product._id}
      product={product}
    />
  );
};

const ProductDetailsContent = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const galleryImages = useMemo(() => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images;
    }

    if (product.image) {
      return [product.image];
    }

    return [];
  }, [product]);

  const [quantity, setQuantity] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate("/cart");
  };

  const categorySlug = product.category
    ? product.category
        .toLowerCase()
        .replace(/\s+&\s+/g, "-")
        .replace(/\s+/g, "-")
    : null;

  return (
    <div>
      <Container>
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 py-5 text-sm text-text/60"
        >
          <Link to="/" className="transition hover:text-primary">
            Home
          </Link>

          <FiChevronRight size={14} />

          <Link to="/shop" className="transition hover:text-primary">
            Shop
          </Link>

          {categorySlug && (
            <>
              <FiChevronRight size={14} />
              <Link
                to={`/shop?category=${categorySlug}`}
                className="transition hover:text-primary"
              >
                {product.category}
              </Link>
            </>
          )}

          <FiChevronRight size={14} />

          <span className="max-w-[220px] truncate text-text/40">
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

      <PageSearchContent
        title={`${product.name} | Bhavani's Art World`}
        links={[
          { to: categorySlug ? `/shop?category=${categorySlug}` : "/shop", label: product.category ? `More ${product.category}` : "Shop Artwork" },
          { to: "/collections", label: "Explore Collections" },
          { to: "/custom-orders", label: "Request Custom Artwork" },
        ]}
      >
        Discover this handcrafted artwork from Bhavani&apos;s Art World. Browse related {product.category || "artwork"} and explore our wider range of traditional Indian art, handmade creations and custom artwork.
      </PageSearchContent>

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
