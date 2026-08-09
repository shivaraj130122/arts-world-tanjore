import { createContext } from "react";

// Context object lives in its own file so AuthContext.jsx can export only
// the AuthProvider component — required for Fast Refresh to work correctly.
export const AuthContext = createContext(null);
