import { FiSearch, FiX, FiGrid, FiList, FiSliders } from "react-icons/fi";
import { SORT_OPTIONS } from "../../utils/productFilters";
import { classNames } from "../../utils/helpers";

const ShopToolbar = ({
  searchInput,
  onSearchChange,
  sort,
  onSortChange,
  view,
  onViewChange,
  shownCount,
  totalCount,
  onOpenMobileFilters,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <label className="relative flex-1">
          <span className="sr-only">Search products</span>
          <FiSearch
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text/40"
          />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search paintings, crafts and more..."
            className="w-full rounded-full border border-primary/20 bg-white py-2.5 pl-10 pr-10 text-sm outline-none focus:border-primary"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-text/40 hover:bg-primary/10 hover:text-primary"
            >
              <FiX size={14} />
            </button>
          )}
        </label>

        {/* Mobile filter trigger */}
        <button
          type="button"
          onClick={onOpenMobileFilters}
          className="flex items-center justify-center gap-2 rounded-full border border-primary/20 px-4 py-2.5 text-sm font-medium text-primary lg:hidden"
        >
          <FiSliders size={15} /> Filter &amp; Sort
        </button>

        {/* Sort (desktop) */}
        <label className="hidden items-center gap-2 lg:flex">
          <span className="sr-only">Sort products</span>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="rounded-full border border-primary/20 bg-white px-4 py-2.5 text-sm text-text outline-none focus:border-primary"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                Sort: {opt.label}
              </option>
            ))}
          </select>
        </label>

        {/* Grid/List toggle */}
        <div className="hidden items-center gap-1 rounded-full border border-primary/20 p-1 sm:flex">
          <button
            type="button"
            onClick={() => onViewChange("grid")}
            aria-label="Grid view"
            aria-pressed={view === "grid"}
            className={classNames(
              "grid h-8 w-8 place-items-center rounded-full transition",
              view === "grid" ? "bg-primary text-background" : "text-text/50 hover:text-primary"
            )}
          >
            <FiGrid size={15} />
          </button>
          <button
            type="button"
            onClick={() => onViewChange("list")}
            aria-label="List view"
            aria-pressed={view === "list"}
            className={classNames(
              "grid h-8 w-8 place-items-center rounded-full transition",
              view === "list" ? "bg-primary text-background" : "text-text/50 hover:text-primary"
            )}
          >
            <FiList size={15} />
          </button>
        </div>
      </div>

      <p className="text-xs text-text/50">
        Showing {shownCount} of {totalCount} products
      </p>
    </div>
  );
};

export default ShopToolbar;
