import { Link } from "react-router-dom";
import {
  FiTrash2,
  FiMinus,
  FiPlus,
  FiShoppingBag,
} from "react-icons/fi";
import Button from "../components/ui/Button";
import ProductImage from "../components/ui/ProductImage";
import EmptyState from "../components/ui/EmptyState";
import { useCart } from "../hooks/useCart";
import { formatCurrency } from "../utils/helpers";

const Cart = () => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    cartTotal,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-app section-y">
        <EmptyState
          icon={FiShoppingBag}
          title="Your Cart is Empty"
          description="Add some beautiful artwork to your cart and come back here when you're ready."
          action={
            <Link to="/shop">
              <Button>Continue Shopping</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-app section-y">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-secondary-dark">
          Shopping Cart
        </p>

        <h1 className="mt-2 font-heading text-3xl font-semibold text-primary sm:text-4xl">
          Your Cart
        </h1>

        <p className="mt-2 text-sm text-text/60">
          Review your selected artworks before checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 rounded-2xl border border-primary/10 bg-white p-4"
            >
              {/* Product Image */}
              <Link
                to={`/product/${item._id}`}
                className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-background"
              >
                <ProductImage
                  src={item.image}
                  alt={item.name}
                  iconSize={18}
                />
              </Link>

              {/* Product Details */}
              <div className="min-w-0 flex-1">
                <Link
                  to={`/product/${item._id}`}
                  className="font-medium text-text transition hover:text-primary"
                >
                  {item.name}
                </Link>

                <p className="mt-1 text-sm text-text/50">
                  {formatCurrency(item.price)}
                </p>

                {/* Quantity Controls */}
                <div className="mt-3 flex items-center gap-3">
                  {/* Minus */}
                  <button
                    type="button"
                    onClick={() => {
                      if (item.quantity <= 1) {
                        // 1 → 0 → remove item
                        removeFromCart(item._id);
                      } else {
                        updateQuantity(
                          item._id,
                          item.quantity - 1
                        );
                      }
                    }}
                    aria-label={`Decrease quantity of ${item.name}`}
                    className="grid h-8 w-8 place-items-center rounded-full border border-primary/20 text-primary transition hover:bg-primary/10"
                  >
                    <FiMinus size={12} />
                  </button>

                  {/* Quantity */}
                  <span
                    className="min-w-6 text-center text-sm font-medium text-text"
                    aria-live="polite"
                  >
                    {item.quantity}
                  </span>

                  {/* Plus */}
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(
                        item._id,
                        item.quantity + 1
                      )
                    }
                    aria-label={`Increase quantity of ${item.name}`}
                    className="grid h-8 w-8 place-items-center rounded-full border border-primary/20 text-primary transition hover:bg-primary/10"
                  >
                    <FiPlus size={12} />
                  </button>
                </div>
              </div>

              {/* Delete */}
              <button
                type="button"
                onClick={() => removeFromCart(item._id)}
                aria-label={`Remove ${item.name} from cart`}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-text/50 transition hover:bg-red-50 hover:text-red-600"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="h-fit rounded-2xl border border-primary/10 bg-white p-6 lg:sticky lg:top-24">
          <h2 className="font-heading text-lg font-semibold text-primary">
            Order Summary
          </h2>

          <div className="mt-4 flex justify-between text-sm text-text/70">
            <span>Subtotal</span>
            <span>{formatCurrency(cartTotal)}</span>
          </div>

          <div className="mt-2 flex justify-between text-sm text-text/70">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>

          <div className="my-4 border-t border-primary/10" />

          <div className="flex justify-between font-semibold text-primary">
            <span>Total</span>
            <span>{formatCurrency(cartTotal)}</span>
          </div>

          <Button size="lg" className="mt-6 w-full">
            Proceed to Checkout
          </Button>

          <Link
            to="/shop"
            className="mt-4 block text-center text-sm font-medium text-primary underline underline-offset-4"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;