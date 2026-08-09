import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import Container from "../ui/Container";
import Button from "../ui/Button";
import logo from "../../assets/images/bhavani-art-world-logo-nav.jpg";
import { SITE_NAME, SITE_TAGLINE } from "../../constants";

// Short brand story section, sitting right after the hero — introduces the
// studio and its craft before the shopper reaches the catalogue.
const BrandIntro = () => {
  return (
    <section className="section-y bg-white">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
        >
          <div className="mb-6 h-16 w-16 overflow-hidden rounded-full border border-secondary/30 shadow-sm">
            <img
              src={logo}
              alt={`${SITE_NAME} logo`}
              className="h-full w-full object-cover"
            />
          </div>

          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary-dark">
            {SITE_NAME}
          </span>
          <h2 className="mt-3 font-heading text-2xl font-bold text-primary md:text-3xl">
            &ldquo;{SITE_TAGLINE}&rdquo;
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-text/70 md:text-base">
            Every piece from {SITE_NAME} begins with a story — of tradition,
            patience, and the artist's hand. From gold-leafed Tanjore
            paintings to hand-painted fabric and blouse art, each creation is
            made with genuine craftsmanship, not mass production. It's this
            care, carried across generations of Indian art, that we bring
            into every order.
          </p>

          <Link to="/about" className="mt-8">
            <Button variant="outline" size="md">
              Discover Our Story <FiArrowRight size={15} />
            </Button>
          </Link>
        </motion.div>
      </Container>
    </section>
  );
};

export default BrandIntro;
