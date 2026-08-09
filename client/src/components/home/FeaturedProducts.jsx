import { useState } from "react";
import { motion } from "framer-motion";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import ProductCard from "../product/ProductCard";
import ProductQuickView from "../shop/ProductQuickView";
import { featuredProducts } from "../../constants/products";

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: "easeOut" },
  }),
};

const FeaturedProducts = () => {
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  return (
    <section className="section-y">
      <Container>
        <SectionTitle
          eyebrow="Handpicked For You"
          title="Featured Creations"
          description="Handcrafted pieces made to bring beauty and tradition into your space."
        />

        <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {featuredProducts.map((product, i) => (
            <motion.div
              key={product._id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              <ProductCard product={product} onQuickView={setQuickViewProduct} />
            </motion.div>
          ))}
        </div>
      </Container>

      <ProductQuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </section>
  );
};

export default FeaturedProducts;
