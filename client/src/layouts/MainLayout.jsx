import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import ScrollToTop from "../components/common/ScrollToTop";

// Every routed page renders inside <Outlet /> here, between a persistent
// Navbar and Footer. Add more layouts (e.g. AuthLayout, AdminLayout) as
// the app grows — routes/AppRoutes.jsx decides which layout wraps which pages.
const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-text">
      <ScrollToTop />
      <Toaster position="top-center" toastOptions={{ duration: 2500 }} />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
