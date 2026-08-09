import { useState } from "react";
import { motion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import { classNames } from "../../utils/helpers";

const FAQS = [
  {
    q: "What information should I provide?",
    a: "Share as much as you can about your idea — the artwork type, size, style, occasion, and any details that matter to you. The more context, the better we can understand your vision.",
  },
  {
    q: "Can I share a reference image?",
    a: "Yes — the form above lets you attach a reference photo or sketch. It's optional, but it helps us get a clearer picture of what you have in mind.",
  },
  {
    q: "Can I request a specific size?",
    a: "Yes, you can note your preferred size in the form. We'll discuss what's possible based on the artwork type.",
  },
  {
    q: "Can I discuss my idea on WhatsApp?",
    a: "Yes — if you'd rather talk it through directly, use the WhatsApp button below to start a conversation with us.",
  },
];

const CustomOrderFAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="section-y bg-background">
      <Container>
        <SectionTitle eyebrow="Common Questions" title="Custom Order FAQ" />

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
                  aria-controls={`custom-order-faq-${i}`}
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
                    id={`custom-order-faq-${i}`}
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

export default CustomOrderFAQ;
