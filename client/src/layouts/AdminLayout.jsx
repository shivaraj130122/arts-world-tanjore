import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiPackage,
  FiFolder,
  FiLayers,
  FiMessageSquare,
  FiLogOut,
  FiArrowLeft,
} from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { classNames } from "../utils/helpers";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const links = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: FiGrid,
      end: true,
    },
    {
      label: "Products",
      path: "/admin/products",
      icon: FiPackage,
    },
    {
      label: "Categories",
      path: "/admin/categories",
      icon: FiFolder,
    },
    {
      label: "Collections",
      path: "/admin/collections",
      icon: FiLayers,
    },
    {
      label: "Messages",
      path: "/admin/messages",
      icon: FiMessageSquare,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full border-b border-primary/10 bg-primary text-background lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col">
            {/* Brand */}
            <div className="border-b border-white/10 p-6">
              <p className="font-heading text-xl font-bold">
                Bhavani&apos;s Art World
              </p>

              <p className="mt-1 text-xs text-background/60">
                Administration Panel
              </p>
            </div>

            {/* Admin information */}
            <div className="border-b border-white/10 p-5">
              <p className="text-sm font-semibold">
                {user?.name || "Administrator"}
              </p>

              <p className="mt-1 truncate text-xs text-background/60">
                {user?.email}
              </p>

              <span className="mt-3 inline-flex rounded-full bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                Admin
              </span>
            </div>

            {/* Navigation */}
            <nav className="flex gap-1 overflow-x-auto p-4 lg:flex-1 lg:flex-col lg:overflow-visible">
              {links.map((link) => {
                const Icon = link.icon;

                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.end}
                    className={({ isActive }) =>
                      classNames(
                        "flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                        isActive
                          ? "bg-white/15 text-white"
                          : "text-background/70 hover:bg-white/10 hover:text-white"
                      )
                    }
                  >
                    <Icon size={18} />
                    {link.label}
                  </NavLink>
                );
              })}
            </nav>

            {/* Bottom actions */}
            <div className="flex gap-2 border-t border-white/10 p-4 lg:flex-col">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-background/70 transition hover:bg-white/10 hover:text-white lg:justify-start"
              >
                <FiArrowLeft size={17} />
                View Website
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-background/70 transition hover:bg-white/10 hover:text-white lg:justify-start"
              >
                <FiLogOut size={17} />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;