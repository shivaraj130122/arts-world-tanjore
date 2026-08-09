import { motion } from "framer-motion";
import { FiArrowDown } from "react-icons/fi";
import Container from "../ui/Container";
import Button from "../ui/Button";

const scrollToForm = () => {
  document.getElementById("custom-order-form")?.scrollIntoView({ behavior: "smooth" });
};

const CustomOrderHero = () => {
  return (
    <section className="relative overflow-hidden bg-primary py-16 text-background sm:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(212,175,55,0.16),transparent_45%),radial-gradient(circle_at_80%_75%,rgba(212,175,55,0.12),transparent_50%)]" />

      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
            Made Just For You
          </span>
          <h1 className="mt-4 font-heading text-3xl font-bold sm:text-4xl md:text-5xl">
            Create Something Truly Yours
          </h1>
          <p className="mt-5 max-w-lg text-sm text-background/75 md:text-base mx-auto">
            Have a special idea in mind? Tell us what you imagine and let&apos;s
            turn it into a beautiful piece of art.
          </p>

          <Button
            size="lg"
            variant="secondary"
            onClick={scrollToForm}
            className="mt-8"
          >
            Start Your Custom Order <FiArrowDown size={16} />
          </Button>
        </motion.div>
      </Container>
    </section>
  );
};

export default CustomOrderHero;
