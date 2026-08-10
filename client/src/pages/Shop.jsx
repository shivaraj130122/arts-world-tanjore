import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Container from "../components/ui/Container";
import ShopToolbar from "../components/shop/ShopToolbar";
import ShopFilters from "../components/shop/ShopFilters";
import MobileFilterDrawer from "../components/shop/MobileFilterDrawer";
import ProductGrid from "../components/shop/ProductGrid";
import Pagination from "../components/shop/Pagination";
import EmptyProducts from "../components/shop/EmptyProducts";
import ProductQuickView from "../components/shop/ProductQuickView";

import { products } from "../constants/products";
import { categories } from "../constants/categories";
import { useDebounce } from "../hooks/useDebounce";

import {
  getFilteredAndSortedProducts,
  paginate,
  getTotalPages,
} from "../utils/productFilters";

const DEFAULT_FILTERS = {
  category: "all",
  priceRange: "all",
  availability: "all",
  sort: "featured",
};

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  );

  const [localFilters, setLocalFilters] = useState({
    priceRange: "all",
    availability: "all",
  });

  const [page, setPage] = useState(1);
  const [view, setView] = useState("grid");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const debouncedSearch = useDebounce(searchInput, 350);

  /*
   * Category and sort come directly from the URL.
   *
   * This makes Footer, Collections, browser navigation and direct URLs
   * all work from the same source of truth.
   */
  const category =
    searchParams.get("category") || "all";

  const sort =
    searchParams.get("sort") || "featured";

  const filters = useMemo(
    () => ({
      ...DEFAULT_FILTERS,
      category,
      sort,
      priceRange: localFilters.priceRange,
      availability: localFilters.availability,
    }),
    [
      category,
      sort,
      localFilters.priceRange,
      localFilters.availability,
    ]
  );

  const activeFilters = useMemo(
    () => ({
      ...filters,
      search: debouncedSearch,
    }),
    [filters, debouncedSearch]
  );

  const visibleProducts = useMemo(
    () =>
      getFilteredAndSortedProducts(
        products,
        activeFilters
      ),
    [activeFilters]
  );

  const totalPages = getTotalPages(
    visibleProducts.length
  );

  const pageProducts = paginate(
    visibleProducts,
    page
  );

  const activeCategoryLabel =
    category !== "all"
      ? categories.find(
          (item) => item.slug === category
        )?.title
      : null;

  /*
   * Search
   */
  const handleSearchChange = (value) => {
    setSearchInput(value);
    setPage(1);
  };

  /*
   * Filters
   */
  const handleFilterChange = (patch) => {
    setPage(1);

    /*
     * Category → URL
     */
    if (patch.category !== undefined) {
      const params = new URLSearchParams(searchParams);

      if (patch.category === "all") {
        params.delete("category");
      } else {
        params.set("category", patch.category);
      }

      setSearchParams(params, {
        replace: true,
      });
    }

    /*
     * Sort → URL
     */
    if (patch.sort !== undefined) {
      const params = new URLSearchParams(searchParams);

      if (patch.sort === "featured") {
        params.delete("sort");
      } else {
        params.set("sort", patch.sort);
      }

      setSearchParams(params, {
        replace: true,
      });
    }

    /*
     * Price and availability stay local.
     */
    if (
      patch.priceRange !== undefined ||
      patch.availability !== undefined
    ) {
      setLocalFilters((prev) => ({
        ...prev,
        ...patch,
      }));
    }
  };

  /*
   * Clear all filters
   */
  const handleClearAll = () => {
    setSearchInput("");

    setLocalFilters({
      priceRange: "all",
      availability: "all",
    });

    setPage(1);

    const params = new URLSearchParams();

    setSearchParams(params, {
      replace: true,
    });
  };

  return (
    <div>
      <Container className="section-y">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Desktop Filters */}
          <aside className="hidden lg:col-span-1 lg:block">
            <div className="sticky top-24">
              <ShopFilters
                filters={filters}
                onChange={handleFilterChange}
                onClear={handleClearAll}
              />
            </div>
          </aside>

          {/* Products */}
          <div className="lg:col-span-3">
            <ShopToolbar
              searchInput={searchInput}
              onSearchChange={handleSearchChange}
              sort={sort}
              onSortChange={(nextSort) =>
                handleFilterChange({
                  sort: nextSort,
                })
              }
              view={view}
              onViewChange={setView}
              shownCount={pageProducts.length}
              totalCount={visibleProducts.length}
              onOpenMobileFilters={() =>
                setIsMobileFiltersOpen(true)
              }
            />

            {/* Active Category */}
            {activeCategoryLabel && (
              <div className="mt-4">
                <p className="text-sm text-text/60">
                  Showing products from{" "}
                  <span className="font-semibold text-primary">
                    {activeCategoryLabel}
                  </span>
                </p>
              </div>
            )}

            {/* Product Grid */}
            <div className="mt-6">
              {pageProducts.length > 0 ? (
                <>
                  <ProductGrid
                    products={pageProducts}
                    view={view}
                    onQuickView={setQuickViewProduct}
                  />

                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </>
              ) : (
                <EmptyProducts
                  onClearFilters={handleClearAll}
                />
              )}
            </div>
          </div>
        </div>
      </Container>

      {/* Mobile Filters */}
      <MobileFilterDrawer
        isOpen={isMobileFiltersOpen}
        onClose={() =>
          setIsMobileFiltersOpen(false)
        }
        filters={filters}
        onChange={handleFilterChange}
        onClear={handleClearAll}
        onApply={() =>
          setIsMobileFiltersOpen(false)
        }
      />

      {/* Quick View */}
      <ProductQuickView
        product={quickViewProduct}
        onClose={() =>
          setQuickViewProduct(null)
        }
      />
    </div>
  );
};

export default Shop;