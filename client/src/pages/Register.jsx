import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { SITE_NAME } from "../constants";

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      toast.success(
        "Account created successfully!"
      );

      navigate("/");
    } catch (error) {
      console.error(
        "Registration failed:",
        error
      );

      toast.error(
        error.message ||
          "Unable to create your account. Please try again."
      );
    }
  };

  return (
    <div className="min-h-[70vh] bg-background px-4 py-12">
      <div className="mx-auto max-w-md rounded-3xl border border-primary/10 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="font-heading text-3xl font-bold text-primary">
          Create Account
        </h1>

        <p className="mt-2 text-sm leading-6 text-text/60">
          Join {SITE_NAME} for a personalized shopping
          experience
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 space-y-4"
          noValidate
        >
          {/* Name */}
          <div>
            <label
              htmlFor="register-name"
              className="mb-1.5 block text-sm font-medium text-text"
            >
              Full Name
            </label>

            <input
              id="register-name"
              type="text"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message:
                    "Name must contain at least 2 characters",
                },
              })}
              aria-invalid={
                errors.name ? "true" : "false"
              }
              className="w-full rounded-lg border border-primary/20 px-4 py-2.5 text-sm outline-none focus:border-primary"
            />

            {errors.name && (
              <p className="mt-1 text-xs text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="register-email"
              className="mb-1.5 block text-sm font-medium text-text"
            >
              Email
            </label>

            <input
              id="register-email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value:
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message:
                    "Please enter a valid email address",
                },
              })}
              aria-invalid={
                errors.email ? "true" : "false"
              }
              className="w-full rounded-lg border border-primary/20 px-4 py-2.5 text-sm outline-none focus:border-primary"
            />

            {errors.email && (
              <p className="mt-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="register-password"
              className="mb-1.5 block text-sm font-medium text-text"
            >
              Password
            </label>

            <input
              id="register-password"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message:
                    "At least 6 characters",
                },
              })}
              aria-invalid={
                errors.password ? "true" : "false"
              }
              className="w-full rounded-lg border border-primary/20 px-4 py-2.5 text-sm outline-none focus:border-primary"
            />

            {errors.password && (
              <p className="mt-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="register-confirm-password"
              className="mb-1.5 block text-sm font-medium text-text"
            >
              Confirm Password
            </label>

            <input
              id="register-confirm-password"
              type="password"
              {...register("confirmPassword", {
                required:
                  "Please confirm your password",
                validate: (value) =>
                  value === watch("password") ||
                  "Passwords do not match",
              })}
              aria-invalid={
                errors.confirmPassword
                  ? "true"
                  : "false"
              }
              className="w-full rounded-lg border border-primary/20 px-4 py-2.5 text-sm outline-none focus:border-primary"
            />

            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Creating account..."
              : "Register"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-text/60">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;