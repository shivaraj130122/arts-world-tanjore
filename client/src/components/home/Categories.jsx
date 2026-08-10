import { useEffect, useState } from "react";

import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import CategoryCard from "../ui/CategoryCard";

import { getCategories } from "../../services/categoryService";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getCategories();

        if (isMounted) {
          setCategories(data.categories || []);
        }
      } catch (requestError) {
        console.error(
          "Failed to load categories:",
          requestError
        );

        if (isMounted) {
          setError(
            requestError.message ||
              "Unable to load categories."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section>
      <Container>
        <SectionTitle
          eyebrow="Explore"
          title="Shop by Category"
          description="Discover handcrafted paintings, customized artwork, fabric art, and thoughtful handmade creations."
        />

        {/* Loading */}
        {isLoading && (
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-52 animate-pulse rounded-2xl bg-primary/5"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-primary/10 bg-white p-8 text-center shadow-sm">
            <h3 className="font-heading text-xl font-semibold text-primary">
              Unable to Load Categories
            </h3>

            <p className="mt-2 text-sm text-text/60">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-background transition hover:bg-primary-light"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Categories */}
        {!isLoading && !error && categories.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <CategoryCard
                key={category._id || category.id}
                category={category}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && categories.length === 0 && (
          <div className="mt-12 rounded-2xl border border-primary/10 bg-white p-8 text-center">
            <p className="text-sm text-text/60">
              No categories are available right now.
            </p>
          </div>
        )}
      </Container>
    </section>
  );
};

export default Categories;