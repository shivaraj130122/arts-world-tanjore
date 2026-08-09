import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import Container from "../components/ui/Container";
import CTABanner from "../components/ui/CTABanner";
import AboutHero from "../components/about/AboutHero";
import BrandStory from "../components/about/BrandStory";
import ArtisticPhilosophy from "../components/about/ArtisticPhilosophy";
import AboutCategories from "../components/about/AboutCategories";
import CraftsmanshipProcess from "../components/about/CraftsmanshipProcess";
import WhyUs from "../components/about/WhyUs";
import CustomArtStory from "../components/about/CustomArtStory";

// About.jsx stays a thin page-level composition — each section owns its
// own content and animation, this file only orders them.
const About = () => {
  return (
    <div>
      <Container className="pt-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-text/50">
          <Link to="/" className="transition hover:text-primary">
            Home
          </Link>
          <FiChevronRight size={12} />
          <span className="text-primary">About</span>
        </nav>
      </Container>

      <AboutHero />
      <BrandStory />
      <ArtisticPhilosophy />
      <AboutCategories />
      <CraftsmanshipProcess />
      <WhyUs />
      <CustomArtStory />

      <Container className="section-y">
        <CTABanner
          eyebrow="Get In Touch"
          title="Let's Create Something Meaningful"
          description="Whether you're browsing our collection or dreaming up something custom, we're here to help bring it to life."
          actions={[
            { label: "Explore Our Art", to: "/shop" },
            { label: "Request Custom Artwork", to: "/custom-orders", variant: "outline" },
          ]}
        />
      </Container>
    </div>
  );
};

export default About;
