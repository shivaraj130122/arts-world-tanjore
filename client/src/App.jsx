import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import SEOManager from "./components/seo/SEOManager";
import ImageSEOManager from "./components/seo/ImageSEOManager";

// Provider order: Auth wraps Cart/Wishlist since those could eventually
// sync per-user once the backend is connected.
function App() {
  return (
    <BrowserRouter>
      <SEOManager />
      <ImageSEOManager />
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppRoutes />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;



