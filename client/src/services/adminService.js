import api from "./api";

export const getAdminProfile = async () => {
  const { data } = await api.get(
    "/admin/profile"
  );

  return data;
};

export const getDashboardStats = async () => {
  const { data } = await api.get(
    "/admin/stats"
  );

  return data;
};

export const updateUserStatus = async (
  userId,
  isActive
) => {
  const { data } = await api.patch(
    `/admin/users/${userId}/status`,
    {
      isActive,
    }
  );

  return data;
};

export const updateUserRole = async (
  userId,
  role
) => {
  const { data } = await api.patch(
    `/admin/users/${userId}/role`,
    {
      role,
    }
  );

  return data;
};