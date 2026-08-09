import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "./Button";

// Generic premium CTA banner (dark gradient, decorative circles, 1-2 action
// buttons). Used by About/Contact/Custom Orders wherever the page needs a
// "final CTA" or "WhatsApp CTA" block, so that markup exists in one place.
//
// Each action: { label, to } for an in-app route (React Router Link),
// { label, href } for an external link (e.g. wa.me), or { label, scrollTo }
// to smoothly scroll to an element id on the same page. Optional `icon` is
// a react-icons component, `variant` follows Button's variants.
const CTABanner = ({ eyebrow, title, description, actions = [] }) => {
  const handleScrollTo = (elementId) => {
    document.getElementById(elementId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
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
        {eyebrow && (
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
            {eyebrow}
          </span>
        )}
        <h2 className="mt-4 font-heading text-3xl font-bold md:text-4xl">{title}</h2>
        {description && (
          <p className="mt-4 text-sm text-background/70 md:text-base">{description}</p>
        )}

        {actions.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {actions.map((action) => {
              const Icon = action.icon;
              const buttonContent = (
                <Button
                  variant={action.variant || "secondary"}
                  size="lg"
                  onClick={action.scrollTo ? () => handleScrollTo(action.scrollTo) : undefined}
                  className={
                    action.variant === "outline"
                      ? "border-background/40 text-background hover:bg-background hover:text-primary"
                      : undefined
                  }
                >
                  {Icon && <Icon size={16} />}
                  {action.label}
                </Button>
              );

              if (action.scrollTo) {
                return <span key={action.label}>{buttonContent}</span>;
              }

              return action.href ? (
                <a key={action.label} href={action.href} target="_blank" rel="noopener noreferrer">
                  {buttonContent}
                </a>
              ) : (
                <Link key={action.label} to={action.to}>
                  {buttonContent}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CTABanner;
