import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import CategoryCard from "../ui/CategoryCard";
import { categories } from "../../constants/categories";

const Categories = () => {
  return (
    <section className="section-y bg-white">
      <Container>
        <SectionTitle
          eyebrow="Curated Collections"
          title="Explore Our Collections"
          description="Art inspired by tradition, creativity and timeless beauty."
        />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.id} category={cat} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Categories;
