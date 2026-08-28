import { Link } from "react-router-dom";

const LINKS = [
  { to: "/shop", label: "Shop Tanjore Paintings" },
  { to: "/collections", label: "Explore Art Collections" },
  { to: "/custom-orders", label: "Request Custom Artwork" },
  { to: "/about", label: "About Bhavani's Art World" },
  { to: "/contact", label: "Contact Us" },
];

const PublicSeoLinks = () => (
  <section aria-labelledby="explore-artwork-links" className="border-t border-primary/10 bg-background/60 py-10">
    <div className="container-app">
      <h2 id="explore-artwork-links" className="font-heading text-xl font-semibold text-primary">
        Explore Bhavani&apos;s Art World
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-text/60">
        Browse handcrafted Tanjore paintings, collections, custom artwork and ways to get in touch.
      </p>
      <nav aria-label="Public artwork links" className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
        {LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="text-sm font-semibold text-primary underline decoration-primary/30 underline-offset-4 transition hover:text-secondary-dark"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  </section>
);

export default PublicSeoLinks;
