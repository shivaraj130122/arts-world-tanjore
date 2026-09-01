import { useEffect, useState } from "react";

import {
  FiEdit2,
  FiPlus,
  FiTrash2,
  FiX,
  FiVolume2,
  FiVolumeX,
} from "react-icons/fi";

import toast from "react-hot-toast";

import Container from "../components/ui/Container";

import {
  getAllCategoriesAdmin,
  createCategory,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
} from "../services/categoryService";

import { uploadImage } from "../services/uploadService";

const emptyCategory = {
  _id: "",
  title: "",
  description: "",
  slug: "",
  image: "",
  isActive: true,
};

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const [isUploadingImage, setIsUploadingImage] =
    useState(false);

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    ...emptyCategory,
  });

  useEffect(() => {
    let cancelled = false;

    const loadInitialCategories = async () => {
      try {
        setIsLoading(true);

        const data = await getAllCategoriesAdmin();
        if (!cancelled) {
          setCategories(data.categories || []);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Load categories error:",
            error
          );

          toast.error(
            error?.message ||
              "Unable to load categories"
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadInitialCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);

      const data = await getAllCategoriesAdmin();

      setCategories(data.categories || []);
    } catch (error) {
      console.error(
        "Load categories error:",
        error
      );

      toast.error(
        error?.message ||
          "Unable to load categories"
      );
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setIsUploadingImage(true);

      const data = await uploadImage(file);

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
        "Category image uploaded successfully"
      );
    } catch (error) {
      console.error(
        "Category image upload error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to upload category image"
      );
    } finally {
      setIsUploadingImage(false);
      event.target.value = "";
    }
  };

  const handleToggleCategoryStatus = async (
    category
  ) => {
    const nextStatus =
      category.isActive === false;

    try {
      const data =
        await updateCategoryStatus(
          category._id,
          nextStatus
        );

      if (!data?.success) {
        throw new Error(
          data?.message ||
            "Unable to update category status"
        );
      }

      setCategories((current) =>
        current.map((item) =>
          item._id === category._id
            ? {
                ...item,
                isActive: nextStatus,
              }
            : item
        )
      );

      toast.success(
        nextStatus
          ? "Category activated successfully"
          : "Category muted successfully"
      );
    } catch (error) {
      console.error(
        "Update category status error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to update category status"
      );
    }
  };

  const openCreateForm = () => {
    setEditingId(null);

    setForm({
      ...emptyCategory,
    });

    setShowForm(true);
  };

  const openEditForm = (category) => {
    setEditingId(category._id);

    setForm({
      _id: String(
        category._id ?? ""
      ),

      title: String(
        category.title ?? ""
      ),

      description: String(
        category.description ?? ""
      ),

      slug: String(
        category.slug ?? ""
      ),

      image: String(
        category.image ?? ""
      ),

      isActive:
        category.isActive !== false,
    });

    setShowForm(true);
  };

  const closeForm = () => {
    if (
      isSaving ||
      isUploadingImage
    ) {
      return;
    }

    setShowForm(false);

    setEditingId(null);

    setForm({
      ...emptyCategory,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !String(
        form._id ?? ""
      ).trim() ||
      !String(
        form.title ?? ""
      ).trim() ||
      !String(
        form.description ?? ""
      ).trim() ||
      !String(
        form.slug ?? ""
      ).trim()
    ) {
      toast.error(
        "Please fill all required fields."
      );

      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        _id: String(
          form._id ?? ""
        ).trim(),

        title: String(
          form.title ?? ""
        ).trim(),

        description: String(
          form.description ?? ""
        ).trim(),

        slug: String(
          form.slug ?? ""
        )
          .trim()
          .toLowerCase(),

        image: String(
          form.image ?? ""
        ).trim(),

        isActive: Boolean(
          form.isActive
        ),
      };

      if (editingId) {
        await updateCategory(
          editingId,
          payload
        );

        toast.success(
          "Category updated successfully!"
        );
      } else {
        await createCategory(payload);

        toast.success(
          "Category created successfully!"
        );
      }

      closeForm();

      await loadCategories();
    } catch (error) {
      console.error(
        "Save category error:",
        error
      );

      toast.error(
        error?.message ||
          "Unable to save category"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this category?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteCategory(id);

      toast.success(
        "Category deleted successfully!"
      );

      await loadCategories();
    } catch (error) {
      console.error(
        "Delete category error:",
        error
      );

      toast.error(
        error?.message ||
          "Unable to delete category"
      );
    }
  };

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
              Categories
            </h1>

            <p className="mt-2 text-sm text-text/60">
              Manage artwork categories.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-background transition hover:bg-primary-light"
          >
            <FiPlus size={17} />
            Add Category
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <section className="mb-8 rounded-3xl border border-primary/10 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-heading text-xl font-semibold text-primary">
                  {editingId
                    ? "Edit Category"
                    : "Add Category"}
                </h2>

                <p className="mt-1 text-sm text-text/55">
                  Fields marked with * are required.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={
                  isSaving ||
                  isUploadingImage
                }
                className="grid h-10 w-10 place-items-center rounded-full text-text/60 transition hover:bg-primary/10 hover:text-primary disabled:opacity-50"
                aria-label="Close form"
              >
                <FiX size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* Category ID */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text">
                    Category ID *
                  </label>

                  <input
                    name="_id"
                    value={form._id}
                    onChange={handleChange}
                    disabled={Boolean(
                      editingId
                    )}
                    placeholder="tanjore-paintings"
                    className="w-full rounded-lg border border-primary/20 px-4 py-2.5 text-sm outline-none focus:border-primary disabled:bg-gray-100"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text">
                    Slug *
                  </label>

                  <input
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="tanjore-paintings"
                    className="w-full rounded-lg border border-primary/20 px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text">
                    Title *
                  </label>

                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Tanjore Paintings"
                    className="w-full rounded-lg border border-primary/20 px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>

                {/* Item Count - calculated automatically */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text">
                    Item Count
                  </label>

                  <div className="flex min-h-[42px] items-center rounded-lg border border-primary/10 bg-gray-50 px-4 py-2.5 text-sm text-text/60">
                    {editingId
                      ? `${categories.find((item) => item._id === editingId)?.itemCount ?? 0} active products`
                      : "Calculated automatically after products are added"}
                  </div>

                  <p className="mt-1.5 text-xs text-text/45">
                    Automatically calculated from active products in this category.
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
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-lg border border-primary/20 px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>

              {/* Category Image */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="block text-sm font-medium text-text">
                    Category Image
                  </label>
                  <span className="text-xs text-text/45">
                    JPG, PNG or WEBP
                  </span>
                </div>

                <div className="overflow-hidden rounded-2xl border border-primary/15 bg-background">
                  {form.image ? (
                    <div className="relative">
                      <div className="aspect-[16/7] w-full overflow-hidden bg-primary/5">
                        <img
                          src={form.image}
                          alt="Category preview"
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-primary/10 bg-white p-4">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-primary">
                            Image ready
                          </p>
                          <p className="mt-0.5 max-w-xl truncate text-xs text-text/45">
                            {form.image}
                          </p>
                        </div>

                        <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-primary/20 px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary/5">
                          {isUploadingImage ? "Uploading..." : "Replace Image"}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={isUploadingImage || isSaving}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center px-6 py-8 text-center transition hover:bg-primary/5">
                      <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                        <FiPlus size={20} />
                      </div>
                      <p className="text-sm font-semibold text-primary">
                        {isUploadingImage ? "Uploading image..." : "Upload category image"}
                      </p>
                      <p className="mt-1 text-xs text-text/50">
                        Click to choose an image from your computer
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploadingImage || isSaving}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {isUploadingImage && (
                  <div className="mt-3 flex items-center gap-2 rounded-xl bg-primary/5 px-4 py-3 text-xs font-medium text-primary">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-current" />
                    Uploading image to Cloudinary...
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

              {/* Active */}
              <label className="flex items-center gap-2 text-sm text-text">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                />

                Active Category
              </label>

              {/* Buttons */}
              <div className="flex flex-col gap-3 border-t border-primary/10 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={
                    isSaving ||
                    isUploadingImage
                  }
                  className="rounded-full border border-primary/20 px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary/5 disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    isSaving ||
                    isUploadingImage
                  }
                  className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-background transition hover:bg-primary-light disabled:opacity-60"
                >
                  {isSaving
                    ? "Saving..."
                    : editingId
                      ? "Update Category"
                      : "Create Category"}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Categories */}
        <section className="rounded-3xl border border-primary/10 bg-white shadow-sm">
          <div className="border-b border-primary/10 p-6">
            <h2 className="font-heading text-xl font-semibold text-primary">
              Category List
            </h2>

            <p className="mt-1 text-sm text-text/55">
              {categories.length} categories
            </p>
          </div>

          {isLoading ? (
            <div className="p-10 text-center text-sm text-text/55">
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="p-10 text-center text-sm text-text/55">
              No categories found.
            </div>
          ) : (
            <div className="divide-y divide-primary/10">
              {categories.map(
                (category) => (
                  <div
                    key={category._id}
                    className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-primary">
                          {category.title}
                        </h3>

                        {/* Status */}
                        {category.isActive === false ? (
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
                        ID: {category._id}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-text/60">
                        <span>
                          Slug: {category.slug}
                        </span>

                        <span>
                          Items: {category.itemCount}
                        </span>
                      </div>

                      <p className="mt-2 max-w-2xl text-sm text-text/60">
                        {category.description}
                      </p>

                      {category.image && (
                        <div className="mt-4">
                          <img
                            src={category.image}
                            alt={category.title}
                            className="h-24 w-36 rounded-xl object-cover"
                          />
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 flex-wrap gap-2">

                      {/* Mute / Unmute */}
                      <button
                        type="button"
                        onClick={() =>
                          handleToggleCategoryStatus(
                            category
                          )
                        }
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                          category.isActive === false
                            ? "border-green-200 text-green-700 hover:bg-green-50"
                            : "border-orange-200 text-orange-600 hover:bg-orange-50"
                        }`}
                      >
                        {category.isActive === false ? (
                          <>
                            <FiVolume2 size={15} />
                            Unmute
                          </>
                        ) : (
                          <>
                            <FiVolumeX size={15} />
                            Mute
                          </>
                        )}
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(
                            category
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/5"
                      >
                        <FiEdit2 size={15} />
                        Edit
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            category._id
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        <FiTrash2 size={15} />
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

export default AdminCategories;