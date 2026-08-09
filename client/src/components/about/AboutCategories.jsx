import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import CategoryCard from "../ui/CategoryCard";
import { categories } from "../../constants/categories";

// Reuses the exact same CategoryCard + categories data already powering the
// Home page's Categories section — no second category data source.
const AboutCategories = () => {
  return (
    <section className="section-y bg-white">
      <Container>
        <SectionTitle eyebrow="What We Create" title="Our Art & Craft Categories" />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.id} category={cat} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default AboutCategories;
