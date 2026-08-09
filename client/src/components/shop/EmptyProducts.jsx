import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import Button from "../ui/Button";

// Shown when search/filters produce zero results. Offers a fast way out
// (clear filters) rather than leaving the shopper on a dead end.
const EmptyProducts = ({ onClearFilters }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center rounded-3xl border border-primary/10 bg-white px-6 py-16 text-center"
    >
      <div className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
        <FiSearch size={26} />
      </div>
      <h3 className="mt-5 font-heading text-xl font-semibold text-primary">
        No artworks found
      </h3>
      <p className="mt-2 max-w-sm text-sm text-text/60">
        Try adjusting your search or filters.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={onClearFilters}>Clear Filters</Button>
        <Link to="/shop">
          <Button variant="outline">Browse All Art</Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default EmptyProducts;
