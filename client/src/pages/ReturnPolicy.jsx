import { useEffect } from "react";
import Container from "../components/ui/Container";
import { setSEO } from "../components/seo/SEOManager";

const SITE_URL = "https://bhavani-art-world.onrender.com";

const ReturnPolicy = () => {
  useEffect(() => {
    setSEO({
      title: "Return & Refund Policy | Bhavani's Art World",
      description:
        "Read the return, refund, exchange, and damaged-product policy for purchases from Bhavani's Art World.",
      canonicalUrl: `${SITE_URL}/return-policy`,
    });
  }, []);

  return (
    <main className="bg-[#fffaf3] py-12 sm:py-16">
      <Container>
        <article className="mx-auto max-w-4xl">
          <header className="mb-10 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#8a173d]">
              Bhavani's Art World
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-[#5b0e2d] sm:text-4xl">
              Return & Refund Policy
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600">
              Please review our return, refund, exchange, and damaged-product
              policy before placing an order.
            </p>
          </header>

          <div className="space-y-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-10">
            <section>
              <h2 className="text-xl font-semibold text-[#5b0e2d]">1. Returns</h2>
              <p className="mt-3 leading-7 text-gray-700">
                Eligible products may be returned according to the return
                conditions communicated by Bhavani's Art World. Customers
                should contact us with their order details and reason for the
                return before sending any product back.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-[#5b0e2d]">2. Damaged or Incorrect Products</h2>
              <p className="mt-3 leading-7 text-gray-700">
                If an artwork arrives damaged, defective, or different from
                the product ordered, please contact Bhavani's Art World as
                soon as possible and provide photographs of the product and
                packaging. We will review the issue and provide the appropriate
                resolution.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-[#5b0e2d]">3. Custom and Personalized Artwork</h2>
              <p className="mt-3 leading-7 text-gray-700">
                Custom-made and personalized artwork is created specifically
                for the customer and may have different return or cancellation
                conditions. Please confirm the applicable terms before placing
                a custom order.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-[#5b0e2d]">4. Exchanges</h2>
              <p className="mt-3 leading-7 text-gray-700">
                Exchanges are handled according to product eligibility and
                availability. Please contact us with your order details before
                returning a product for exchange.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-[#5b0e2d]">5. Refunds</h2>
              <p className="mt-3 leading-7 text-gray-700">
                For an approved refund, the refund will be processed to the
                original payment method where applicable. The time required for
                the refund to appear may depend on the payment provider or bank.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-[#5b0e2d]">6. Return Shipping</h2>
              <p className="mt-3 leading-7 text-gray-700">
                Return-shipping responsibility depends on the reason for the
                return and the applicable order policy. For damaged, defective,
                or incorrectly supplied products, please contact us before
                arranging the return.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-[#5b0e2d]">7. How to Request a Return or Exchange</h2>
              <p className="mt-3 leading-7 text-gray-700">
                Contact Bhavani's Art World through our{" "}
                <a
                  href="/contact"
                  className="font-semibold text-[#8a173d] underline underline-offset-4"
                >
                  Contact page
                </a>{" "}
                with your order details, the reason for your request, and
                photographs where relevant.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-[#5b0e2d]">8. Policy Updates</h2>
              <p className="mt-3 leading-7 text-gray-700">
                This policy may be updated when our store procedures change.
                The latest version published on this page will contain the
                current policy information.
              </p>
            </section>
            <section className="border-t border-gray-200 pt-6">
              <p className="text-sm leading-6 text-gray-500">
                If you have a question about a specific order, please contact
                Bhavani's Art World before sending a product back.
              </p>
            </section>
          </div>
        </article>
      </Container>
    </main>
  );
};

export default ReturnPolicy;
