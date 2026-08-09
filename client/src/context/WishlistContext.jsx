import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { WishlistContext } from "./wishlist-context";

const STORAGE_KEY = "aw_wishlist";

const readInitialWishlist = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState(readInitialWishlist);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const toggleWishlist = (product) => {
    setItems((prev) => {
      const exists = prev.some((item) => item._id === product._id);
      if (exists) {
        toast.success("Removed from wishlist");
        return prev.filter((item) => item._id !== product._id);
      }
      toast.success("Added to wishlist");
      return [...prev, product];
    });
  };

  const isWishlisted = (id) => items.some((item) => item._id === id);

  const wishlistCount = useMemo(() => items.length, [items]);

  const value = { items, toggleWishlist, isWishlisted, wishlistCount };

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
};
