import { motion } from "framer-motion";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import Container from "../ui/Container";
import { CONTACT_INFO } from "../../constants";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: "easeOut" },
  }),
};

// Four contact cards, all sourced from the single CONTACT_INFO constant —
// no phone/email/address values are duplicated or re-typed here.
const ContactInfo = () => {
  const whatsappNumber = CONTACT_INFO.phone.replace(/[^\d]/g, "");

  const cards = [
    {
      icon: FiPhone,
      title: "Call Us",
      desc: CONTACT_INFO.phone,
      href: `tel:${CONTACT_INFO.phone.replace(/\s+/g, "")}`,
      label: `Call us at ${CONTACT_INFO.phone}`,
    },
    {
      icon: FaWhatsapp,
      title: "WhatsApp",
      desc: "Chat with us instantly",
      href: `https://wa.me/${whatsappNumber}`,
      label: "Chat with us on WhatsApp",
      external: true,
    },
    {
      icon: FiMail,
      title: "Email Us",
      desc: CONTACT_INFO.email,
      href: `mailto:${CONTACT_INFO.email}`,
      label: `Email us at ${CONTACT_INFO.email}`,
    },
    {
      icon: FiMapPin,
      title: "Visit Us",
      desc: `${CONTACT_INFO.address.line1}, ${CONTACT_INFO.address.line2}, ${CONTACT_INFO.address.city}, ${CONTACT_INFO.address.state}`,
      label: "Our business address",
    },
  ];

  return (
    <section className="section-y">
      <Container>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, i) => {
            const Icon = card.icon;
            const content = (
              <>
                <div className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary">
                  <Icon size={19} />
                </div>
                <p className="mt-4 font-heading text-sm font-semibold text-primary">
                  {card.title}
                </p>
                <p className="mt-1 text-sm text-text/60">{card.desc}</p>
              </>
            );

            return (
              <motion.div
                key={card.title}
                custom={i}
                variants={itemVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.4 }}
                whileHover={card.href ? { y: -4 } : undefined}
              >
                {card.href ? (
                  <a
                    href={card.href}
                    target={card.external ? "_blank" : undefined}
                    rel={card.external ? "noopener noreferrer" : undefined}
                    aria-label={card.label}
                    className="block rounded-2xl border border-primary/10 bg-white p-6 transition hover:border-secondary hover:shadow-md"
                  >
                    {content}
                  </a>
                ) : (
                  <div
                    aria-label={card.label}
                    className="rounded-2xl border border-primary/10 bg-white p-6"
                  >
                    {content}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default ContactInfo;
