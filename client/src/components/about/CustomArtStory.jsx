import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import Container from "../ui/Container";
import Button from "../ui/Button";

const OCCASIONS = ["Custom portraits", "Special occasions", "Gifts", "Traditional artwork", "Personalized designs"];

const CustomArtStory = () => {
  return (
    <section className="section-y bg-background">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="aspect-[4/3] w-full rounded-3xl bg-gradient-to-br from-primary/10 via-secondary/15 to-primary/5"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary-dark">
              Made For You
            </span>
            <h2 className="mt-3 font-heading text-2xl font-bold text-primary md:text-3xl">
              Every Custom Piece Has a Story
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-text/70 md:text-base">
              Beyond our ready collections, we welcome requests for
              personalized artwork — made around your idea, your colors,
              and your occasion.
            </p>

            <ul className="mt-5 flex flex-wrap gap-2">
              {OCCASIONS.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-primary/15 bg-white px-3.5 py-1.5 text-xs font-medium text-primary"
                >
                  {item}
                </li>
              ))}
            </ul>

            <Link to="/custom-orders" className="mt-7 inline-block">
              <Button size="lg">
                Create Your Custom Artwork <FiArrowRight size={16} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default CustomArtStory;
