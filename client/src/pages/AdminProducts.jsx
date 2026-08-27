import { useEffect, useState } from "react";
import {
  FiEdit2,
  FiPlus,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import toast from "react-hot-toast";

import Container from "../components/ui/Container";

import {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
} from "../services/productService";

import { getCategories } from "../services/categoryService";
import { uploadImage } from "../services/uploadService";

const emptyProduct = {
  _id: "",
  name: "",
  category: "",
  description: "",
  price: "",
  originalPrice: "",
  discount: 0,
  rating: 0,
  reviewCount: 0,
  stock: "in-stock",
  badge: "",
  isFeatured: false,
  isBestSeller: false,
  isNew: false,
  image: "",
  images: "",
  sku: "",
  stockCount: 0,
  material: "",
  style: "",
  dimensions: "",
  frame: "",
  handmade: true,
  customizable: false,
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    ...emptyProduct,
  });

  const [isUploadingMainImage, setIsUploadingMainImage] =
    useState(false);

  const [isUploadingAdditionalImages, setIsUploadingAdditionalImages] =
    useState(false);

  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  const loadProducts = async () => {
    try {
      setIsLoading(true);

      const data = await getAdminProducts();

      setProducts(data.products || []);
    } catch (error) {
      console.error(
        "Load products error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Unable to load products"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =====================================================
  // LOAD CATEGORIES
  // =====================================================

  const loadCategories = async () => {
    try {
      const data = await getCategories();

      setCategories(data.categories || []);
    } catch (error) {
      console.error(
        "Load categories error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Unable to load categories"
      );
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    const loadInitialData = async () => {
      try {
        const [
          productsData,
          categoriesData,
        ] = await Promise.all([
          getAdminProducts(),
          getCategories(),
        ]);

        if (!cancelled) {
          setProducts(
            productsData.products || []
          );

          setCategories(
            categoriesData.categories || []
          );
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Load admin products data error:",
            error
          );

          toast.error(
            error?.response?.data?.message ||
              error.message ||
              "Unable to load products"
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadInitialData();

    return () => {
      cancelled = true;
    };
  }, []);

  // =====================================================
  // HANDLE FORM CHANGE
  // =====================================================

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // =====================================================
  // MAIN IMAGE UPLOAD
  // =====================================================

  const handleMainImageUpload = async (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setIsUploadingMainImage(true);

      const data =
        await uploadImage(file);

      if (
        !data?.success ||
        !data?.image?.url
      ) {
        throw new Error(
          data?.message ||
            "Image upload failed"
        );
      }

      setForm((current) => ({
        ...current,
        image: data.image.url,
      }));

      toast.success(
        "Main image uploaded successfully"
      );
    } catch (error) {
      console.error(
        "Main image upload error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Unable to upload main image"
      );
    } finally {
      setIsUploadingMainImage(false);
      event.target.value = "";
    }
  };

  // =====================================================
  // ADDITIONAL IMAGES UPLOAD
  // =====================================================

  const handleAdditionalImagesUpload =
    async (event) => {
      const files = Array.from(
        event.target.files || []
      );

      if (files.length === 0) {
        return;
      }

      try {
        setIsUploadingAdditionalImages(
          true
        );

        const uploadedUrls = [];

        for (const file of files) {
          const data =
            await uploadImage(file);

          if (
            !data?.success ||
            !data?.image?.url
          ) {
            throw new Error(
              data?.message ||
                `Failed to upload ${file.name}`
            );
          }

          uploadedUrls.push(
            data.image.url
          );
        }

        setForm((current) => {
          const existingImages =
            String(
              current.images || ""
            )
              .split("\n")
              .map((item) =>
                item.trim()
              )
              .filter(Boolean);

          return {
            ...current,
            images: [
              ...existingImages,
              ...uploadedUrls,
            ].join("\n"),
          };
        });

        toast.success(
          `${uploadedUrls.length} image${
            uploadedUrls.length > 1
              ? "s"
              : ""
          } uploaded successfully`
        );
      } catch (error) {
        console.error(
          "Additional images upload error:",
          error
        );

        toast.error(
          error?.response?.data?.message ||
            error.message ||
            "Unable to upload additional images"
        );
      } finally {
        setIsUploadingAdditionalImages(
          false
        );

        event.target.value = "";
      }
    };

  // =====================================================
  // MUTE / UNMUTE PRODUCT
  // =====================================================

  const handleToggleProductStatus =
    async (product) => {
      const nextStatus =
        product.isActive === false;

      try {
        const data =
          await updateProductStatus(
            product._id,
            nextStatus
          );

        if (!data?.success) {
          throw new Error(
            data?.message ||
              "Unable to update product status"
          );
        }

        setProducts((current) =>
          current.map((item) =>
            item._id === product._id
              ? {
                  ...item,
                  isActive:
                    nextStatus,
                }
              : item
          )
        );

        toast.success(
          nextStatus
            ? "Product activated successfully"
            : "Product muted successfully"
        );
      } catch (error) {
        console.error(
          "Update product status error:",
          error
        );

        toast.error(
          error?.response?.data?.message ||
            error.message ||
            "Unable to update product status"
        );
      }
    };

  // =====================================================
  // CREATE FORM
  // =====================================================

  const openCreateForm = () => {
    setEditingId(null);

    setForm({
      ...emptyProduct,
    });

    setShowForm(true);

    if (categories.length === 0) {
      loadCategories();
    }
  };

  // =====================================================
  // EDIT FORM
  // =====================================================

  const openEditForm = (product) => {
    setEditingId(product._id);

    setForm({
      _id: String(
        product._id ?? ""
      ),

      name: String(
        product.name ?? ""
      ),

      category: String(
        product.category ?? ""
      ),

      description: String(
        product.description ?? ""
      ),

      price:
        product.price ?? "",

      originalPrice:
        product.originalPrice ?? "",

      discount:
        product.discount ?? 0,

      rating:
        product.rating ?? 0,

      reviewCount:
        product.reviewCount ?? 0,

      stock:
        product.stock ||
        "in-stock",

      badge: String(
        product.badge ?? ""
      ),

      isFeatured: Boolean(
        product.isFeatured
      ),

      isBestSeller: Boolean(
        product.isBestSeller
      ),

      isNew: Boolean(
        product.isNew
      ),

      image: String(
        product.image ?? ""
      ),

      images:
        Array.isArray(
          product.images
        )
          ? product.images
              .map((item) =>
                String(
                  item ?? ""
                )
              )
              .filter(Boolean)
              .join("\n")
          : "",

      sku: String(
        product.sku ?? ""
      ),

      stockCount:
        product.stockCount ?? 0,

      material: String(
        product.material ?? ""
      ),

      style: String(
        product.style ?? ""
      ),

      dimensions: String(
        product.dimensions ?? ""
      ),

      frame: String(
        product.frame ?? ""
      ),

      handmade:
        product.handmade !== false,

      customizable: Boolean(
        product.customizable
      ),
    });

    setShowForm(true);

    if (categories.length === 0) {
      loadCategories();
    }
  };

  // =====================================================
  // CLOSE FORM
  // =====================================================

  const closeForm = () => {
    if (isSaving) {
      return;
    }

    setShowForm(false);
    setEditingId(null);

    setForm({
      ...emptyProduct,
    });
  };

  // =====================================================
  // PREPARE PAYLOAD
  // =====================================================

  const preparePayload = () => {
    return {
      _id: String(
        form._id ?? ""
      ).trim(),

      name: String(
        form.name ?? ""
      ).trim(),

      category: String(
        form.category ?? ""
      ).trim(),

      description: String(
        form.description ?? ""
      ).trim(),

      price: Number(
        form.price
      ),

      originalPrice:
        form.originalPrice === "" ||
        form.originalPrice === null ||
        form.originalPrice === undefined
          ? null
          : Number(
              form.originalPrice
            ),

      discount: Number(
        form.discount ?? 0
      ),

      rating: Number(
        form.rating ?? 0
      ),

      reviewCount: Number(
        form.reviewCount ?? 0
      ),

      stock:
        form.stock ||
        "in-stock",

      badge: String(
        form.badge ?? ""
      ).trim(),

      isFeatured: Boolean(
        form.isFeatured
      ),

      isBestSeller: Boolean(
        form.isBestSeller
      ),

      isNew: Boolean(
        form.isNew
      ),

      image: String(
        form.image ?? ""
      ).trim(),

      images: String(
        form.images ?? ""
      )
        .split("\n")
        .map((item) =>
          item.trim()
        )
        .filter(Boolean),

      sku: String(
        form.sku ?? ""
      ).trim(),

      stockCount: Number(
        form.stockCount ?? 0
      ),

      material: String(
        form.material ?? ""
      ).trim(),

      style: String(
        form.style ?? ""
      ).trim(),

      dimensions: String(
        form.dimensions ?? ""
      ).trim(),

      frame:
        String(
          form.frame ?? ""
        ).trim() || null,

      handmade: Boolean(
        form.handmade
      ),

      customizable: Boolean(
        form.customizable
      ),
    };
  };

  // =====================================================
  // SAVE PRODUCT
  // =====================================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (
      !String(
        form._id ?? ""
      ).trim() ||
      !String(
        form.name ?? ""
      ).trim() ||
      !String(
        form.category ?? ""
      ).trim() ||
      !String(
        form.description ?? ""
      ).trim() ||
      !String(
        form.sku ?? ""
      ).trim()
    ) {
      toast.error(
        "Please fill all required fields."
      );

      return;
    }

    try {
      setIsSaving(true);

      const payload =
        preparePayload();

      if (editingId) {
        await updateProduct(
          editingId,
          payload
        );

        toast.success(
          "Product updated successfully!"
        );
      } else {
        await createProduct(
          payload
        );

        toast.success(
          "Product created successfully!"
        );
      }

      setShowForm(false);
      setEditingId(null);

      setForm({
        ...emptyProduct,
      });

      await loadProducts();
    } catch (error) {
      console.error(
        "Save product error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Unable to save product"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const handleDelete = async (
    id
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(id);

      toast.success(
        "Product deleted successfully!"
      );

      await loadProducts();
    } catch (error) {
      console.error(
        "Delete product error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Unable to delete product"
      );
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="py-10 sm:py-14">
      <Container>

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary-dark">
              Administration
            </p>

            <h1 className="mt-2 font-heading text-3xl font-bold text-primary">
              Products
            </h1>

            <p className="mt-2 text-sm text-text/60">
              Manage your artwork catalog.
            </p>
          </div>

          <button
            type="button"
            onClick={
              openCreateForm
            }
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-background transition hover:bg-primary-light"
          >
            <FiPlus size={17} />
            Add Product
          </button>
        </div>

        {/* Product Form */}
        {showForm && (
          <section className="mb-8 rounded-3xl border border-primary/10 bg-white p-6 shadow-sm sm:p-8">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-heading text-xl font-semibold text-primary">
                  {editingId
                    ? "Edit Product"
                    : "Add Product"}
                </h2>

                <p className="mt-1 text-sm text-text/55">
                  Fields marked with * are required.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeForm
                }
                disabled={
                  isSaving
                }
                className="grid h-10 w-10 place-items-center rounded-full text-text/60 transition hover:bg-primary/10 hover:text-primary"
                aria-label="Close form"
              >
                <FiX size={20} />
              </button>
            </div>

            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-6"
            >

              {/* Basic Information */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* Product ID */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text">
                    Product ID *
                  </label>

                  <input
                    name="_id"
                    value={
                      form._id
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      Boolean(
                        editingId
                      )
                    }
                    className="w-full rounded-lg border border-primary/20 px-4 py-2.5 text-sm outline-none focus:border-primary disabled:bg-gray-100"
                  />

                  {editingId && (
                    <p className="mt-1 text-xs text-text/50">
                      Product ID cannot be changed while editing.
                    </p>
                  )}
                </div>

                {/* SKU */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text">
                    SKU *
                  </label>

                  <input
                    name="sku"
                    value={
                      form.sku
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full rounded-lg border border-primary/20 px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>

                {/* Product Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text">
                    Product Name *
                  </label>

                  <input
                    name="name"
                    value={
                      form.name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter product name"
                    className="w-full rounded-lg border border-primary/20 px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text">
                    Category *
                  </label>

                  <select
                    name="category"
                    value={
                      form.category
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full rounded-lg border border-primary/20 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
                  >
                    <option value="">
                      Select category
                    </option>

                    {categories
                      .filter(
                        (category) =>
                          category.isActive !==
                          false
                      )
                      .map(
                        (category) => (
                          <option
                            key={
                              category._id
                            }
                            value={
                              category.slug
                            }
                          >
                            {
                              category.name ||
                              category.title
                            }
                          </option>
                        )
                      )}
                  </select>

                  {categories.length ===
                    0 && (
                    <p className="mt-1 text-xs text-text/50">
                      No categories available.
                    </p>
                  )}

                  <p className="mt-1 text-xs text-text/50">
                    Select one category for this product.
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text">
                  Description *
                </label>

                <textarea
                  name="description"
                  value={
                    form.description
                  }
                  onChange={
                    handleChange
                  }
                  rows={4}
                  className="w-full rounded-lg border border-primary/20 px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text">
                    Price *
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="price"
                    value={
                      form.price
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full rounded-lg border border-primary/20 px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text">
                    Original Price
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="originalPrice"
                    value={
                      form.originalPrice
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full rounded-lg border border-primary/20 px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text">
                    Discount %
                  </label>

                  <input
                    type="number"
                    min="0"
                    max="100"
                    name="discount"
                    value={
                      form.discount
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full rounded-lg border border-primary/20 px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Stock */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text">
                    Stock Status
                  </label>

                  <select
                    name="stock"
                    value={
                      form.stock
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full rounded-lg border border-primary/20 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
                  >
                    <option value="in-stock">
                      In Stock
                    </option>

                    <option value="low-stock">
                      Low Stock
                    </option>

                    <option value="out-of-stock">
                      Out of Stock
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text">
                    Stock Count
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="stockCount"
                    value={
                      form.stockCount
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full rounded-lg border border-primary/20 px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Images */}
              <div className="space-y-6">

                {/* Main Image */}
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label className="block text-sm font-medium text-text">
                      Main Product Image
                    </label>
                    <span className="text-xs text-text/45">
                      JPG, PNG or WEBP • Max 10 MB
                    </span>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-primary/15 bg-background">
                    {form.image ? (
                      <div>
                        <div className="aspect-[16/9] w-full overflow-hidden bg-primary/5">
                          <img
                            src={form.image}
                            alt="Main product preview"
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-primary/10 bg-white p-4">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-primary">
                              Main image ready
                            </p>
                            <p className="mt-0.5 max-w-xl truncate text-xs text-text/45">
                              {form.image}
                            </p>
                          </div>

                          <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-primary/20 px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary/5">
                            {isUploadingMainImage ? "Uploading..." : "Replace Image"}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleMainImageUpload}
                              disabled={isUploadingMainImage || isSaving}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label className="flex min-h-56 cursor-pointer flex-col items-center justify-center px-6 py-8 text-center transition hover:bg-primary/5">
                        <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                          <FiPlus size={20} />
                        </div>
                        <p className="text-sm font-semibold text-primary">
                          {isUploadingMainImage ? "Uploading image..." : "Upload main product image"}
                        </p>
                        <p className="mt-1 text-xs text-text/50">
                          Click to choose the primary artwork image
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleMainImageUpload}
                          disabled={isUploadingMainImage || isSaving}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {isUploadingMainImage && (
                    <div className="mt-3 flex items-center gap-2 rounded-xl bg-primary/5 px-4 py-3 text-xs font-medium text-primary">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-current" />
                      Uploading main image to Cloudinary...
                    </div>
                  )}

                  <div className="mt-3">
                    <label className="mb-1.5 block text-xs font-medium text-text/60">
                      Or use an existing image URL
                    </label>
                    <input
                      name="image"
                      value={form.image}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="w-full rounded-lg border border-primary/20 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-primary"
                    />
                  </div>
                </div>

                {/* Additional Images */}
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label className="block text-sm font-medium text-text">
                      Additional Product Images
                    </label>
                    <span className="text-xs text-text/45">
                      Multiple images supported
                    </span>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-primary/15 bg-background p-4">
                    <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-primary/20 bg-white px-6 py-6 text-center transition hover:border-primary/40 hover:bg-primary/5">
                      <div className="mb-2 grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
                        <FiPlus size={18} />
                      </div>
                      <p className="text-sm font-semibold text-primary">
                        {isUploadingAdditionalImages
                          ? "Uploading images..."
                          : "Add product images"}
                      </p>
                      <p className="mt-1 text-xs text-text/50">
                        Select multiple artwork photos at once
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleAdditionalImagesUpload}
                        disabled={isUploadingAdditionalImages || isSaving}
                        className="hidden"
                      />
                    </label>

                    {isUploadingAdditionalImages && (
                      <div className="mt-3 flex items-center gap-2 rounded-xl bg-primary/5 px-4 py-3 text-xs font-medium text-primary">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-current" />
                        Uploading additional images to Cloudinary...
                      </div>
                    )}

                    {String(form.images || "").trim() && (
                      <div className="mt-5">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-text/60">
                            Image previews
                          </p>
                          <span className="text-xs text-text/40">
                            {String(form.images || "")
                              .split("\n")
                              .filter((url) => url.trim()).length}{" "}
                            image(s)
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                          {String(form.images || "")
                            .split("\n")
                            .map((url) => url.trim())
                            .filter(Boolean)
                            .map((url, index) => (
                              <div
                                key={`${url}-${index}`}
                                className="group overflow-hidden rounded-xl border border-primary/10 bg-white"
                              >
                                <div className="aspect-square overflow-hidden bg-primary/5">
                                  <img
                                    src={url}
                                    alt={`Additional product ${index + 1}`}
                                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                  />
                                </div>
                                <div className="border-t border-primary/10 px-2.5 py-2">
                                  <p className="truncate text-[11px] text-text/50">
                                    Image {index + 1}
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-5">
                      <label className="mb-1.5 block text-xs font-medium text-text/60">
                        Or use existing image URLs
                      </label>
                      <textarea
                        name="images"
                        value={form.images}
                        onChange={handleChange}
                        rows={3}
                        placeholder="One URL per line"
                        className="w-full rounded-lg border border-primary/20 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text">
                    Material
                  </label>

                  <input
                    name="material"
                    value={
                      form.material
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full rounded-lg border border-primary/20 px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text">
                    Style
                  </label>

                  <input
                    name="style"
                    value={
                      form.style
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full rounded-lg border border-primary/20 px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text">
                    Dimensions
                  </label>

                  <input
                    name="dimensions"
                    value={
                      form.dimensions
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full rounded-lg border border-primary/20 px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text">
                    Frame
                  </label>

                  <input
                    name="frame"
                    value={
                      form.frame
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full rounded-lg border border-primary/20 px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Badge */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text">
                  Badge
                </label>

                <input
                  name="badge"
                  value={
                    form.badge
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Best Seller"
                  className="w-full rounded-lg border border-primary/20 px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>

              {/* Flags */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

                <label className="flex items-center gap-2 text-sm text-text">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={
                      form.isFeatured
                    }
                    onChange={
                      handleChange
                    }
                  />
                  Featured
                </label>

                <label className="flex items-center gap-2 text-sm text-text">
                  <input
                    type="checkbox"
                    name="isBestSeller"
                    checked={
                      form.isBestSeller
                    }
                    onChange={
                      handleChange
                    }
                  />
                  Best Seller
                </label>

                <label className="flex items-center gap-2 text-sm text-text">
                  <input
                    type="checkbox"
                    name="isNew"
                    checked={
                      form.isNew
                    }
                    onChange={
                      handleChange
                    }
                  />
                  New Arrival
                </label>

                <label className="flex items-center gap-2 text-sm text-text">
                  <input
                    type="checkbox"
                    name="customizable"
                    checked={
                      form.customizable
                    }
                    onChange={
                      handleChange
                    }
                  />
                  Customizable
                </label>
              </div>

              <label className="flex items-center gap-2 text-sm text-text">
                <input
                  type="checkbox"
                  name="handmade"
                  checked={
                    form.handmade
                  }
                  onChange={
                    handleChange
                  }
                />
                Handmade
              </label>

              {/* Buttons */}
              <div className="flex flex-col gap-3 border-t border-primary/10 pt-6 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={
                    closeForm
                  }
                  disabled={
                    isSaving
                  }
                  className="rounded-full border border-primary/20 px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary/5"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    isSaving
                  }
                  className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-background transition hover:bg-primary-light disabled:opacity-60"
                >
                  {isSaving
                    ? "Saving..."
                    : editingId
                      ? "Update Product"
                      : "Create Product"}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Product Catalog */}
        <section className="rounded-3xl border border-primary/10 bg-white shadow-sm">

          <div className="border-b border-primary/10 p-6">
            <h2 className="font-heading text-xl font-semibold text-primary">
              Product Catalog
            </h2>

            <p className="mt-1 text-sm text-text/55">
              {products.length} products
            </p>
          </div>

          {isLoading ? (
            <div className="p-10 text-center text-sm text-text/55">
              Loading products...
            </div>
          ) : products.length ===
            0 ? (
            <div className="p-10 text-center text-sm text-text/55">
              No products found.
            </div>
          ) : (
            <div className="divide-y divide-primary/10">

              {products.map(
                (product) => (
                  <div
                    key={
                      product._id
                    }
                    className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between"
                  >

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="font-semibold text-primary">
                          {
                            product.name
                          }
                        </h3>

                        {product.badge && (
                          <span className="rounded-full bg-secondary/20 px-2.5 py-1 text-[10px] font-bold uppercase text-primary">
                            {
                              product.badge
                            }
                          </span>
                        )}

                        {product.isActive ===
                        false ? (
                          <span className="rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-bold uppercase text-red-700">
                            Muted
                          </span>
                        ) : (
                          <span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-bold uppercase text-green-700">
                            Active
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-xs text-text/50">
                        ID:{" "}
                        {
                          product._id
                        }
                      </p>

                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-text/60">

                        <span>
                          Category:{" "}
                          {
                            product.category
                          }
                        </span>

                        <span>
                          Price: ₹
                          {Number(
                            product.price ||
                              0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </span>

                        <span>
                          Stock:{" "}
                          {
                            product.stock
                          }
                        </span>

                        <span>
                          Qty:{" "}
                          {
                            product.stockCount
                          }
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2">

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(
                            product
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/5"
                      >
                        <FiEdit2
                          size={15}
                        />
                        Edit
                      </button>

                      {/* Mute / Unmute */}
                      <button
                        type="button"
                        onClick={() =>
                          handleToggleProductStatus(
                            product
                          )
                        }
                        className={
                          product.isActive ===
                          false
                            ? "inline-flex items-center gap-2 rounded-full border border-green-200 px-4 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-50"
                            : "inline-flex items-center gap-2 rounded-full border border-amber-200 px-4 py-2.5 text-sm font-semibold text-amber-700 transition hover:bg-amber-50"
                        }
                      >
                        {product.isActive ===
                        false
                          ? "Unmute"
                          : "Mute"}
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            product._id
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        <FiTrash2
                          size={15}
                        />
                        Delete
                      </button>

                    </div>
                  </div>
                )
              )}

            </div>
          )}
        </section>

      </Container>
    </div>
  );
};

export default AdminProducts;