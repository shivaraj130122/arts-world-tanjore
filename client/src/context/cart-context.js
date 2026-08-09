import { createContext } from "react";

// Context object lives in its own file so CartContext.jsx can export only
// the CartProvider component — required for Fast Refresh to work correctly.
export const CartContext = createContext(null);
