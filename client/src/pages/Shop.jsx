import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Container from "../components/ui/Container";
import ShopToolbar from "../components/shop/ShopToolbar";
import ShopFilters from "../components/shop/ShopFilters";
import MobileFilterDrawer from "../components/shop/MobileFilterDrawer";
import ProductGrid from "../components/shop/ProductGrid";
import Pagination from "../components/shop/Pagination";
import EmptyProducts from "../components/shop/EmptyProducts";
import ProductQuickView from "../components/shop/ProductQuickView";

import { categories } from "../constants/categories";
import { useDebounce } from "../hooks/useDebounce";

import {
  getFilteredAndSortedProducts,
  paginate,
  getTotalPages,
} from "../utils/productFilters";

import { getProducts } from "../services/productService";

const DEFAULT_FILTERS = {
  category: "all",
  priceRange: "all",
  availability: "all",
  sort: "featured",
};

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  );

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

  /*
   * Load products from MongoDB through the Express API.
   */
  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setLoadError("");

        const data = await getProducts();

        if (isMounted) {
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error("Failed to load products:", error);

        if (isMounted) {
          setLoadError(
            "Unable to load products right now. Please try again."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  /*
   * Keep the URL synchronized with searchable/filterable state.
   */
  useEffect(() => {
    const params = {};

    if (debouncedSearch.trim()) {
      params.search = debouncedSearch.trim();
    }

    if (filters.category !== "all") {
      params.category = filters.category;
    }

    if (filters.sort !== "featured") {
      params.sort = filters.sort;
    }

    setSearchParams(params, { replace: true });
  }, [
    debouncedSearch,
    filters.category,
    filters.sort,
    setSearchParams,
  ]);

  /*
   * If URL parameters change externally, synchronize the Shop state.
   */
  const [syncedParamsKey, setSyncedParamsKey] = useState(
    searchParams.toString()
  );

  const currentParamsKey = searchParams.toString();

  if (currentParamsKey !== syncedParamsKey) {
    setSyncedParamsKey(currentParamsKey);

    setSearchInput(searchParams.get("search") || "");

    setFilters((prev) => ({
      ...prev,
      category: searchParams.get("category") || "all",
      sort: searchParams.get("sort") || "featured",
    }));

    setPage(1);
  }

  /*
   * Apply frontend search/filter/sort logic
   * to the products received from MongoDB.
   */
  const activeFilters = useMemo(
    () => ({
      ...filters,
      search: debouncedSearch,
    }),
    [filters, debouncedSearch]
  );

  const visibleProducts = useMemo(
    () => getFilteredAndSortedProducts(products, activeFilters),
    [products, activeFilters]
  );

  const totalPages = getTotalPages(visibleProducts.length);

  const pageProducts = paginate(visibleProducts, page);

  const activeCategoryLabel =
    filters.category !== "all"
      ? categories.find((category) => category.slug === filters.category)
          ?.title
      : null;

  const handleSearchChange = (value) => {
    setSearchInput(value);
    setPage(1);
  };

  const handleFilterChange = (patch) => {
    setFilters((prev) => ({
      ...prev,
      ...patch,
    }));

    setPage(1);
  };

  const handleClearAll = () => {
    setSearchInput("");
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  return (
    <div>
      <Container className="section-y">
        {/* Page Header */}
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-secondary">
            Bhavani&apos;s Art World
          </p>

          <h1 className="mt-2 font-heading text-3xl font-semibold text-primary sm:text-4xl">
            {activeCategoryLabel || "Shop"}
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-text/60">
            Explore our collection of handcrafted paintings, customized
            artwork, blouse paintings, saree borders, gifts and more.
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="rounded-2xl border border-primary/10 bg-white p-10 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />

            <p className="mt-4 text-sm text-text/60">
              Loading artworks...
            </p>
          </div>
        )}

        {/* API Error */}
        {!isLoading && loadError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <h2 className="font-heading text-xl font-semibold text-primary">
              Unable to load artworks
            </h2>

            <p className="mt-2 text-sm text-red-700">
              {loadError}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Products */}
        {!isLoading && !loadError && (
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

            {/* Product Area */}
            <div className="lg:col-span-3">
              <ShopToolbar
                searchInput={searchInput}
                onSearchChange={handleSearchChange}
                sort={filters.sort}
                onSortChange={(sort) =>
                  handleFilterChange({ sort })
                }
                view={view}
                onViewChange={setView}
                shownCount={pageProducts.length}
                totalCount={visibleProducts.length}
                onOpenMobileFilters={() =>
                  setIsMobileFiltersOpen(true)
                }
              />

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
        )}
      </Container>

      {/* Mobile Filters */}
      <MobileFilterDrawer
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        filters={filters}
        onChange={handleFilterChange}
        onClear={handleClearAll}
        onApply={() => setIsMobileFiltersOpen(false)}
      />

      {/* Quick View */}
      <ProductQuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

export default Shop;