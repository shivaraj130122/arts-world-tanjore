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
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";

const emptyCategory = {
  _id: "",
  title: "",
  description: "",
  slug: "",
  itemCount: 0,
  image: "",
  isActive: true,
};

const AdminCategories = () => {
  const [categories, setCategories] =
    useState([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [form, setForm] =
    useState({
      ...emptyCategory,
    });

  useEffect(() => {
    let cancelled = false;

    const loadInitialCategories =
      async () => {
        try {
          const data =
            await getCategories();

          if (!cancelled) {
            setCategories(
              data.categories || []
            );
          }
        } catch (error) {
          if (!cancelled) {
            console.error(
              "Load categories error:",
              error
            );

            toast.error(
              error.message ||
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

  const loadCategories =
    async () => {
      try {
        setIsLoading(true);

        const data =
          await getCategories();

        setCategories(
          data.categories || []
        );
      } catch (error) {
        console.error(
          "Load categories error:",
          error
        );

        toast.error(
          error.message ||
            "Unable to load categories"
        );
      } finally {
        setIsLoading(false);
      }
    };

  const handleChange = (
    event
  ) => {
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

  const openCreateForm =
    () => {
      setEditingId(null);

      setForm({
        ...emptyCategory,
      });

      setShowForm(true);
    };

  const openEditForm =
    (category) => {
      setEditingId(
        category._id
      );

      setForm({
        _id: String(
          category._id ?? ""
        ),
        title: String(
          category.title ?? ""
        ),
        description: String(
          category.description ??
            ""
        ),
        slug: String(
          category.slug ?? ""
        ),
        itemCount:
          category.itemCount ??
          0,
        image: String(
          category.image ?? ""
        ),
        isActive:
          category.isActive !==
          false,
      });

      setShowForm(true);
    };

  const closeForm = () => {
    if (isSaving) return;

    setShowForm(false);
    setEditingId(null);

    setForm({
      ...emptyCategory,
    });
  };

  const handleSubmit = async (
    event
  ) => {
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

        description:
          String(
            form.description ??
              ""
          ).trim(),

        slug: String(
          form.slug ?? ""
        )
          .trim()
          .toLowerCase(),

        itemCount: Number(
          form.itemCount ?? 0
        ),

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
        await createCategory(
          payload
        );

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
        error.message ||
          "Unable to save category"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (
    id
  ) => {
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
        error.message ||
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
            onClick={
              openCreateForm
            }
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
                  Fields marked with *
                  are required.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeForm
                }
                disabled={isSaving}
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
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text">
                    Category ID *
                  </label>

                  <input
                    name="_id"
                    value={form._id}
                    onChange={
                      handleChange
                    }
                    disabled={
                      Boolean(
                        editingId
                      )
                    }
                    placeholder="tanjore-paintings"
                    className="w-full rounded-lg border border-primary/20 px-4 py-2.5 text-sm outline-none focus:border-primary disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text">
                    Slug *
                  </label>

                  <input
                    name="slug"
                    value={
                      form.slug
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="tanjore-paintings"
                    className="w-full rounded-lg border border-primary/20 px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text">
                    Title *
                  </label>

                  <input
                    name="title"
                    value={
                      form.title
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Tanjore Paintings"
                    className="w-full rounded-lg border border-primary/20 px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text">
                    Item Count
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="itemCount"
                    value={
                      form.itemCount
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full rounded-lg border border-primary/20 px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

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

              <div>
                <label className="mb-1.5 block text-sm font-medium text-text">
                  Image URL
                </label>

                <input
                  name="image"
                  value={
                    form.image
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="https://..."
                  className="w-full rounded-lg border border-primary/20 px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-text">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={
                    form.isActive
                  }
                  onChange={
                    handleChange
                  }
                />

                Active Category
              </label>

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
              {categories.length}{" "}
              categories
            </p>
          </div>

          {isLoading ? (
            <div className="p-10 text-center text-sm text-text/55">
              Loading categories...
            </div>
          ) : categories.length ===
            0 ? (
            <div className="p-10 text-center text-sm text-text/55">
              No categories
              found.
            </div>
          ) : (
            <div className="divide-y divide-primary/10">
              {categories.map(
                (category) => (
                  <div
                    key={
                      category._id
                    }
                    className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-primary">
                          {
                            category.title
                          }
                        </h3>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                            category.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {category.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-text/50">
                        ID:{" "}
                        {
                          category._id
                        }
                      </p>

                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-text/60">
                        <span>
                          Slug:{" "}
                          {
                            category.slug
                          }
                        </span>

                        <span>
                          Items:{" "}
                          {
                            category.itemCount
                          }
                        </span>
                      </div>

                      <p className="mt-2 max-w-2xl text-sm text-text/60">
                        {
                          category.description
                        }
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(
                            category
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/5"
                      >
                        <FiEdit2
                          size={15}
                        />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            category._id
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

export default AdminCategories;