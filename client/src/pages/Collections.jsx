import { Link } from "react-router-dom";
import { FiArrowRight, FiImage } from "react-icons/fi";
import { categories } from "../constants/categories";

const collectionImages = {
  "tanjore-paintings": {
    title: "Tanjore Paintings",
    label: "Traditional Heritage",
    gradient: "from-[#f4e4c1] via-[#ead2a2] to-[#d6b36a]",
  },

  "fabric-paintings": {
    title: "Fabric Paintings",
    label: "Hand Painted",
    gradient: "from-[#eadfd5] via-[#d9c3b5] to-[#b99682]",
  },

  "blouse-painting": {
    title: "Blouse Painting",
    label: "Custom Designs",
    gradient: "from-[#ead7df] via-[#d8b7c5] to-[#b78398]",
  },

  "saree-border-painting": {
    title: "Saree Border Painting",
    label: "Elegant Details",
    gradient: "from-[#e8dfc7] via-[#d8c894] to-[#b9a45b]",
  },

  "customized-art": {
    title: "Customized Art",
    label: "Made For You",
    gradient: "from-[#ddd9e8] via-[#c7bfd8] to-[#a89abf]",
  },

  "gifts-crafts": {
    title: "Gifts & Crafts",
    label: "Thoughtful Gifting",
    gradient: "from-[#ead8c9] via-[#d8b69d] to-[#b98b6c]",
  },
};

const Collections = () => {
  return (
    <main className="container-app section-y">
      {/* Page Header */}
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary-dark">
          Bhavani's Art World
        </p>

        <h1 className="mt-3 font-heading text-4xl font-bold text-primary sm:text-5xl">
          Our Collections
        </h1>

        <p className="mt-4 text-base leading-7 text-text/65 sm:text-lg">
          Discover our carefully curated collections of traditional Tanjore
          paintings, handmade fabric art, personalized creations, and
          thoughtful gifts.
        </p>
      </div>

      {/* Collection Grid */}
      <div className="mt-12 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const visual = collectionImages[category.slug];

          return (
            <article
              key={category.id}
              className="group overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Collection Image Area */}
              <div
                className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${
                  visual?.gradient ||
                  "from-background via-white to-secondary/20"
                }`}
              >
                {/* Decorative artwork placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/60 bg-white/25 backdrop-blur-sm transition-transform duration-500 group-hover:scale-110">
                    <FiImage
                      size={34}
                      className="text-primary/60"
                    />
                  </div>
                </div>

                {/* Decorative circles */}
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full border border-white/30" />
                <div className="absolute -bottom-14 -left-10 h-36 w-36 rounded-full border border-white/30" />

                {/* Label */}
                <div className="absolute left-5 top-5 rounded-full bg-white/85 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary backdrop-blur-sm">
                  {visual?.label || "Collection"}
                </div>

                {/* Image coming soon */}
                <div className="absolute bottom-4 left-0 right-0 text-center text-xs font-medium uppercase tracking-widest text-primary/55">
                  Artwork Collection
                </div>
              </div>

              {/* Collection Information */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-heading text-xl font-semibold text-primary">
                      {category.title}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-text/60">
                      {category.description}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-secondary/15 px-3 py-1 text-xs font-semibold text-secondary-dark">
                    {category.itemCount} items
                  </span>
                </div>

                {/* Explore */}
                <Link
                  to={`/shop?category=${category.slug}`}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-secondary-dark"
                >
                  Explore Collection
                  <FiArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <section className="mt-16 overflow-hidden rounded-3xl border border-secondary/30 bg-secondary/10 p-8 sm:p-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary-dark">
              Looking for something special?
            </p>

            <h2 className="mt-2 font-heading text-2xl font-semibold text-primary sm:text-3xl">
              Create a Personalized Artwork
            </h2>

            <p className="mt-2 text-sm leading-6 text-text/65 sm:text-base">
              Have a special idea in mind? Explore our customized artwork
              options and create something made especially for you.
            </p>
          </div>

          <Link
            to="/custom-orders"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-background transition hover:bg-primary-light"
          >
            Custom Order
            <FiArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Collections;