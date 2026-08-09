import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import Container from "../ui/Container";
import Button from "../ui/Button";
import { CONTACT_INFO } from "../../constants";

const CustomOrderCTA = () => {
  const whatsappNumber = CONTACT_INFO.phone.replace(/[^\d]/g, "");

  return (
    <section className="section-y">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-primary to-primary-dark px-6 py-14 text-center text-background sm:px-12 md:py-20"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-secondary/10" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-secondary/10" />

          <div className="relative mx-auto max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
              Made Just For You
            </span>
            <h2 className="mt-4 font-heading text-3xl font-bold md:text-4xl">
              Create Something Truly Yours
            </h2>
            <p className="mt-4 text-sm text-background/70 md:text-base">
              Have a special design in mind? Let us create a personalized
              artwork for you.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link to="/custom-orders">
                <Button variant="secondary" size="lg">
                  Start a Custom Order <FiArrowRight size={16} />
                </Button>
              </Link>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="border-background/40 text-background hover:bg-background hover:text-primary"
                >
                  <FaWhatsapp size={16} /> WhatsApp Us
                </Button>
              </a>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default CustomOrderCTA;
