import { classNames } from "../../utils/helpers";

const VARIANTS = {
  primary: "bg-primary text-background hover:bg-primary-light",
  secondary: "bg-secondary text-primary hover:bg-secondary-light",
  outline: "border border-primary text-primary hover:bg-primary hover:text-background",
  ghost: "text-primary hover:bg-primary/10",
};

const SIZES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3 text-base",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      className={classNames(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition duration-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
