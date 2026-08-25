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
    localStorage.getItem(
      "aw_token"
    );

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

export const getCollections =
  async () => {
    const response =
      await fetch(
        `${API_BASE_URL}/collections`
      );

    return handleResponse(
      response
    );
  };

export const getCollectionBySlug =
  async (slug) => {
    const response =
      await fetch(
        `${API_BASE_URL}/collections/${encodeURIComponent(
          slug
        )}`
      );

    return handleResponse(
      response
    );
  };
export const getAllCollectionsAdmin =
  async () => {
    const response =
      await fetch(
        `${API_BASE_URL}/collections/admin/all`,
        {
          headers: getHeaders(),
        }
      );

    return handleResponse(
      response
    );
  };

export const createCollection =
  async (collection) => {
    const response =
      await fetch(
        `${API_BASE_URL}/collections`,
        {
          method: "POST",
          headers:
            getHeaders(),
          body: JSON.stringify(
            collection
          ),
        }
      );

    return handleResponse(
      response
    );
  };

export const updateCollection =
  async (
    id,
    collection
  ) => {
    const response =
      await fetch(
        `${API_BASE_URL}/collections/${encodeURIComponent(
          id
        )}`,
        {
          method: "PUT",
          headers:
            getHeaders(),
          body: JSON.stringify(
            collection
          ),
        }
      );

    return handleResponse(
      response
    );
  };

export const deleteCollection =
  async (id) => {
    const response =
      await fetch(
        `${API_BASE_URL}/collections/${encodeURIComponent(
          id
        )}`,
        {
          method: "DELETE",
          headers:
            getHeaders(),
        }
      );

    return handleResponse(
      response
    );
  };
// Admin: activate / mute collection
export const updateCollectionStatus =
  async (id, isActive) => {
    const response =
      await fetch(
        `${API_BASE_URL}/collections/${encodeURIComponent(
          id
        )}/status`,
        {
          method: "PATCH",
          headers:
            getHeaders(),
          body: JSON.stringify({
            isActive,
          }),
        }
      );

    return handleResponse(
      response
    );
  };