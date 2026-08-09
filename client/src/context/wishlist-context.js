import { createContext } from "react";

// Context object lives in its own file so WishlistContext.jsx can export
// only the WishlistProvider component — required for Fast Refresh to work
// correctly.
export const WishlistContext = createContext(null);
