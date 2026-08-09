import { motion } from "framer-motion";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import ProductCard from "../product/ProductCard";
import { bestSellers } from "../../constants/products";

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, delay: i * 0.06, ease: "easeOut" },
  }),
};

const BestSellers = () => {
  return (
    <section className="section-y">
      <Container>
        <SectionTitle
          eyebrow="Customer Favorites"
          title="Best Sellers"
          description="Our most loved creations."
        />

        <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {bestSellers.map((product, i) => (
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
