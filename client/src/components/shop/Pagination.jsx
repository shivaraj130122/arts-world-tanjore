import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { classNames } from "../../utils/helpers";

// Numbered pagination with Previous/Next. Collapses to a windowed set of
// page numbers around the current page once there are many pages, so it
// never overflows on mobile.
const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const windowSize = 1;
  for (let p = 1; p <= totalPages; p += 1) {
    const isEdge = p === 1 || p === totalPages;
    const isNearCurrent = Math.abs(p - page) <= windowSize;
    if (isEdge || isNearCurrent) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className="grid h-9 w-9 place-items-center rounded-full border border-primary/20 text-primary transition hover:bg-primary hover:text-background disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-primary"
      >
        <FiChevronLeft size={16} />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-1 text-sm text-text/40">
            &hellip;
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? "page" : undefined}
            className={classNames(
              "grid h-9 w-9 place-items-center rounded-full text-sm font-medium transition",
              p === page
                ? "bg-primary text-background"
                : "text-text/70 hover:bg-primary/10 hover:text-primary"
            )}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className="grid h-9 w-9 place-items-center rounded-full border border-primary/20 text-primary transition hover:bg-primary hover:text-background disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-primary"
      >
        <FiChevronRight size={16} />
      </button>
    </nav>
  );
};

export default Pagination;
