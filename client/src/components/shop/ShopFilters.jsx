import { classNames } from "../../utils/helpers";
import { PRICE_RANGES, AVAILABILITY_OPTIONS } from "../../utils/productFilters";
import { categories } from "../../constants/categories";

// Pure presentational filter controls. Used directly for the desktop
// sidebar, and reused inside MobileFilterDrawer so filter logic only
// exists in one place.
const ShopFilters = ({ filters, onChange, onClear }) => {
  const categoryOptions = [{ id: "all", title: "All", slug: "all" }, ...categories];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 font-heading text-base font-semibold text-primary">
          Categories
        </h3>
        <ul className="space-y-1.5 text-sm">
          {categoryOptions.map((cat) => {
            const isActive = filters.category === cat.slug;
            return (
              <li key={cat.slug}>
                <button
                  type="button"
                  onClick={() => onChange({ category: cat.slug })}
                  className={classNames(
                    "block w-full rounded-lg px-3 py-2 text-left transition",
                    isActive
                      ? "bg-primary text-background"
                      : "text-text/70 hover:bg-primary/10 hover:text-primary"
                  )}
                >
                  {cat.title}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <h3 className="mb-3 font-heading text-base font-semibold text-primary">
          Price
        </h3>
        <ul className="space-y-1.5 text-sm">
          {PRICE_RANGES.map((range) => {
            const isActive = filters.priceRange === range.id;
            return (
              <li key={range.id}>
                <button
                  type="button"
                  onClick={() => onChange({ priceRange: range.id })}
                  className={classNames(
                    "block w-full rounded-lg px-3 py-2 text-left transition",
                    isActive
                      ? "bg-primary text-background"
                      : "text-text/70 hover:bg-primary/10 hover:text-primary"
                  )}
                >
                  {range.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <h3 className="mb-3 font-heading text-base font-semibold text-primary">
          Availability
        </h3>
        <ul className="space-y-1.5 text-sm">
          {AVAILABILITY_OPTIONS.map((opt) => {
            const isActive = filters.availability === opt.id;
            return (
              <li key={opt.id}>
                <button
                  type="button"
                  onClick={() => onChange({ availability: opt.id })}
                  className={classNames(
                    "block w-full rounded-lg px-3 py-2 text-left transition",
                    isActive
                      ? "bg-primary text-background"
                      : "text-text/70 hover:bg-primary/10 hover:text-primary"
                  )}
                >
                  {opt.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <button
        type="button"
        onClick={onClear}
        className="w-full rounded-full border border-primary/20 px-4 py-2.5 text-sm font-medium text-primary transition hover:bg-primary hover:text-background"
      >
        Clear All
      </button>
    </div>
  );
};

export default ShopFilters;
