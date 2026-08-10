import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiSearch,
  FiHeart,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiShield,
} from "react-icons/fi";

import {
  NAV_LINKS,
  SITE_NAME,
  SITE_SECONDARY_TAGLINE,
} from "../../constants";

import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { useAuth } from "../../hooks/useAuth";
import { classNames } from "../../utils/helpers";

import logo from "../../assets/images/bhavani-art-world-logo-nav.jpg";

const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const { user, isAuthenticated, logout } = useAuth();

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const query = searchTerm.trim();

    navigate(
      query
        ? `/shop?search=${encodeURIComponent(query)}`
        : "/shop"
    );

    setIsSearchOpen(false);
    setSearchTerm("");
  };

  const handleLogout = () => {
    logout();
    setIsMobileOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-primary/10 bg-background/95 backdrop-blur">
      {/* Main Navbar */}
      <div className="container-app flex h-20 items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex min-w-0 items-center gap-3"
          aria-label={SITE_NAME}
        >
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-primary/10">
            <img
              src={logo}
              alt={`${SITE_NAME} logo`}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="hidden min-w-0 sm:block">
            <div className="truncate font-heading text-lg font-bold text-primary">
              {SITE_NAME}
            </div>

            <div className="truncate text-xs text-text/55">
              {SITE_SECONDARY_TAGLINE}
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                classNames(
                  "relative text-sm font-medium text-text/80 transition-colors hover:text-primary",
                  isActive &&
                    "text-primary after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:bg-secondary"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search */}
          <button
            aria-label="Search"
            aria-expanded={isSearchOpen}
            onClick={() =>
              setIsSearchOpen((value) => !value)
            }
            className="grid h-10 w-10 place-items-center rounded-full text-text/80 transition hover:bg-primary/10 hover:text-primary"
          >
            <FiSearch size={19} />
          </button>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="relative grid h-10 w-10 place-items-center rounded-full text-text/80 transition hover:bg-primary/10 hover:text-primary"
          >
            <FiHeart size={19} />

            {wishlistCount > 0 && (
              <span className="absolute right-0 top-0 grid h-4 w-4 place-items-center rounded-full bg-secondary text-[10px] font-bold text-primary">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            aria-label="Cart"
            className="relative grid h-10 w-10 place-items-center rounded-full text-text/80 transition hover:bg-primary/10 hover:text-primary"
          >
            <FiShoppingCart size={19} />

            {cartCount > 0 && (
              <span className="absolute right-0 top-0 grid h-4 w-4 place-items-center rounded-full bg-secondary text-[10px] font-bold text-primary">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Authentication */}
          {isAuthenticated ? (
            <div className="ml-1 hidden items-center gap-2 sm:flex">
              <span className="max-w-32 truncate text-sm font-medium text-primary">
                Hi, {user?.name || "User"}
              </span>

              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  aria-label="Admin Dashboard"
                  className="grid h-10 w-10 place-items-center rounded-full text-primary transition hover:bg-primary/10"
                  title="Admin Dashboard"
                >
                  <FiShield size={18} />
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                aria-label="Logout"
                title="Logout"
                className="grid h-10 w-10 place-items-center rounded-full text-text/80 transition hover:bg-primary/10 hover:text-primary"
              >
                <FiLogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-1 hidden items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-background transition hover:bg-primary-light sm:flex"
            >
              <FiUser size={16} />
              Login
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={isMobileOpen}
            onClick={() =>
              setIsMobileOpen((value) => !value)
            }
            className="grid h-10 w-10 place-items-center rounded-full text-primary lg:hidden"
          >
            {isMobileOpen ? (
              <FiX size={22} />
            ) : (
              <FiMenu size={22} />
            )}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.form
            onSubmit={handleSearchSubmit}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-primary/10 bg-background"
          >
            <div className="container-app flex items-center gap-3 py-3">
              <FiSearch className="text-text/50" />

              <input
                autoFocus
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                placeholder="Search Tanjore paintings, gifts, décor..."
                className="w-full bg-transparent text-sm text-text outline-none placeholder:text-text/40"
              />
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-primary/10 bg-background lg:hidden"
          >
            <div className="container-app flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() =>
                    setIsMobileOpen(false)
                  }
                  className={({ isActive }) =>
                    classNames(
                      "rounded-lg px-3 py-2.5 text-sm font-medium text-text/80 hover:bg-primary/10 hover:text-primary",
                      isActive &&
                        "bg-primary/10 text-primary"
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              {isAuthenticated ? (
                <>
                  <div className="mt-2 rounded-lg bg-primary/5 px-3 py-3">
                    <p className="text-sm font-medium text-primary">
                      Hi, {user?.name || "User"}
                    </p>

                    {user?.email && (
                      <p className="mt-1 truncate text-xs text-text/50">
                        {user.email}
                      </p>
                    )}
                  </div>

                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() =>
                        setIsMobileOpen(false)
                      }
                      className="mt-1 flex items-center justify-center gap-2 rounded-full border border-primary/20 px-5 py-2.5 text-sm font-medium text-primary"
                    >
                      <FiShield size={16} />
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-1 flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-background"
                  >
                    <FiLogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() =>
                    setIsMobileOpen(false)
                  }
                  className="mt-2 flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-background"
                >
                  <FiUser size={16} />
                  Login
                </Link>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;