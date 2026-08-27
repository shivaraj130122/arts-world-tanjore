import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import Container from "../components/ui/Container";
import ShopHeader from "../components/shop/ShopHeader";
import ShopToolbar from "../components/shop/ShopToolbar";
import ShopFilters from "../components/shop/ShopFilters";
import MobileFilterDrawer from "../components/shop/MobileFilterDrawer";
import ProductGrid from "../components/shop/ProductGrid";
import Pagination from "../components/shop/Pagination";
import EmptyProducts from "../components/shop/EmptyProducts";
import ProductQuickView from "../components/shop/ProductQuickView";

import { useDebounce } from "../hooks/useDebounce";

import {
  getProducts,
} from "../services/productService";

import {
  getCategories,
} from "../services/categoryService";

import {
  getFilteredAndSortedProducts,
  paginate,
  getTotalPages,
  DEFAULT_FILTERS,
} from "../utils/productFilters";

const Shop = () => {
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const [
    products,
    setProducts,
  ] = useState([]);

  const [
    categories,
    setCategories,
  ] = useState([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    loadError,
    setLoadError,
  ] = useState("");

  const [
    searchInput,
    setSearchInput,
  ] = useState(
    searchParams.get(
      "search"
    ) || ""
  );

  const debouncedSearch =
    useDebounce(
      searchInput,
      350
    );

  const [
    filters,
    setFilters,
  ] = useState({
    ...DEFAULT_FILTERS,
    category:
      searchParams.get(
        "category"
      ) || "all",
    sort:
      searchParams.get(
        "sort"
      ) || "featured",
  });

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    view,
    setView,
  ] = useState("grid");

  const [
    isMobileFiltersOpen,
    setIsMobileFiltersOpen,
  ] = useState(false);

  const [
    quickViewProduct,
    setQuickViewProduct,
  ] = useState(null);

  // ===================================================
  // LOAD REAL DATABASE DATA
  // ===================================================

  useEffect(() => {
    let cancelled = false;

    const loadData =
      async () => {
        try {
          setIsLoading(true);
          setLoadError("");

          const [
            productData,
            categoryData,
          ] = await Promise.all([
            getProducts(),
            getCategories(),
          ]);

          if (
            cancelled
          ) {
            return;
          }

          setProducts(
            productData.products ||
              []
          );

          setCategories(
            categoryData.categories ||
              []
          );
        } catch (error) {
          if (
            cancelled
          ) {
            return;
          }

          console.error(
            "Shop data error:",
            error
          );

          setLoadError(
            error.message ||
              "Unable to load shop"
          );
        } finally {
          if (
            !cancelled
          ) {
            setIsLoading(
              false
            );
          }
        }
      };

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  // ===================================================
  // URL SYNC
  // ===================================================

  useEffect(() => {
    const params = {};

    if (
      debouncedSearch.trim()
    ) {
      params.search =
        debouncedSearch.trim();
    }

    if (
      filters.category !==
      "all"
    ) {
      params.category =
        filters.category;
    }

    if (
      filters.sort !==
      "featured"
    ) {
      params.sort =
        filters.sort;
    }

    setSearchParams(
      params,
      {
        replace: true,
      }
    );
  }, [
    debouncedSearch,
    filters.category,
    filters.sort,
    setSearchParams,
  ]);

  // ===================================================
  // HANDLE EXTERNAL URL CHANGES
  // ===================================================

  const [
    syncedParamsKey,
    setSyncedParamsKey,
  ] = useState(
    searchParams.toString()
  );

  const currentParamsKey =
    searchParams.toString();

  if (
    currentParamsKey !==
    syncedParamsKey
  ) {
    setSyncedParamsKey(
      currentParamsKey
    );

    setSearchInput(
      searchParams.get(
        "search"
      ) || ""
    );

    setFilters(
      (previous) => ({
        ...previous,
        category:
          searchParams.get(
            "category"
          ) || "all",
        sort:
          searchParams.get(
            "sort"
          ) || "featured",
      })
    );
  }

  // ===================================================
  // FILTER
  // ===================================================

  const activeFilters =
    useMemo(
      () => ({
        ...filters,
        search:
          debouncedSearch,
      }),
      [
        filters,
        debouncedSearch,
      ]
    );

  const visibleProducts =
    useMemo(
      () =>
        getFilteredAndSortedProducts(
          products,
          activeFilters,
          categories
        ),
      [
        products,
        activeFilters,
        categories,
      ]
    );

  const totalPages =
    getTotalPages(
      visibleProducts.length
    );

  const pageProducts =
    paginate(
      visibleProducts,
      page
    );

  // ===================================================
  // CATEGORY LABEL
  // ===================================================

  const activeCategoryLabel =
    filters.category !==
    "all"
      ? categories.find(
          (category) =>
            category.slug ===
            filters.category
        )?.title ||
        filters.category
      : null;

  // ===================================================
  // HANDLERS
  // ===================================================

  const handleSearchChange =
    (value) => {
      setSearchInput(
        value
      );
      setPage(1);
    };

  const handleFilterChange =
    (patch) => {
      setFilters(
        (previous) => ({
          ...previous,
          ...patch,
        })
      );

      setPage(1);
    };

  const handleClearAll =
    () => {
      setSearchInput("");

      setFilters({
        ...DEFAULT_FILTERS,
      });

      setPage(1);
    };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div>
      <ShopHeader
        activeCategoryLabel={
          activeCategoryLabel
        }
      />

      <Container className="section-y">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">

          {/* Desktop filters */}
          <aside className="hidden lg:col-span-1 lg:block">
            <div className="sticky top-24">
              <ShopFilters
                filters={filters}
                onChange={
                  handleFilterChange
                }
                onClear={
                  handleClearAll
                }
                categories={
                  categories
                }
              />
            </div>
          </aside>

          {/* Products */}
          <div className="lg:col-span-3">

            <ShopToolbar
              searchInput={
                searchInput
              }
              onSearchChange={
                handleSearchChange
              }
              sort={
                filters.sort
              }
              onSortChange={(
                sort
              ) =>
                handleFilterChange({
                  sort,
                })
              }
              view={view}
              onViewChange={
                setView
              }
              shownCount={
                pageProducts.length
              }
              totalCount={
                visibleProducts.length
              }
              onOpenMobileFilters={() =>
                setIsMobileFiltersOpen(
                  true
                )
              }
            />

            <div className="mt-6">

              {isLoading ? (
                <div className="py-16 text-center text-sm text-text/60">
                  Loading products...
                </div>
              ) : loadError ? (
                <div className="py-16 text-center text-sm text-red-600">
                  {loadError}
                </div>
              ) : pageProducts.length >
                0 ? (
                <>
                  <ProductGrid
                    products={
                      pageProducts
                    }
                    view={view}
                    onQuickView={
                      setQuickViewProduct
                    }
                  />

                  <Pagination
                    page={page}
                    totalPages={
                      totalPages
                    }
                    onPageChange={
                      setPage
                    }
                  />
                </>
              ) : (
                <EmptyProducts
                  onClearFilters={
                    handleClearAll
                  }
                />
              )}

            </div>
          </div>
        </div>
      </Container>

      <MobileFilterDrawer
        isOpen={
          isMobileFiltersOpen
        }
        onClose={() =>
          setIsMobileFiltersOpen(
            false
          )
        }
        filters={filters}
        onChange={
          handleFilterChange
        }
        onClear={
          handleClearAll
        }
        onApply={() =>
          setIsMobileFiltersOpen(
            false
          )
        }
        categories={
          categories
        }
      />

      <ProductQuickView
        product={
          quickViewProduct
        }
        onClose={() =>
          setQuickViewProduct(
            null
          )
        }
      />
    </div>
  );
};

export default Shop;