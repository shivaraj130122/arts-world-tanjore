import { motion } from "framer-motion";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import { CONTACT_INFO } from "../../constants";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: "easeOut" },
  }),
};

const ContactCTA = () => {
  const whatsappNumber = CONTACT_INFO.phone.replace(/[^\d]/g, "");

  const options = [
    {
      icon: FiPhone,
      title: "Call Us",
      value: CONTACT_INFO.phone,
      href: `tel:${CONTACT_INFO.phone.replace(/\s+/g, "")}`,
    },
    {
      icon: FaWhatsapp,
      title: "WhatsApp",
      value: "Chat with us instantly",
      href: `https://wa.me/${whatsappNumber}`,
    },
    {
      icon: FiMail,
      title: "Email",
      value: CONTACT_INFO.email,
      href: `mailto:${CONTACT_INFO.email}`,
    },
  ];

  return (
    <section className="section-y bg-white">
      <Container>
        <SectionTitle
          eyebrow="Get In Touch"
          title="Let's Create Something Beautiful"
          description="Reach out for orders, questions, or a custom commission — we'd love to hear from you."
        />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {options.map((opt, i) => {
            const Icon = opt.icon;
            return (
              <motion.a
                key={opt.title}
                href={opt.href}
                target={opt.title === "WhatsApp" ? "_blank" : undefined}
                rel={opt.title === "WhatsApp" ? "noopener noreferrer" : undefined}
                custom={i}
                variants={itemVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.4 }}
                whileHover={{ y: -4 }}
                className="flex items-center gap-4 rounded-2xl border border-primary/10 bg-background p-6 transition hover:border-secondary hover:shadow-md"
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <Icon size={20} />
                </div>
                <div>
                  <p className="font-heading text-sm font-semibold text-primary">
                    {opt.title}
                  </p>
                  <p className="mt-0.5 text-sm text-text/60">{opt.value}</p>
                </div>
              </motion.a>
            );
          })}
        </div>

        <motion.div
          custom={3}
          variants={itemVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="mt-5 flex items-center justify-center gap-2 text-center text-sm text-text/60"
        >
          <FiMapPin className="shrink-0 text-secondary-dark" />
          <span>
            {CONTACT_INFO.address.line1}, {CONTACT_INFO.address.line2},{" "}
            {CONTACT_INFO.address.city}, {CONTACT_INFO.address.state}
          </span>
        </motion.div>
      </Container>
    </section>
  );
};

export default ContactCTA;
