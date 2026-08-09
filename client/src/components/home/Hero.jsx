import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Container from "../ui/Container";
import Button from "../ui/Button";
import logo from "../../assets/images/bhavani-art-world-logo.jpg";
import { SITE_TAGLINE, SITE_SECONDARY_TAGLINE } from "../../constants";

const floatTransition = (delay = 0) => ({
  y: [0, -14, 0],
  transition: { duration: 6, repeat: Infinity, ease: "easeInOut", delay },
});

// Full-screen luxury hero. Two-column composition on desktop (copy + logo
// artwork), stacked on mobile. Background is a maroon gradient placeholder —
// swap for real hero photography once available.
const Hero = () => {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-primary text-background">
      {/* Background texture placeholder */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(212,175,55,0.16),transparent_45%),radial-gradient(circle_at_85%_75%,rgba(212,175,55,0.12),transparent_50%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/70 to-primary" />

      {/* Floating decorative elements — slow, subtle, premium */}
      <motion.div
        animate={floatTransition(0)}
        className="pointer-events-none absolute left-[6%] top-[16%] h-24 w-24 rounded-full border border-secondary/30"
      />
      <motion.div
        animate={floatTransition(1.4)}
        className="pointer-events-none absolute right-[10%] top-[24%] h-16 w-16 rotate-45 border border-secondary/20"
      />
      <motion.div
        animate={floatTransition(0.8)}
        className="pointer-events-none absolute bottom-[16%] left-[14%] h-10 w-10 rounded-full bg-secondary/20"
      />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Copy column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-5 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-secondary"
            >
              {SITE_SECONDARY_TAGLINE}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="font-heading text-4xl font-bold leading-[1.15] sm:text-5xl md:text-6xl"
            >
              <span className="text-gradient-gold">{SITE_TAGLINE}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.7 }}
              className="mx-auto mt-6 max-w-lg text-sm text-background/75 md:text-base lg:mx-0"
            >
              Discover handcrafted Tanjore paintings, traditional art,
              creative designs and beautiful handmade pieces created with
              passion and precision.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
            >
              <Link to="/shop">
                <Button variant="secondary" size="lg">
                  Explore Collection
                </Button>
              </Link>
              <Link to="/custom-orders">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-background/40 text-background hover:bg-background hover:text-primary"
                >
                  Custom Order
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Logo / artwork column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative mx-auto flex w-full max-w-md items-center justify-center"
          >
            <div className="absolute inset-0 scale-110 rounded-full bg-secondary/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-secondary/25 shadow-2xl">
              <img
                src={logo}
                alt="Bhavani's Art World — official logo"
                className="h-full w-full object-contain"
              />
            </div>
          </motion.div>
        </div>
      </Container>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="h-9 w-5 rounded-full border border-secondary/50 p-1"
        >
          <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
