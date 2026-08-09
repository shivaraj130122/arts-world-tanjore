import { motion } from "framer-motion";
import { FiTag, FiDroplet, FiMaximize2, FiFeather, FiHeart, FiCalendar } from "react-icons/fi";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";

const CUSTOMIZABLE = [
  { icon: FiTag, label: "Theme" },
  { icon: FiDroplet, label: "Colors" },
  { icon: FiMaximize2, label: "Size" },
  { icon: FiFeather, label: "Artwork Style" },
  { icon: FiHeart, label: "Personalized Details" },
  { icon: FiCalendar, label: "Occasion" },
];

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, delay: i * 0.06, ease: "easeOut" },
  }),
};

const CustomOrderOptions = () => {
  return (
    <section className="section-y bg-background">
      <Container>
        <SectionTitle eyebrow="Make It Yours" title="What You Can Customize" />

        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-4">
          {CUSTOMIZABLE.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                custom={i}
                variants={itemVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.4 }}
                className="flex items-center gap-2.5 rounded-full border border-primary/15 bg-white px-5 py-3"
              >
                <Icon size={16} className="text-secondary-dark" />
                <span className="text-sm font-medium text-primary">{item.label}</span>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default CustomOrderOptions;
