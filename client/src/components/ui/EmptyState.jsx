import { motion } from "framer-motion";

// Shared empty-state shell (icon circle + heading + description + actions).
// Originally only used by Shop's "no results" state — extracted here so
// Cart and Wishlist's empty states look and feel consistent with it instead
// of using their own plainer, unrelated markup.
const EmptyState = ({ icon: Icon, title, description, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center rounded-3xl border border-primary/10 bg-white px-6 py-16 text-center"
    >
      <div className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
        <Icon size={26} />
      </div>
      <h3 className="mt-5 font-heading text-xl font-semibold text-primary">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-text/60">{description}</p>}
      {children && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">{children}</div>
      )}
    </motion.div>
  );
};

export default EmptyState;
