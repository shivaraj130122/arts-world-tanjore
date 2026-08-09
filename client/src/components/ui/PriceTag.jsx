import { formatCurrency } from "../../utils/helpers";

// Shows current price, and — when an oldPrice is provided — the struck-through
// original price plus the computed discount percentage.
const PriceTag = ({ price, oldPrice, size = "md" }) => {
  const textSize = size === "lg" ? "text-2xl" : "text-base";
  const oldTextSize = size === "lg" ? "text-base" : "text-xs";

  const discountPercent =
    oldPrice && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : null;

  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className={`font-semibold text-primary ${textSize}`}>
        {formatCurrency(price)}
      </span>
      {oldPrice && oldPrice > price && (
        <span className={`text-text/40 line-through ${oldTextSize}`}>
          {formatCurrency(oldPrice)}
        </span>
      )}
      {discountPercent && (
        <span className="text-xs font-semibold text-emerald-600">
          {discountPercent}% off
        </span>
      )}
    </div>
  );
};

export default PriceTag;
