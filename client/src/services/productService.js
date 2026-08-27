const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const handleResponse = async (
  response
) => {
  const data =
    await response.json();

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

// Public
export const getProducts =
  async (params = {}) => {
    const search =
      new URLSearchParams();

    Object.entries(params).forEach(
      ([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== ""
        ) {
          search.set(
            key,
            value
          );
        }
      }
    );

    const query =
      search.toString();

    const response =
      await fetch(
        `${API_BASE_URL}/products${
          query
            ? `?${query}`
            : ""
        }`
      );

    return handleResponse(
      response
    );
  };

// Admin
export const getAdminProducts =
  async () => {
    const response =
      await fetch(
        `${API_BASE_URL}/products/admin/all`,
        {
          headers: getHeaders(),
        }
      );

    return handleResponse(
      response
    );
  };

export const getProductById =
  async (id) => {
    const response =
      await fetch(
        `${API_BASE_URL}/products/${encodeURIComponent(
          id
        )}`
      );

    return handleResponse(
      response
    );
  };

export const createProduct =
  async (product) => {
    const response =
      await fetch(
        `${API_BASE_URL}/products`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(
            product
          ),
        }
      );

    return handleResponse(
      response
    );
  };

export const updateProduct =
  async (
    id,
    product
  ) => {
    const response =
      await fetch(
        `${API_BASE_URL}/products/${encodeURIComponent(
          id
        )}`,
        {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify(
            product
          ),
        }
      );

    return handleResponse(
      response
    );
  };

export const updateProductStatus =
  async (
    id,
    isActive
  ) => {
    const response =
      await fetch(
        `${API_BASE_URL}/products/${encodeURIComponent(
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

    return handleResponse(
      response
    );
  };

export const deleteProduct =
  async (id) => {
    const response =
      await fetch(
        `${API_BASE_URL}/products/${encodeURIComponent(
          id
        )}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        }
      );

    return handleResponse(
      response
    );
  };