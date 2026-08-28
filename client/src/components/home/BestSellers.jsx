import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import ProductCard from "../product/ProductCard";
import { getProducts } from "../../services/productService";

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, delay: i * 0.06, ease: "easeOut" },
  }),
};

const BestSellers = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        const data = await getProducts({ bestSeller: "true" });
        if (!cancelled) {
          setProducts(Array.isArray(data?.products) ? data.products : []);
        }
      } catch (error) {
        console.error("Load best seller homepage products error:", error);
        if (!cancelled) setProducts([]);
      }
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="section-y">
      <Container>
        <SectionTitle
          eyebrow="Customer Favorites"
          title="Best Sellers"
          description="Our most loved creations."
        />

        <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product, i) => (
            <motion.div
              key={product._id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default BestSellers;
