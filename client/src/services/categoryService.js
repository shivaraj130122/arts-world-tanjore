const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Something went wrong"
    );
  }

  return data;
};

const getHeaders = () => {
  const token =
    localStorage.getItem("aw_token");

  return {
    "Content-Type":
      "application/json",

    ...(token
      ? {
          Authorization:
            `Bearer ${token}`,
        }
      : {}),
  };
};

// =====================================================
// PUBLIC
// =====================================================

export const getCategories = async () => {
  const response = await fetch(
    `${API_BASE_URL}/categories`
  );

  return handleResponse(response);
};

export const getCategoryBySlug = async (
  slug
) => {
  const response = await fetch(
    `${API_BASE_URL}/categories/${encodeURIComponent(
      slug
    )}`
  );

  return handleResponse(response);
};

// =====================================================
// ADMIN
// =====================================================

export const getAllCategoriesAdmin =
  async () => {
    const response = await fetch(
      `${API_BASE_URL}/categories/admin/all`,
      {
        headers: getHeaders(),
      }
    );

    return handleResponse(response);
  };

export const createCategory =
  async (category) => {
    const response = await fetch(
      `${API_BASE_URL}/categories`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(category),
      }
    );

    return handleResponse(response);
  };

export const updateCategory =
  async (id, category) => {
    const response = await fetch(
      `${API_BASE_URL}/categories/${encodeURIComponent(
        id
      )}`,
      {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(category),
      }
    );

    return handleResponse(response);
  };

export const updateCategoryStatus =
  async (id, isActive) => {
    const response = await fetch(
      `${API_BASE_URL}/categories/${encodeURIComponent(
        id
      )}/status`,
      {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({
          isActive,
        }),
      }
    );

    return handleResponse(response);
  };

export const deleteCategory =
  async (id) => {
    const response = await fetch(
      `${API_BASE_URL}/categories/${encodeURIComponent(
        id
      )}`,
      {
        method: "DELETE",
        headers: getHeaders(),
      }
    );

    return handleResponse(response);
  };