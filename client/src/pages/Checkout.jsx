import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheck,
  FiMapPin,
  FiMail,
  FiPhone,
  FiUser,
} from "react-icons/fi";
import toast from "react-hot-toast";

import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import ProductImage from "../components/ui/ProductImage";
import EmptyState from "../components/ui/EmptyState";
import { useCart } from "../hooks/useCart";
import { formatCurrency } from "../utils/helpers";

const Checkout = () => {
  const navigate = useNavigate();

  const { items, cartTotal } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const address = formData.address.trim();
    const city = formData.city.trim();
    const state = formData.state.trim();
    const pincode = formData.pincode.trim();

    if (!name) {
      toast.error("Please enter your name");
      return false;
    }

    if (name.length < 2) {
      toast.error("Please enter a valid name");
      return false;
    }

    if (!email) {
      toast.error("Please enter your email address");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (!phone) {
      toast.error("Please enter your phone number");
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      toast.error("Please enter a valid 10-digit Indian phone number");
      return false;
    }

    if (!address) {
      toast.error("Please enter your delivery address");
      return false;
    }

    if (!city) {
      toast.error("Please enter your city");
      return false;
    }

    if (!state) {
      toast.error("Please enter your state");
      return false;
    }

    if (!pincode) {
      toast.error("Please enter your pincode");
      return false;
    }

    if (!/^\d{6}$/.test(pincode)) {
      toast.error("Please enter a valid 6-digit pincode");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      /*
       * Payment will be connected in Phase 9.4.
       *
       * For Phase 9.2 we only verify the checkout information
       * and move to the next payment step.
       */
      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });

      toast.success("Checkout information saved");

      navigate("/checkout/payment", {
        state: {
          customer: formData,
        },
      });
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Unable to continue to payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-app section-y">
        <EmptyState
          icon={FiMapPin}
          title="Your Cart is Empty"
          description="Add some beautiful artwork before proceeding to checkout."
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
    <div className="section-y">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:opacity-70"
          >
            <FiArrowLeft size={16} />
            Back to Cart
          </Link>

          <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-secondary-dark">
            Secure Checkout
          </p>

          <h1 className="mt-2 font-heading text-3xl font-semibold text-primary sm:text-4xl">
            Checkout
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-text/60 sm:text-base">
            Enter your delivery information carefully. We will use these
            details for your order and delivery.
          </p>
        </div>

        {/* Checkout layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Customer information */}
          <section className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <FiUser size={18} />
                  </div>

                  <div>
                    <h2 className="font-heading text-xl font-semibold text-primary">
                      Customer Information
                    </h2>

                    <p className="text-sm text-text/55">
                      Enter the details for your order.
                    </p>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-text"
                >
                  Full Name *
                </label>

                <div className="relative">
                  <FiUser
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text/40"
                  />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className="w-full rounded-xl border border-primary/15 bg-background py-3 pl-11 pr-4 text-sm outline-none transition focus:border-primary"
                  />
                </div>
              </div>

              {/* Email + Phone */}
              <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-text"
                  >
                    Email Address *
                  </label>

                  <div className="relative">
                    <FiMail
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text/40"
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="yourname@gmail.com"
                      autoComplete="email"
                      className="w-full rounded-xl border border-primary/15 bg-background py-3 pl-11 pr-4 text-sm outline-none transition focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-text"
                  >
                    Phone Number *
                  </label>

                  <div className="relative">
                    <FiPhone
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text/40"
                    />

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      autoComplete="tel"
                      className="w-full rounded-xl border border-primary/15 bg-background py-3 pl-11 pr-4 text-sm outline-none transition focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="mt-5">
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-medium text-text"
                >
                  Delivery Address *
                </label>

                <textarea
                  id="address"
                  name="address"
                  rows={4}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House / Flat number, street, area..."
                  autoComplete="street-address"
                  className="w-full resize-none rounded-xl border border-primary/15 bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                />
              </div>

              {/* City / State / Pincode */}
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="city"
                    className="mb-2 block text-sm font-medium text-text"
                  >
                    City *
                  </label>

                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    autoComplete="address-level2"
                    className="w-full rounded-xl border border-primary/15 bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="mb-2 block text-sm font-medium text-text"
                  >
                    State *
                  </label>

                  <input
                    id="state"
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    autoComplete="address-level1"
                    className="w-full rounded-xl border border-primary/15 bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="pincode"
                    className="mb-2 block text-sm font-medium text-text"
                  >
                    Pincode *
                  </label>

                  <input
                    id="pincode"
                    name="pincode"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="6-digit PIN"
                    autoComplete="postal-code"
                    className="w-full rounded-xl border border-primary/15 bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                  />
                </div>
              </div>

              {/* Continue */}
              <div className="mt-8 border-t border-primary/10 pt-6">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Preparing Payment..."
                    : "Continue to Payment"}
                </Button>

                <p className="mt-3 text-center text-xs text-text/45">
                  Payment options will be available on the next step.
                </p>
              </div>
            </form>
          </section>

          {/* Order summary */}
          <aside className="h-fit rounded-3xl border border-primary/10 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="font-heading text-xl font-semibold text-primary">
              Order Summary
            </h2>

            <div className="mt-5 space-y-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-3 border-b border-primary/10 pb-4"
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-background">
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      iconSize={16}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-medium text-text">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-text/50">
                      Qty: {item.quantity}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-primary">
                      {formatCurrency(
                        (Number(item.price) || 0) * item.quantity
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between text-text/65">
                <span>Subtotal</span>
                <span>{formatCurrency(cartTotal)}</span>
              </div>

              <div className="flex justify-between text-text/65">
                <span>Shipping</span>
                <span>Calculated later</span>
              </div>

              <div className="border-t border-primary/10 pt-4">
                <div className="flex justify-between text-base font-semibold text-primary">
                  <span>Total</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-white">
                  <FiCheck size={15} />
                </div>

                <div>
                  <p className="text-sm font-medium text-primary">
                    Secure checkout
                  </p>

                  <p className="mt-1 text-xs leading-5 text-text/55">
                    Your information will be used only to process your order
                    and delivery.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
};

export default Checkout;