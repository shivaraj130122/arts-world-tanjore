import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Container from "../ui/Container";
import ProductCard from "../product/ProductCard";
import { getProducts } from "../../services/productService";

const RELATED_COUNT = 4;

const getRelatedProducts = (currentProduct, products) => {
  if (!currentProduct || !Array.isArray(products)) {
    return [];
  }

  const currentId = String(currentProduct._id || "");

  const currentCategory = String(
    currentProduct.category || ""
  )
    .trim()
    .toLowerCase();

  // Only use products that currently exist in the backend
  // and are active. Deleted/muted products are excluded.
  const activeProducts = products.filter((product) => {
    if (!product?._id) return false;
    if (String(product._id) === currentId) return false;
    if (product.isActive === false) return false;

    return true;
  });

  const sameCategory = activeProducts.filter((product) => {
    const category = String(product.category || "")
      .trim()
      .toLowerCase();

    return category === currentCategory;
  });

  const rest = activeProducts.filter((product) => {
    const category = String(product.category || "")
      .trim()
      .toLowerCase();

    return category !== currentCategory;
  });

  return [...sameCategory, ...rest].slice(0, RELATED_COUNT);
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: i * 0.07,
      ease: "easeOut",
    },
  }),
};

const RelatedProducts = ({ currentProduct }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        setIsLoading(true);

        const data = await getProducts();

        if (!cancelled) {
          setProducts(
            Array.isArray(data?.products)
              ? data.products
              : []
          );
        }
      } catch (error) {
        console.error(
          "Failed to load related products:",
          error
        );

        if (!cancelled) {
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const related = getRelatedProducts(
    currentProduct,
    products
  );

  // Don't show an empty section while products are loading
  // or when there are no valid related products.
  if (isLoading || related.length === 0) {
    return null;
  }

  return (
    <section className="section-y bg-white">
      <Container>
        <h2 className="font-heading text-2xl font-bold text-primary md:text-3xl">
          You May Also Like
        </h2>

        <p className="mt-1.5 text-sm text-text/60">
          More handcrafted pieces from Bhavani&apos;s Art World.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {related.map((product, i) => (
            <motion.div
              key={product._id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{
                once: true,
                amount: 0.3,
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default RelatedProducts;