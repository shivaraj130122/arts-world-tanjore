import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiChevronRight } from "react-icons/fi";
import Container from "../ui/Container";
import { SITE_TAGLINE } from "../../constants";

// Compact premium header — keeps products visible quickly rather than
// pushing them below a tall hero. Breadcrumb reflects the active category
// via React Router Links (no page reload).
const ShopHeader = ({ activeCategoryLabel }) => {
  return (
    <section className="border-b border-primary/10 bg-primary text-background">
      <Container className="py-8 md:py-10">
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-xs text-background/60">
          <Link to="/" className="transition hover:text-secondary">
            Home
          </Link>
          <FiChevronRight size={12} />
          {activeCategoryLabel ? (
            <>
              <Link to="/shop" className="transition hover:text-secondary">
                Shop
              </Link>
              <FiChevronRight size={12} />
              <span className="text-secondary">{activeCategoryLabel}</span>
            </>
          ) : (
            <span className="text-secondary">Shop</span>
          )}
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h1 className="font-heading text-3xl font-bold md:text-4xl">Shop Our Art</h1>
          <p className="mt-2 text-sm text-secondary md:text-base">{SITE_TAGLINE}</p>
          <p className="mt-2 max-w-xl text-sm text-background/70">
            Discover handcrafted paintings, creative designs and timeless
            pieces made with passion.
          </p>
        </motion.div>
      </Container>
    </section>
  );
};

export default ShopHeader;
