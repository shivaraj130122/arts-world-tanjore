import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

import Home from "../pages/Home";
import Shop from "../pages/Shop";
import Collections from "../pages/Collections";
import CustomOrders from "../pages/CustomOrders";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import ReturnPolicy from "../pages/ReturnPolicy";
import Register from "../pages/Register";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Wishlist from "../pages/Wishlist";
import ProductDetails from "../pages/ProductDetails";
import NotFound from "../pages/NotFound";

import AdminDashboard from "../pages/AdminDashboard";
import AdminProducts from "../pages/AdminProducts";
import AdminCategories from "../pages/AdminCategories";
import AdminCollections from "../pages/AdminCollections";
import AdminMessages from "../pages/AdminMessages";

import ProtectedRoute from "../components/common/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Customer website */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />

        <Route
          path="shop"
          element={<Shop />}
        />

        <Route
          path="collections"
          element={<Collections />}
        />

        <Route
          path="custom-orders"
          element={<CustomOrders />}
        />

        <Route
          path="about"
          element={<About />}
        />

        <Route
          path="contact"
          element={<Contact />}
        />

        <Route

          path="return-policy"

          element={<ReturnPolicy />}

        />


        <Route

          path="login"
          element={<Login />}
        />

        <Route
          path="register"
          element={<Register />}
        />

        <Route
          path="cart"
          element={<Cart />}
        />

        {/* Checkout */}
        <Route
          path="checkout"
          element={<Checkout />}
        />

        <Route
          path="wishlist"
          element={<Wishlist />}
        />

        <Route
          path="product/:id"
          element={<ProductDetails />}
        />

        {/* Admin area */}
        <Route element={<ProtectedRoute requireAdmin />}>
          <Route
            path="admin"
            element={<AdminLayout />}
          >
            {/* Dashboard */}
            <Route
              index
              element={<AdminDashboard />}
            />

            {/* Products */}
            <Route
              path="products"
              element={<AdminProducts />}
            />

            {/* Categories */}
            <Route
              path="categories"
              element={<AdminCategories />}
            />

            {/* Collections */}
            <Route
              path="collections"
              element={<AdminCollections />}
            />

            {/* Messages */}
            <Route
              path="messages"
              element={<AdminMessages />}
            />
          </Route>
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={<NotFound />}
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
