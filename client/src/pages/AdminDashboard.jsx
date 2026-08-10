import { useEffect, useState } from "react";
import {
  FiUsers,
  FiShield,
  FiActivity,
  FiPackage,
} from "react-icons/fi";
import toast from "react-hot-toast";

import Container from "../components/ui/Container";

import {
  getAdminProfile,
  getDashboardStats,
} from "../services/adminService";

import { getProducts } from "../services/productService";

const formatDate = (date) => {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const UserRow = ({ user }) => {
  return (
    <tr className="border-b border-primary/10 last:border-b-0 hover:bg-primary/[0.02]">
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 font-semibold text-primary">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <span className="font-semibold text-text">
            {user.name}
          </span>
        </div>
      </td>

      <td className="px-6 py-5">
        <a
          href={`mailto:${user.email}`}
          className="text-sm text-primary hover:underline"
        >
          {user.email}
        </a>
      </td>

      <td className="px-6 py-5">
        <span
          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${
            user.role === "admin"
              ? "bg-secondary/20 text-primary"
              : "bg-primary/10 text-primary"
          }`}
        >
          {user.role}
        </span>
      </td>

      <td className="px-6 py-5">
        <span
          className={`inline-flex items-center gap-2 text-sm font-medium ${
            user.isActive
              ? "text-green-700"
              : "text-red-600"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              user.isActive
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          />

          {user.isActive ? "Active" : "Inactive"}
        </span>
      </td>

      <td className="px-6 py-5 text-sm text-text/55">
        {formatDate(user.createdAt)}
      </td>
    </tr>
  );
};

const UserTable = ({ users }) => {
  if (!users || users.length === 0) {
    return (
      <div className="rounded-3xl border border-primary/10 bg-white p-8 text-center shadow-sm">
        <FiUsers
          size={32}
          className="mx-auto text-primary/30"
        />

        <p className="mt-3 text-sm text-text/55">
          No accounts found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-sm">
      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-primary/10 bg-primary/[0.03]">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-text/45">
                User
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-text/45">
                Email
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-text/45">
                Role
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-text/45">
                Status
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-text/45">
                Registered
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <UserRow
                key={user._id}
                user={user}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="divide-y divide-primary/10 md:hidden">
        {users.map((user) => (
          <div
            key={user._id}
            className="p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary/10 font-semibold text-primary">
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                <div>
                  <p className="font-semibold text-text">
                    {user.name}
                  </p>

                  <a
                    href={`mailto:${user.email}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {user.email}
                  </a>
                </div>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${
                  user.role === "admin"
                    ? "bg-secondary/20 text-primary"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {user.role}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-xs text-text/55">
              <span
                className={
                  user.isActive
                    ? "font-medium text-green-700"
                    : "font-medium text-red-600"
                }
              >
                {user.isActive
                  ? "● Active"
                  : "● Inactive"}
              </span>

              <span>
                Registered:{" "}
                {formatDate(user.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    totalProducts: 0,
  });

  const [users, setUsers] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      try {
        const [
          profileResponse,
          statsResponse,
          productsResponse,
        ] = await Promise.all([
          getAdminProfile(),
          getDashboardStats(),
          getProducts(),
        ]);

        if (cancelled) {
          return;
        }

        setAdmin(profileResponse.admin);

        setStats({
          ...statsResponse.stats,
          totalProducts:
            productsResponse?.count ||
            productsResponse?.products?.length ||
            0,
        });

        setUsers(statsResponse.users || []);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Admin dashboard error:",
          error
        );

        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Unable to load admin dashboard"
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] pt-24 pb-10">
        <Container>
          <div className="rounded-3xl border border-primary/10 bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-text/60">
              Loading admin dashboard...
            </p>
          </div>
        </Container>
      </div>
    );
  }

  const activeUsers = users.filter(
    (user) => user.isActive
  );

  const administratorUsers = users.filter(
    (user) => user.role === "admin"
  );

  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      description: "Registered users",
      icon: FiUsers,
    },
    {
      label: "Active Users",
      value: stats.activeUsers,
      description: "Active accounts",
      icon: FiActivity,
    },
    {
      label: "Administrators",
      value: stats.adminUsers,
      description: "Admin accounts",
      icon: FiShield,
    },
    {
      label: "Products",
      value: stats.totalProducts,
      description: "Products in catalog",
      icon: FiPackage,
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary-dark">
            Administration
          </p>

          <h1 className="mt-2 font-heading text-3xl font-bold text-primary sm:text-4xl">
            Dashboard
          </h1>

          <p className="mt-3 text-sm text-text/60 sm:text-base">
            Welcome back,{" "}
            {admin?.name || "Admin"}.
          </p>
        </div>

        {/* Admin Profile */}
        <section className="mb-8 rounded-3xl border border-primary/10 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-text/45">
                Signed in as
              </p>

              <h2 className="mt-1 text-lg font-semibold text-primary">
                {admin?.name}
              </h2>

              <p className="text-sm text-text/60">
                {admin?.email}
              </p>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-secondary/15 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary">
              <FiShield size={15} />
              {admin?.role}
            </span>
          </div>
        </section>

        {/* Overview */}
        <section>
          <h2 className="mb-5 font-heading text-xl font-semibold text-primary">
            Overview
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.label}
                  className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                      <Icon size={22} />
                    </div>

                    <span className="text-right text-xs font-semibold uppercase tracking-wide text-text/40">
                      {card.label}
                    </span>
                  </div>

                  <p className="mt-6 text-4xl font-bold text-primary">
                    {card.value}
                  </p>

                  <p className="mt-2 text-sm font-medium text-text/60">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Registered Users */}
        <section className="mt-10">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-primary">
                Registered Users
              </h2>

              <p className="mt-1 text-sm text-text/55">
                All accounts registered on
                Bhavani's Art World.
              </p>
            </div>

            <div className="rounded-full bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
              {users.length} accounts
            </div>
          </div>

          <UserTable users={users} />
        </section>

        {/* Active Accounts */}
        <section className="mt-10">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="flex items-center gap-3 font-heading text-2xl font-semibold text-primary">
                <FiActivity size={24} />
                Active Accounts
              </h2>

              <p className="mt-1 text-sm text-text/55">
                Accounts that are currently active.
              </p>
            </div>

            <div className="rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
              {activeUsers.length} active
            </div>
          </div>

          <UserTable users={activeUsers} />
        </section>

        {/* Administrator Accounts */}
        <section className="mt-10">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="flex items-center gap-3 font-heading text-2xl font-semibold text-primary">
                <FiShield size={24} />
                Administrator Accounts
              </h2>

              <p className="mt-1 text-sm text-text/55">
                Accounts with administrator access.
              </p>
            </div>

            <div className="rounded-full bg-secondary/15 px-4 py-2 text-sm font-semibold text-primary">
              {administratorUsers.length} administrators
            </div>
          </div>

          <UserTable users={administratorUsers} />
        </section>
      </Container>
    </div>
  );
};

export default AdminDashboard;