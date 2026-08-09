import { motion } from "framer-motion";
import { FiImage } from "react-icons/fi";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import { ARTWORK_TYPES } from "../../constants/customOrders";

const scrollToForm = () => {
  document.getElementById("custom-order-form")?.scrollIntoView({ behavior: "smooth" });
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: "easeOut" },
  }),
};

const CustomOrderCategories = () => {
  return (
    <section className="section-y bg-background">
      <Container>
        <SectionTitle
          eyebrow="What We Can Create"
          title="Custom Artwork Categories"
          description="A starting point for your idea — every request is shaped around what you have in mind."
        />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ARTWORK_TYPES.map((type, i) => (
            <motion.button
              key={type.id}
              type="button"
              onClick={scrollToForm}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ y: -4 }}
              className="flex flex-col items-start rounded-2xl border border-primary/10 bg-white p-6 text-left transition hover:border-secondary hover:shadow-md"
            >
              <div className="grid h-11 w-11 place-items-center rounded-full bg-secondary/15 text-secondary-dark">
                <FiImage size={19} />
              </div>
              <h3 className="mt-4 font-heading text-base font-semibold text-primary">
                {type.title}
              </h3>
              <p className="mt-1.5 text-sm text-text/60">{type.desc}</p>
            </motion.button>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default CustomOrderCategories;
