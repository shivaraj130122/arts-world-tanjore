export const PAGE_SIZE = 8;

export const PRICE_RANGES = [
  {
    id: "all",
    label: "All Prices",
    min: 0,
    max: Infinity,
  },
  {
    id: "under-2000",
    label: "Under ₹2,000",
    min: 0,
    max: 2000,
  },
  {
    id: "2000-5000",
    label: "₹2,000 – ₹5,000",
    min: 2000,
    max: 5000,
  },
  {
    id: "5000-10000",
    label: "₹5,000 – ₹10,000",
    min: 5000,
    max: 10000,
  },
  {
    id: "10000-20000",
    label: "₹10,000 – ₹20,000",
    min: 10000,
    max: 20000,
  },
  {
    id: "above-20000",
    label: "Above ₹20,000",
    min: 20000,
    max: Infinity,
  },
];

export const SORT_OPTIONS = [
  {
    id: "featured",
    label: "Featured",
  },
  {
    id: "newest",
    label: "Newest",
  },
  {
    id: "price-low",
    label: "Price: Low to High",
  },
  {
    id: "price-high",
    label: "Price: High to Low",
  },
  {
    id: "rating",
    label: "Rating: High to Low",
  },
  {
    id: "name-asc",
    label: "Name: A-Z",
  },
  {
    id: "name-desc",
    label: "Name: Z-A",
  },
];

export const AVAILABILITY_OPTIONS = [
  {
    id: "all",
    label: "All",
  },
  {
    id: "in-stock",
    label: "In Stock",
  },
  {
    id: "out-of-stock",
    label: "Out of Stock",
  },
];

export const DEFAULT_FILTERS = {
  search: "",
  category: "all",
  priceRange: "all",
  availability: "all",
  sort: "featured",
};

const matchesSearch = (
  product,
  rawQuery
) => {
  const query =
    String(rawQuery || "")
      .trim()
      .toLowerCase();

  if (!query) {
    return true;
  }

  const haystack =
    `${product.name || ""} ${
      product.category || ""
    } ${
      product.description || ""
    }`.toLowerCase();

  return haystack.includes(query);
};

const matchesCategory = (
  product,
  categorySlug,
  categories = []
) => {
  if (
    !categorySlug ||
    categorySlug === "all"
  ) {
    return true;
  }

  const productCategory =
    String(
      product.category || ""
    )
      .trim()
      .toLowerCase();

  const category =
    categories.find(
      (item) =>
        String(
          item.slug || ""
        ).toLowerCase() ===
        String(
          categorySlug
        ).toLowerCase()
    );

  if (!category) {
    return (
      productCategory ===
      String(
        categorySlug
      ).toLowerCase()
    );
  }

  const slug =
    String(
      category.slug || ""
    ).toLowerCase();

  const title =
    String(
      category.title || ""
    ).trim().toLowerCase();

  // Supports both new slug data
  // and old title data.
  return (
    productCategory === slug ||
    productCategory === title
  );
};

const matchesPriceRange = (
  product,
  rangeId
) => {
  const range =
    PRICE_RANGES.find(
      (item) =>
        item.id === rangeId
    );

  if (
    !range ||
    range.id === "all"
  ) {
    return true;
  }

  const price =
    Number(product.price || 0);

  return (
    price >= range.min &&
    price < range.max
  );
};

const matchesAvailability = (
  product,
  availability
) => {
  if (
    !availability ||
    availability === "all"
  ) {
    return true;
  }

  if (
    availability ===
    "in-stock"
  ) {
    return (
      product.stock !==
      "out-of-stock"
    );
  }

  if (
    availability ===
    "out-of-stock"
  ) {
    return (
      product.stock ===
      "out-of-stock"
    );
  }

  return true;
};

export const filterProducts = (
  products,
  filters,
  categories = []
) => {
  const {
    search = "",
    category = "all",
    priceRange = "all",
    availability = "all",
  } = filters;

  return products.filter(
    (product) =>
      matchesSearch(
        product,
        search
      ) &&
      matchesCategory(
        product,
        category,
        categories
      ) &&
      matchesPriceRange(
        product,
        priceRange
      ) &&
      matchesAvailability(
        product,
        availability
      )
  );
};

export const sortProducts = (
  products,
  sortId
) => {
  const list = [
    ...products,
  ];

  switch (sortId) {
    case "newest":
      return list.sort(
        (a, b) =>
          new Date(
            b.createdAt || 0
          ) -
          new Date(
            a.createdAt || 0
          )
      );

    case "price-low":
      return list.sort(
        (a, b) =>
          Number(a.price || 0) -
          Number(b.price || 0)
      );

    case "price-high":
      return list.sort(
        (a, b) =>
          Number(b.price || 0) -
          Number(a.price || 0)
      );

    case "rating":
      return list.sort(
        (a, b) =>
          Number(b.rating || 0) -
          Number(a.rating || 0)
      );

    case "name-asc":
      return list.sort(
        (a, b) =>
          String(a.name || "")
            .localeCompare(
              String(
                b.name || ""
              )
            )
      );

    case "name-desc":
      return list.sort(
        (a, b) =>
          String(b.name || "")
            .localeCompare(
              String(
                a.name || ""
              )
            )
      );

    case "featured":
    default:
      return list.sort(
        (a, b) =>
          Number(
            b.isFeatured
          ) -
          Number(
            a.isFeatured
          )
      );
  }
};

export const getFilteredAndSortedProducts =
  (
    products,
    filters,
    categories = []
  ) => {
    const filtered =
      filterProducts(
        products,
        filters,
        categories
      );

    return sortProducts(
      filtered,
      filters.sort
    );
  };

export const paginate = (
  items,
  page,
  pageSize = PAGE_SIZE
) => {
  const start =
    (page - 1) *
    pageSize;

  return items.slice(
    start,
    start + pageSize
  );
};

export const getTotalPages = (
  itemCount,
  pageSize = PAGE_SIZE
) =>
  Math.max(
    1,
    Math.ceil(
      itemCount / pageSize
    )
  );