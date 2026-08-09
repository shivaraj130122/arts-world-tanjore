import { motion } from "framer-motion";
import { FiUser } from "react-icons/fi";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import Rating from "../ui/Rating";
import { testimonials } from "../../constants/testimonials";

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" },
  }),
};

const Testimonials = () => {
  return (
    <section className="section-y bg-white">
      <Container>
        <SectionTitle
          eyebrow="Words From Our Patrons"
          title="What Our Customers Say"
          description="Stories from collectors and gift-givers who trusted us with something meaningful."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((item, i) => (
            <motion.div
              key={item.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ y: -4 }}
              className="flex flex-col rounded-2xl border border-primary/10 bg-background p-6"
            >
              <Rating value={item.rating} className="mb-4" />
              <p className="flex-1 text-sm italic leading-relaxed text-text/70">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <FiUser size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text">{item.name}</p>
                  <p className="text-xs text-text/50">{item.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Testimonials;
