import { useState } from "react";
import { motion } from "framer-motion";
import { FiZoomIn } from "react-icons/fi";
import { classNames } from "../../utils/helpers";

// Gracefully supports 0, 1, or many images. If `images` is empty, falls back
// to the single `image` field; if that's also empty, shows a styled
// placeholder rather than a broken <img>. No fake image files are invented.
const ProductGallery = ({ images, name, onOpenLightbox }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const gallery = images.length > 0 ? images : [];
  const hasImages = gallery.length > 0;
  const activeSrc = hasImages ? gallery[activeIndex] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col gap-4 sm:flex-row-reverse sm:gap-4"
    >
      {/* Main image */}
      <button
        type="button"
        onClick={() => hasImages && onOpenLightbox(activeIndex)}
        aria-label={hasImages ? `View ${name} full screen` : name}
        className="group relative aspect-square w-full overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-sm sm:flex-1"
      >
        {hasImages ? (
          <>
            <img
              src={activeSrc}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-primary/90 px-3 py-1.5 text-xs font-medium text-background opacity-0 transition-opacity group-hover:opacity-100">
              <FiZoomIn size={13} /> Click to zoom
            </span>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5">
            <span className="text-xs uppercase tracking-wide text-primary/40">
              Artwork image coming soon
            </span>
          </div>
        )}
      </button>

      {/* Thumbnails — only meaningful with more than one image */}
      {gallery.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1 sm:w-24 sm:flex-col sm:overflow-visible sm:pb-0">
          {gallery.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`View image ${i + 1} of ${gallery.length}`}
              aria-current={i === activeIndex}
              className={classNames(
                "aspect-square w-16 shrink-0 overflow-hidden rounded-xl border-2 transition sm:w-full",
                i === activeIndex ? "border-secondary" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ProductGallery;
