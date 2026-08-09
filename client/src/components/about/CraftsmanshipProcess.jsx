import { motion } from "framer-motion";
import { FiMessageCircle, FiPenTool, FiFeather, FiCheckCircle, FiPackage } from "react-icons/fi";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";

const STEPS = [
  { icon: FiMessageCircle, title: "Understand Your Idea", desc: "We listen to what you're picturing — the theme, the occasion, the feeling you want." },
  { icon: FiPenTool, title: "Design & Planning", desc: "Composition, colors and layout are planned before a single brushstroke begins." },
  { icon: FiFeather, title: "Artistic Creation", desc: "Each piece is hand-painted with care, layer by layer, using traditional techniques." },
  { icon: FiCheckCircle, title: "Finishing Details", desc: "Fine detailing, gold-foil work and final touches bring the piece to life." },
  { icon: FiPackage, title: "Carefully Prepared for You", desc: "Every artwork is checked and packed with care before it makes its way to you." },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: "easeOut" },
  }),
};

const CraftsmanshipProcess = () => {
  return (
    <section className="section-y bg-background">
      <Container>
        <SectionTitle eyebrow="Our Process" title="From Idea to Artwork" />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ y: -4 }}
                className="relative rounded-2xl border border-primary/10 bg-white p-5"
              >
                <span className="absolute right-4 top-4 font-heading text-2xl font-bold text-secondary/20">
                  {i + 1}
                </span>
                <div className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary">
                  <Icon size={19} />
                </div>
                <h3 className="mt-4 font-heading text-sm font-semibold text-primary sm:text-base">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-xs text-text/60 sm:text-sm">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default CraftsmanshipProcess;
