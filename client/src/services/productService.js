import api from "./api";

// Thin service layer so pages/components never call axios directly.
// Swap the mock fallbacks for real calls once the backend routes exist.

export const getProducts = async (params = {}) => {
  try {
    const { data } = await api.get("/products", { params });
    return data;
  } catch (error) {
    console.warn("getProducts: falling back to empty list", error?.message);
    return [];
  }
};

export const getProductById = async (id) => {
  try {
    const { data } = await api.get(`/products/${id}`);
    return data;
  } catch (error) {
    console.warn("getProductById: product fetch failed", error?.message);
    return null;
  }
};
