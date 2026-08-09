import { FiStar } from "react-icons/fi";
import { classNames } from "../../utils/helpers";

// Renders a row of stars for a given rating (supports halves via fill %).
const Rating = ({ value = 0, count, size = 14, className = "" }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={classNames("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {stars.map((star) => {
          const filled = value >= star;
          const half = !filled && value > star - 1;
          return (
            <FiStar
              key={star}
              size={size}
              className={classNames(
                "text-secondary",
                filled || half ? "fill-secondary" : "fill-transparent text-secondary/30"
              )}
            />
          );
        })}
      </div>
      {typeof count === "number" && (
        <span className="text-xs text-text/50">({count})</span>
      )}
    </div>
  );
};

export default Rating;
