import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Accessible fullscreen image viewer. Closes on backdrop click, close
// button, or Escape; arrow keys move between images when there's more
// than one. Framer Motion handles a subtle entrance/exit only.
const ProductImageLightbox = ({ images, activeIndex, name, onClose, onNavigate }) => {
  const isOpen = activeIndex !== null && activeIndex >= 0;
  const total = images.length;

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && total > 1) onNavigate((activeIndex + 1) % total);
      if (e.key === "ArrowLeft" && total > 1) onNavigate((activeIndex - 1 + total) % total);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, activeIndex, total, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${name} — full screen image viewer`}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-primary/90 p-4"
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close full screen viewer"
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-background/10 text-background transition hover:bg-background/20"
          >
            <FiX size={20} />
          </button>

          {total > 1 && (
            <span className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-background/10 px-3 py-1 text-xs font-medium text-background">
              {activeIndex + 1} / {total}
            </span>
          )}

          {total > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate((activeIndex - 1 + total) % total);
              }}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-background/10 text-background transition hover:bg-background/20 sm:left-6"
            >
              <FiChevronLeft size={22} />
            </button>
          )}

          <motion.img
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            src={images[activeIndex]}
            alt={`${name} — full screen view`}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-full rounded-xl object-contain"
          />

          {total > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate((activeIndex + 1) % total);
              }}
              aria-label="Next image"
              className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-background/10 text-background transition hover:bg-background/20 sm:right-6"
            >
              <FiChevronRight size={22} />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductImageLightbox;
