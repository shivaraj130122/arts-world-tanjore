import { Link } from "react-router-dom";
import { SEO_KEYWORD_MAP, getCategorySeoContent } from "./seoContent";

const RelatedLinks = ({ links }) => (
  <nav aria-label="Related artwork pages" className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
    {links.map((link) => (
      <Link
        key={link.to}
        to={link.to}
        className="text-sm font-semibold text-primary underline decoration-primary/25 underline-offset-4 hover:text-secondary-dark"
      >
        {link.label}
      </Link>
    ))}
  </nav>
);

export const HomepageSearchContent = () => (
  <section className="border-t border-primary/10 bg-background/60 py-12" aria-labelledby="search-intent-home">
    <div className="container-app">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary-dark">Handcrafted Indian Art</p>
      <h2 id="search-intent-home" className="mt-2 font-heading text-2xl font-semibold text-primary sm:text-3xl">
        Tanjore Paintings & Handmade Art from Bhavani&apos;s Art World
      </h2>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-text/65 sm:text-base">
        Bhavani&apos;s Art World brings together handcrafted Tanjore paintings, fabric paintings, saree border paintings, blouse paintings, handmade gifts and custom artwork. Explore the collections to find traditional Indian art and personalized creations made with care.
      </p>
      <RelatedLinks links={[
        { to: "/shop?category=tanjore-paintings", label: "Tanjore Paintings" },
        { to: "/shop?category=fabric-paintings", label: "Fabric Paintings" },
        { to: "/shop?category=saree-border-painting", label: "Saree Border Paintings" },
        { to: "/shop?category=blouse-painting", label: "Blouse Paintings" },
        { to: "/shop?category=gifts-crafts", label: "Handmade Gifts & Crafts" },
        { to: "/custom-orders", label: "Custom Artwork" },
      ]} />
    </div>
  </section>
);

export const CategorySearchContent = ({ slug }) => {
  const content = getCategorySeoContent(slug);
  if (!content) return null;

  return (
    <section className="mt-10 rounded-3xl border border-primary/10 bg-white p-6 shadow-sm sm:p-8" aria-labelledby="category-search-content">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary-dark">Bhavani&apos;s Art World</p>
      <h2 id="category-search-content" className="mt-2 font-heading text-2xl font-semibold text-primary">
        {content.primary}
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-text/65 sm:text-base">
        {content.intro}
      </p>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-text/65">
        {content.secondary.join(" • ")}
      </p>
      <RelatedLinks links={[
        { to: "/shop", label: "Shop All Artwork" },
        { to: "/collections", label: "Explore Collections" },
        { to: "/custom-orders", label: "Request Custom Artwork" },
      ]} />
    </section>
  );
};

export const PageSearchContent = ({ title, children, links = [] }) => (
  <section className="border-t border-primary/10 bg-background/60 py-12" aria-labelledby="page-search-content">
    <div className="container-app">
      <h2 id="page-search-content" className="font-heading text-2xl font-semibold text-primary sm:text-3xl">{title}</h2>
      <div className="mt-4 max-w-3xl text-sm leading-7 text-text/65 sm:text-base">{children}</div>
      {links.length > 0 && <RelatedLinks links={links} />}
    </div>
  </section>
);

export { SEO_KEYWORD_MAP };
