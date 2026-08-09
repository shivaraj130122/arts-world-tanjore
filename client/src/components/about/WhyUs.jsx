import { motion } from "framer-motion";
import { FiFeather, FiEdit3, FiEye, FiFlag, FiAward, FiUsers } from "react-icons/fi";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import { SITE_NAME } from "../../constants";

const REASONS = [
  { icon: FiFeather, title: "Handcrafted Creativity", desc: "Every piece is made by hand, not mass-produced." },
  { icon: FiEdit3, title: "Personalized Designs", desc: "Custom artwork shaped around your idea and occasion." },
  { icon: FiEye, title: "Attention to Detail", desc: "Careful brushwork and finishing on every piece." },
  { icon: FiFlag, title: "Traditional Inspiration", desc: "Rooted in Tanjore and Indian art traditions." },
  { icon: FiAward, title: "Quality Materials", desc: "Fine pigments, gold foil, and lasting fabrics." },
  { icon: FiUsers, title: "Customer-Focused Service", desc: "A real person behind every order, happy to help." },
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: "easeOut" },
  }),
};

const WhyUs = () => {
  return (
    <section className="section-y bg-white">
      <Container>
        <SectionTitle eyebrow="Our Promise" title={`Why ${SITE_NAME}`} />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={reason.title}
                custom={i}
                variants={itemVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-primary/10 bg-background p-6"
              >
                <div className="grid h-11 w-11 place-items-center rounded-full bg-secondary/15 text-secondary-dark">
                  <Icon size={19} />
                </div>
                <h3 className="mt-4 font-heading text-base font-semibold text-primary">
                  {reason.title}
                </h3>
                <p className="mt-1.5 text-sm text-text/60">{reason.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default WhyUs;
