import { motion } from "framer-motion";
import { classNames } from "../../utils/helpers";

// Shared heading block used at the top of every homepage section.
const SectionTitle = ({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
}) => {
  const alignment = align === "left" ? "text-left items-start" : "text-center items-center";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={classNames("flex flex-col gap-3", alignment, className)}
    >
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary-dark">
          {eyebrow}
        </span>
      )}
      <h2 className="font-heading text-3xl font-bold text-primary md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-sm text-text/60 md:text-base">{description}</p>
      )}
    </motion.div>
  );
};

export default SectionTitle;
