import { useState } from "react";
import { motion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import { classNames } from "../../utils/helpers";

const FAQS = [
  {
    q: "Can I request a custom artwork?",
    a: "Yes — we welcome custom requests. Visit our Custom Orders page to share your idea and details.",
  },
  {
    q: "How can I ask about an artwork?",
    a: "You can reach us using the contact form above, by phone, email, or WhatsApp — whichever is easiest for you.",
  },
  {
    q: "Can I contact you through WhatsApp?",
    a: "Yes, WhatsApp is a great way to reach us directly for quick questions or to discuss an idea.",
  },
  {
    q: "Do you create personalized gifts?",
    a: "Yes — personalized gift art is one of our custom order categories. Let us know the occasion and we'll help.",
  },
];

const ContactFAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="section-y bg-background">
      <Container>
        <SectionTitle eyebrow="Helpful Information" title="Frequently Asked Questions" />

        <div className="mx-auto mt-10 max-w-2xl space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={faq.q}
                className="overflow-hidden rounded-2xl border border-primary/10 bg-white"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  aria-controls={`contact-faq-${i}`}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-heading text-sm font-semibold text-primary sm:text-base">
                    {faq.q}
                  </span>
                  <FiChevronDown
                    size={18}
                    className={classNames(
                      "shrink-0 text-secondary-dark transition-transform",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
                {isOpen && (
                  <motion.div
                    id={`contact-faq-${i}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="px-5 pb-4 text-sm text-text/60"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default ContactFAQ;
