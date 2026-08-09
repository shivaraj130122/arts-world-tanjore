import { motion } from "framer-motion";
import Container from "../ui/Container";
import ProductCard from "../product/ProductCard";
import { products } from "../../constants/products";

const RELATED_COUNT = 4;

// Prefers same-category products, excludes the current product, and fills
// remaining slots from the rest of the catalogue if the category alone
// doesn't have enough. Pure function — no extra state needed in the page.
const getRelatedProducts = (currentProduct) => {
  const others = products.filter((p) => p._id !== currentProduct._id);
  const sameCategory = others.filter((p) => p.category === currentProduct.category);
  const rest = others.filter((p) => p.category !== currentProduct.category);
  return [...sameCategory, ...rest].slice(0, RELATED_COUNT);
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.07, ease: "easeOut" },
  }),
};

const RelatedProducts = ({ currentProduct }) => {
  const related = getRelatedProducts(currentProduct);

  if (related.length === 0) return null;

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

export default RelatedProducts;
