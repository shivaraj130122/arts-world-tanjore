import { useEffect, useState } from "react";
import { AuthContext } from "./auth-context";
import {
  loginUser,
  registerUser,
  logoutUser,
} from "../services/authService";

const STORAGE_KEY = "aw_user";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(user)
      );
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async (credentials) => {
    const data = await loginUser(credentials);

    if (!data?.success || !data?.user) {
      throw new Error(
        data?.message || "Login failed"
      );
    }

    setUser(data.user);

    return data;
  };

  const register = async (payload) => {
    const data = await registerUser(payload);

    if (!data?.success || !data?.user) {
      throw new Error(
        data?.message || "Registration failed"
      );
    }

    // Store the JWT returned by registration.
    if (data.token) {
      localStorage.setItem("aw_token", data.token);
    }

    setUser(data.user);

    return data;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};