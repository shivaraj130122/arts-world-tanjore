import { motion } from "framer-motion";
import { FiMessageCircle, FiUsers, FiFeather, FiPackage } from "react-icons/fi";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";

const STEPS = [
  { icon: FiMessageCircle, title: "Share Your Idea", desc: "Tell us what you're picturing — theme, size, occasion, or a reference image." },
  { icon: FiUsers, title: "Discuss Your Requirements", desc: "We go over the details together so the final piece matches your vision." },
  { icon: FiFeather, title: "Artwork Creation", desc: "Your piece is hand-painted with care, using traditional techniques." },
  { icon: FiPackage, title: "Final Artwork", desc: "Once complete, your artwork is carefully prepared and made ready for you." },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: "easeOut" },
  }),
};

// Deliberately no exact timelines/dates promised — none exist in the
// project's source of truth.
const CustomOrderSteps = () => {
  return (
    <section className="section-y bg-white">
      <Container>
        <SectionTitle eyebrow="The Process" title="How Custom Orders Work" />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
                className="relative rounded-2xl border border-primary/10 bg-background p-5"
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

export default CustomOrderSteps;
