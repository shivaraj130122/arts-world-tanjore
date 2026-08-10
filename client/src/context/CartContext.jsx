import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { CartContext } from "./cart-context";

const STORAGE_KEY = "aw_cart";

const readInitialCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return [];

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item) => item && item._id)
      .map((item) => ({
        ...item,
        quantity: Math.max(1, Number(item.quantity) || 1),
      }));
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(readInitialCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product, quantity = 1) => {
    const safeQuantity = Math.max(1, Number(quantity) || 1);

    setItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);

      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: item.quantity + safeQuantity,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          quantity: safeQuantity,
        },
      ];
    });

    toast.success(
      `${product.name || "Item"} × ${safeQuantity} added to cart`
    );
  };

  const removeFromCart = (id) => {
    setItems((prev) => prev.filter((item) => item._id !== id));
    toast.success("Item removed from cart");
  };

  const updateQuantity = (id, quantity) => {
    const safeQuantity = Math.max(1, Number(quantity) || 1);

    setItems((prev) =>
      prev.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: safeQuantity,
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast.success("Cart cleared");
  };

  const cartCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const cartTotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.quantity * (Number(item.price) || 0),
        0
      ),
    [items]
  );

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};