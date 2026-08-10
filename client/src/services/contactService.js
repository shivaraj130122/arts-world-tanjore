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

// Customer
export const submitContactMessage =
  async (formData) => {
    const response =
      await fetch(
        `${API_BASE_URL}/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            formData
          ),
        }
      );

    return handleResponse(
      response
    );
  };

// Admin
export const getContactMessages =
  async () => {
    const response =
      await fetch(
        `${API_BASE_URL}/contact`,
        {
          headers:
            getHeaders(),
        }
      );

    return handleResponse(
      response
    );
  };

export const getContactMessageById =
  async (id) => {
    const response =
      await fetch(
        `${API_BASE_URL}/contact/${encodeURIComponent(
          id
        )}`,
        {
          headers:
            getHeaders(),
        }
      );

    return handleResponse(
      response
    );
  };

export const updateContactMessageStatus =
  async (id, status) => {
    const response =
      await fetch(
        `${API_BASE_URL}/contact/${encodeURIComponent(
          id
        )}/status`,
        {
          method: "PUT",
          headers:
            getHeaders(),
          body: JSON.stringify({
            status,
          }),
        }
      );

    return handleResponse(
      response
    );
  };

export const deleteContactMessage =
  async (id) => {
    const response =
      await fetch(
        `${API_BASE_URL}/contact/${encodeURIComponent(
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