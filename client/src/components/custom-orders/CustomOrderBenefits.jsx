import { motion } from "framer-motion";
import { FiHeart, FiGift, FiHome, FiStar, FiFeather } from "react-icons/fi";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";

const BENEFITS = [
  { icon: FiHeart, title: "Personal Meaning", desc: "Made around a story, memory or idea that matters to you." },
  { icon: FiGift, title: "Unique Gift", desc: "A one-of-a-kind piece, not something anyone else will have." },
  { icon: FiHome, title: "Made for Your Space", desc: "Sized and styled to fit the room or moment you have in mind." },
  { icon: FiStar, title: "Special Occasions", desc: "Perfect for weddings, anniversaries, festivals and milestones." },
  { icon: FiFeather, title: "Creative Expression", desc: "Your ideas and preferences shape the finished artwork." },
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: "easeOut" },
  }),
};

const CustomOrderBenefits = () => {
  return (
    <section className="section-y bg-white">
      <Container>
        <SectionTitle eyebrow="Why Go Custom" title="Why Choose a Custom Artwork" />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {BENEFITS.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                custom={i}
                variants={itemVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-primary/10 bg-background p-5"
              >
                <div className="grid h-11 w-11 place-items-center rounded-full bg-secondary/15 text-secondary-dark">
                  <Icon size={19} />
                </div>
                <h3 className="mt-4 font-heading text-sm font-semibold text-primary sm:text-base">
                  {benefit.title}
                </h3>
                <p className="mt-1.5 text-xs text-text/60 sm:text-sm">{benefit.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default CustomOrderBenefits;
