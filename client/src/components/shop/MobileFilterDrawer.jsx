import { AnimatePresence, motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import ShopFilters from "./ShopFilters";
import { SORT_OPTIONS } from "../../utils/productFilters";

// Bottom-sheet style drawer on mobile — touch-friendly, closable via
// backdrop tap or the close button, with Apply/Clear actions at the bottom.
const MobileFilterDrawer = ({
  isOpen,
  onClose,
  filters,
  onChange,
  onClear,
  onApply,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-end bg-primary/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Filter and sort products"
            className="max-h-[85vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold text-primary">
                Filter &amp; Sort
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close filters"
                className="grid h-9 w-9 place-items-center rounded-full bg-background text-primary hover:bg-primary/10"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="mb-6">
              <h3 className="mb-3 font-heading text-base font-semibold text-primary">
                Sort By
              </h3>
              <select
                value={filters.sort}
                onChange={(e) => onChange({ sort: e.target.value })}
                className="w-full rounded-lg border border-primary/20 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <ShopFilters filters={filters} onChange={onChange} onClear={onClear} />

            <button
              type="button"
              onClick={onApply}
              className="mt-6 w-full rounded-full bg-primary py-3 text-sm font-semibold text-background"
            >
              Apply Filters
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileFilterDrawer;
