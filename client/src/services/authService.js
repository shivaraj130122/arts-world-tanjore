import api from "./api";

export const loginUser = async (credentials) => {
  const { data } = await api.post("/auth/login", credentials);
  if (data?.token) {
    localStorage.setItem("aw_token", data.token);
  }
  return data;
};

export const registerUser = async (payload) => {
  const { data } = await api.post("/auth/register", payload);
  return data;
};

export const logoutUser = () => {
  localStorage.removeItem("aw_token");
};
