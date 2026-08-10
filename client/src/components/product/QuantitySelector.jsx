import { FiMinus, FiPlus } from "react-icons/fi";

const QuantitySelector = ({ quantity, onChange, maxQuantity }) => {
  const canIncrease =
    typeof maxQuantity !== "number" || quantity < maxQuantity;

  // Product-page quantity is allowed to start at 0.
  const canDecrease = quantity > 0;

  const handleInputChange = (e) => {
    const parsed = parseInt(e.target.value, 10);

    if (Number.isNaN(parsed)) return;

    const clamped = Math.max(
      0,
      typeof maxQuantity === "number"
        ? Math.min(parsed, maxQuantity)
        : parsed
    );

    onChange(clamped);
  };

  return (
    <div className="inline-flex items-center rounded-full border border-primary/20">
      <button
        type="button"
        onClick={() => canDecrease && onChange(quantity - 1)}
        disabled={!canDecrease}
        aria-label="Decrease quantity"
        className="grid h-10 w-10 place-items-center rounded-full text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <FiMinus size={14} />
      </button>

      <input
        type="text"
        inputMode="numeric"
        value={quantity}
        onChange={handleInputChange}
        aria-label="Quantity"
        className="w-10 border-none bg-transparent text-center text-sm font-medium text-text outline-none"
      />

      <button
        type="button"
        onClick={() => canIncrease && onChange(quantity + 1)}
        disabled={!canIncrease}
        aria-label="Increase quantity"
        className="grid h-10 w-10 place-items-center rounded-full text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <FiPlus size={14} />
      </button>
    </div>
  );
};

export default QuantitySelector;