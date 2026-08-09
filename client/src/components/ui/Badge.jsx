import { classNames } from "../../utils/helpers";

const VARIANTS = {
  gold: "bg-secondary text-primary",
  primary: "bg-primary text-background",
  outline: "border border-primary/30 text-primary bg-white",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
};

const Badge = ({ children, variant = "gold", className = "" }) => {
  return (
    <span
      className={classNames(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        VARIANTS[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
