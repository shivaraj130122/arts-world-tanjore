import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import CategoryCard from "../ui/CategoryCard";

import { getCategories } from "../../services/categoryService";

const AboutCategories = () => {
  const navigate = useNavigate();
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
          "Failed to load about categories:",
          requestError
        );

        if (isMounted) {
          setError(
            requestError?.response?.data?.message ||
              requestError?.message ||
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
    <section className="section-y bg-white">
      <Container>
        <SectionTitle
          eyebrow="What We Create"
          title="Our Art & Craft Categories"
        />

        {/* Loading */}
        {isLoading && (
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-[430px] animate-pulse rounded-3xl bg-primary/5"
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
            {categories.map((category, index) => {
              const categorySlug =
                category.slug || category.id || category._id;

              const openCategory = () => {
                if (!categorySlug) return;

                navigate(
                  `/shop?category=${encodeURIComponent(
                    categorySlug
                  )}`
                );
              };

              return (
                <div
                  key={category._id || category.id}
                  role="link"
                  tabIndex={0}
                  onClick={openCategory}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" ||
                      event.key === " "
                    ) {
                      event.preventDefault();
                      openCategory();
                    }
                  }}
                  className="cursor-pointer rounded-3xl outline-none transition focus-visible:ring-2 focus-visible:ring-primary/40"
                  aria-label={`Explore ${category.title || "category"}`}
                >
                  <CategoryCard
                    category={category}
                    index={index}
                  />
                </div>
              );
            })}
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

export default AboutCategories;