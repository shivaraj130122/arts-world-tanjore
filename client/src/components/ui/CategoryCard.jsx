import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

// Single category tile — image placeholder, title, description, explore CTA.
// Whole card is a hover target; the image zooms and the CTA nudges right.
const CategoryCard = ({ category, index = 0 }) => {
  const { title, description, slug } = category;

  return (
    <motion.div
      custom={index}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-3xl border border-primary/10 bg-background"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5">
        <div className="absolute inset-0 bg-primary/0 transition-colors duration-300 group-hover:bg-primary/20" />
        <div className="absolute inset-0 scale-100 bg-gradient-to-t from-primary/10 to-transparent transition-transform duration-500 group-hover:scale-110" />
      </div>

      <div className="p-6">
        <h3 className="font-heading text-lg font-semibold text-primary">{title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-text/60">{description}</p>
        <Link
          to={`/shop?category=${slug}`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-secondary-dark transition group-hover:gap-2.5"
        >
          Explore
          <FiArrowUpRight size={15} />
        </Link>
      </div>
    </motion.div>
  );
};

export default CategoryCard;
