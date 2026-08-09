import { motion } from "framer-motion";
import { FiFeather } from "react-icons/fi";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";

const PHILOSOPHY_POINTS = [
  "Every artwork tells a story.",
  "Tradition inspires creativity.",
  "Every detail matters.",
  "Art should feel personal.",
  "Craftsmanship creates lasting beauty.",
];

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  show: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" },
  }),
};

const ArtisticPhilosophy = () => {
  return (
    <section className="section-y bg-background">
      <Container>
        <SectionTitle eyebrow="What Guides Us" title="Our Philosophy" />

        <div className="mx-auto mt-10 max-w-2xl space-y-4">
          {PHILOSOPHY_POINTS.map((point, i) => (
            <motion.div
              key={point}
              custom={i}
              variants={itemVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              className="flex items-center gap-4 rounded-2xl border border-primary/10 bg-white px-5 py-4"
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary/15 text-secondary-dark">
                <FiFeather size={16} />
              </div>
              <p className="font-heading text-base font-medium text-primary sm:text-lg">
                {point}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default ArtisticPhilosophy;
