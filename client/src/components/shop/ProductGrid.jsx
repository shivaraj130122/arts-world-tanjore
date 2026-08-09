import { motion } from "framer-motion";
import ProductCard from "../product/ProductCard";
import ProductListItem from "./ProductListItem";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: Math.min(i, 8) * 0.05, ease: "easeOut" },
  }),
};

const ProductGrid = ({ products, view, onQuickView }) => {
  if (view === "list") {
    return (
      <div className="flex flex-col gap-4">
        {products.map((product) => (
          <ProductListItem key={product._id} product={product} onQuickView={onQuickView} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, i) => (
        <motion.div
          key={product._id}
          custom={i}
          variants={cardVariants}
          initial="hidden"
          animate="show"
        >
          <ProductCard product={product} onQuickView={onQuickView} />
        </motion.div>
      ))}
    </div>
  );
};

export default ProductGrid;
