import { Link } from "react-router-dom";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";
import Button from "../components/ui/Button";
import ProductImage from "../components/ui/ProductImage";
import EmptyState from "../components/ui/EmptyState";
import { useCart } from "../hooks/useCart";
import { formatCurrency } from "../utils/helpers";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-app section-y">
        <h1 className="mb-8 text-center font-heading text-3xl font-bold text-primary">
          Your Cart
        </h1>
        <EmptyState
          icon={FiShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet — browse the collection to find something you'll love."
        >
          <Link to="/shop">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="container-app section-y">
      <h1 className="mb-8 font-heading text-3xl font-bold text-primary">Your Cart</h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 rounded-2xl border border-primary/10 bg-white p-4"
            >
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-background">
                <ProductImage src={item.image} alt={item.name} iconSize={18} />
              </div>
              <div className="flex-1">
                <Link to={`/product/${item._id}`} className="font-medium text-text hover:text-primary">
                  {item.name}
                </Link>
                <p className="text-sm text-text/50">{formatCurrency(item.price)}</p>

                <div className="mt-2 flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    aria-label={`Decrease quantity of ${item.name}`}
                    className="grid h-7 w-7 place-items-center rounded-full border border-primary/20 text-primary transition hover:bg-primary/10"
                  >
                    <FiMinus size={12} />
                  </button>
                  <span className="text-sm" aria-live="polite">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    aria-label={`Increase quantity of ${item.name}`}
                    className="grid h-7 w-7 place-items-center rounded-full border border-primary/20 text-primary transition hover:bg-primary/10"
                  >
                    <FiPlus size={12} />
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item._id)}
                aria-label={`Remove ${item.name} from cart`}
                className="grid h-9 w-9 place-items-center rounded-full text-text/50 hover:bg-red-50 hover:text-red-600"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-primary/10 bg-white p-6">
          <h2 className="font-heading text-lg font-semibold text-primary">Order Summary</h2>
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
        </div>
      </div>
    </div>
  );
};

export default Cart;
