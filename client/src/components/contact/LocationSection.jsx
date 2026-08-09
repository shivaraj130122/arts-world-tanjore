import { motion } from "framer-motion";
import { FiMapPin, FiClock } from "react-icons/fi";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import { CONTACT_INFO } from "../../constants";

// No Google Maps embed/API or business-hours constant exists in the
// project's source of truth, so this stays a presentational location card
// rather than inventing coordinates, a map, or opening hours.
const LocationSection = () => {
  return (
    <section className="section-y bg-white">
      <Container>
        <SectionTitle eyebrow="Visit Us" title="Find Us" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-5 sm:grid-cols-2"
        >
          <div className="flex items-start gap-3 rounded-2xl border border-primary/10 bg-background p-6">
            <FiMapPin className="mt-1 shrink-0 text-secondary-dark" size={20} />
            <div>
              <p className="font-heading text-sm font-semibold text-primary">Address</p>
              <p className="mt-1 text-sm text-text/60">
                {CONTACT_INFO.address.line1}, {CONTACT_INFO.address.line2},{" "}
                {CONTACT_INFO.address.city}, {CONTACT_INFO.address.state}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-primary/10 bg-background p-6">
            <FiClock className="mt-1 shrink-0 text-secondary-dark" size={20} />
            <div>
              <p className="font-heading text-sm font-semibold text-primary">
                Business Hours
              </p>
              <p className="mt-1 text-sm text-text/60">
                Contact us for current availability.
              </p>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default LocationSection;
