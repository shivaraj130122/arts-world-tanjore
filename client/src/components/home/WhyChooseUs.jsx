import { motion } from "framer-motion";
import {
  FiHeart,
  FiFeather,
  FiAward,
  FiEdit3,
  FiPackage,
  FiUsers,
} from "react-icons/fi";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import { SITE_NAME } from "../../constants";

const FEATURES = [
  { icon: FiHeart, title: "Handcrafted With Love", desc: "Every piece is created by hand, with patience and genuine care." },
  { icon: FiFeather, title: "Authentic Indian Art", desc: "Rooted in traditional Tanjore and fabric painting techniques." },
  { icon: FiAward, title: "Premium Materials", desc: "Fine pigments, quality fabric, and lasting finishes throughout." },
  { icon: FiEdit3, title: "Customized Creations", desc: "Personalized art and designs made to match your vision." },
  { icon: FiPackage, title: "Careful Packaging", desc: "Every order is packed with care to arrive safely, just as intended." },
  { icon: FiUsers, title: "Personal Customer Service", desc: "A real team behind every order, happy to help at any step." },
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: "easeOut" },
  }),
};

const WhyChooseUs = () => {
  return (
    <section className="section-y bg-primary text-background">
      <Container>
        <SectionTitle
          eyebrow="Our Promise"
          title={`Why Choose ${SITE_NAME}?`}
          description="Craftsmanship and trust, built into every piece we create."
          className="[&_h2]:text-background [&_span]:text-secondary"
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                custom={i}
                variants={itemVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-background/10 bg-background/5 p-6"
              >
                <div className="grid h-12 w-12 place-items-center rounded-full bg-secondary/15 text-secondary">
                  <Icon size={22} />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-sm text-background/65">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default WhyChooseUs;
