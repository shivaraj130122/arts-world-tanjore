import { motion } from "framer-motion";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import { SITE_NAME } from "../../constants";

// Genuine, brand-focused story — no invented awards, years-in-business
// claims, team size, or celebrity customers, since none of that exists in
// the project's source of truth.
const BrandStory = () => {
  return (
    <section className="section-y bg-white">
      <Container>
        <SectionTitle
          eyebrow="Our Story"
          title="Where Creativity Meets Tradition"
          align="left"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-6 max-w-3xl space-y-4 text-sm leading-relaxed text-text/70 md:text-base"
        >
          <p>
            {SITE_NAME} began with a simple love for color, pattern and the
            traditional art forms of India. What started as a personal
            passion for Tanjore painting grew into a wider practice —
            fabric painting, blouse art, saree border work, and
            personalized creations made for real homes and real occasions.
          </p>
          <p>
            Every piece here is handmade, not mass-produced. That means
            each painting carries small, deliberate details — brushwork,
            gold-foil placement, color choices — shaped by the person
            making it, not a machine. We care about getting those details
            right, because they're what make a piece feel personal rather
            than generic.
          </p>
          <p>
            Whether it's a classic Tanjore painting, a hand-painted blouse
            for a wedding, or a custom portrait made just for you, the goal
            stays the same: art that tells a story worth keeping.
          </p>
        </motion.div>
      </Container>
    </section>
  );
};

export default BrandStory;
