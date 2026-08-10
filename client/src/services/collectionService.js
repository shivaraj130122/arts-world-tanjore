const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const getCollections = async () => {
  const response = await fetch(`${API_BASE_URL}/collections`);
  return handleResponse(response);
};

export const getCollectionBySlug = async (slug) => {
  const response = await fetch(
    `${API_BASE_URL}/collections/${encodeURIComponent(slug)}`
  );

  return handleResponse(response);
};