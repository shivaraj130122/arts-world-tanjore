import { BrowserRouter } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

// Provider order: Auth wraps Cart/Wishlist since those could eventually
// sync per-user once the backend is connected.
// MotionConfig reducedMotion="user" makes every Framer Motion animation in
// the app automatically respect the visitor's OS-level "reduce motion"
// preference, without needing to touch each animated component individually.
function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <AppRoutes />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </MotionConfig>
  );
}

export default App;
