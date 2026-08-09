import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Container from "../components/ui/Container";
import ShopHeader from "../components/shop/ShopHeader";
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

// Shop.jsx stays a thin coordinator: it owns state (search/filters/page/view),
// delegates rendering to components/shop/*, and delegates filtering/sorting
// math to utils/productFilters.js.
const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(searchInput, 350);

  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    category: searchParams.get("category") || "all",
    sort: searchParams.get("sort") || "featured",
  });

  const [page, setPage] = useState(1);
  const [view, setView] = useState("grid");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Keep the URL in sync with the state that's worth sharing/bookmarking.
  // setSearchParams has a stable identity from React Router, so including it
  // in the dependency array is safe and needs no lint suppression.
  useEffect(() => {
    const params = {};
    if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
    if (filters.category !== "all") params.category = filters.category;
    if (filters.sort !== "featured") params.sort = filters.sort;
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, filters.category, filters.sort, setSearchParams]);

  // The reverse direction: if the URL changes from outside this component
  // (e.g. the Navbar's search box navigating to /shop?search=... while Shop
  // is already mounted, so no remount happens), pick up the new values.
  // This uses React's documented "adjust state during render" pattern
  // (comparing against a tracked previous value) rather than a useEffect,
  // since setState calls inside an effect body cause cascading renders.
  const [syncedParamsKey, setSyncedParamsKey] = useState(searchParams.toString());
  const currentParamsKey = searchParams.toString();
  if (currentParamsKey !== syncedParamsKey) {
    setSyncedParamsKey(currentParamsKey);
    setSearchInput(searchParams.get("search") || "");
    setFilters((prev) => ({
      ...prev,
      category: searchParams.get("category") || "all",
      sort: searchParams.get("sort") || "featured",
    }));
  }

  // Any change to search/filters resets pagination back to page 1 — done
  // directly in the handlers below rather than a reactive effect, since
  // calling setState synchronously inside an effect causes cascading renders.

  const activeFilters = useMemo(
    () => ({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch]
  );

  const visibleProducts = useMemo(
    () => getFilteredAndSortedProducts(products, activeFilters),
    [activeFilters]
  );

  const totalPages = getTotalPages(visibleProducts.length);
  const pageProducts = paginate(visibleProducts, page);

  const activeCategoryLabel =
    filters.category !== "all"
      ? categories.find((c) => c.slug === filters.category)?.title
      : null;

  const handleSearchChange = (value) => {
    setSearchInput(value);
    setPage(1);
  };

  const handleFilterChange = (patch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(1);
  };

  const handleClearAll = () => {
    setSearchInput("");
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  return (
    <div>
      <ShopHeader activeCategoryLabel={activeCategoryLabel} />

      <Container className="section-y">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Desktop sidebar */}
          <aside className="hidden lg:col-span-1 lg:block">
            <div className="sticky top-24">
              <ShopFilters filters={filters} onChange={handleFilterChange} onClear={handleClearAll} />
            </div>
          </aside>

          {/* Products */}
          <div className="lg:col-span-3">
            <ShopToolbar
              searchInput={searchInput}
              onSearchChange={handleSearchChange}
              sort={filters.sort}
              onSortChange={(sort) => handleFilterChange({ sort })}
              view={view}
              onViewChange={setView}
              shownCount={pageProducts.length}
              totalCount={visibleProducts.length}
              onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
            />

            <div className="mt-6">
              {pageProducts.length > 0 ? (
                <>
                  <ProductGrid
                    products={pageProducts}
                    view={view}
                    onQuickView={setQuickViewProduct}
                  />
                  <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                </>
              ) : (
                <EmptyProducts onClearFilters={handleClearAll} />
              )}
            </div>
          </div>
        </div>
      </Container>

      <MobileFilterDrawer
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        filters={filters}
        onChange={handleFilterChange}
        onClear={handleClearAll}
        onApply={() => setIsMobileFiltersOpen(false)}
      />

      <ProductQuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
};

export default Shop;
