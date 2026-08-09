import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { SITE_NAME } from "../constants";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    // TODO: replace with authService.loginUser(data)
    login({ name: data.email.split("@")[0], email: data.email });
    toast.success("Welcome back!");
    navigate("/");
  };

  return (
    <div className="container-app section-y flex justify-center">
      <div className="w-full max-w-md rounded-2xl border border-primary/10 bg-white p-8 shadow-sm">
        <h1 className="text-center font-heading text-2xl font-bold text-primary">
          Welcome Back
        </h1>
        <p className="mt-1 text-center text-sm text-text/60">
          Login to your {SITE_NAME} account
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-text">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              {...register("email", { required: "Email is required" })}
              aria-invalid={errors.email ? "true" : "false"}
              className="w-full rounded-lg border border-primary/20 px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-text">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              {...register("password", { required: "Password is required" })}
              aria-invalid={errors.password ? "true" : "false"}
              className="w-full rounded-lg border border-primary/20 px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-text/60">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
