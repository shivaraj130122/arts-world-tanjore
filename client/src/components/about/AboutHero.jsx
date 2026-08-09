import { motion } from "framer-motion";
import Container from "../ui/Container";
import logo from "../../assets/images/bhavani-art-world-logo-nav.jpg";
import { SITE_NAME, SITE_TAGLINE } from "../../constants";

// Compact premium hero for the About page — logo, tagline, supporting copy.
// Reuses the same logo asset already used on the Home page (no new asset).
const AboutHero = () => {
  return (
    <section className="relative overflow-hidden bg-primary py-16 text-background sm:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(212,175,55,0.15),transparent_45%),radial-gradient(circle_at_85%_75%,rgba(212,175,55,0.1),transparent_50%)]" />

      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto flex max-w-2xl flex-col items-center text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="mb-6 h-16 w-16 overflow-hidden rounded-full border border-secondary/30 shadow-lg"
          >
            <img src={logo} alt={`${SITE_NAME} logo`} className="h-full w-full object-cover" />
          </motion.div>

          <h1 className="font-heading text-3xl font-bold sm:text-4xl md:text-5xl">
            About {SITE_NAME}
          </h1>
          <p className="mt-3 text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
            {SITE_TAGLINE}
          </p>
          <p className="mt-5 max-w-lg text-sm text-background/75 md:text-base">
            Celebrating creativity, craftsmanship and the beauty of
            Indian-inspired art through paintings, crafts and personalized
            creations.
          </p>
        </motion.div>
      </Container>
    </section>
  );
};

export default AboutHero;
