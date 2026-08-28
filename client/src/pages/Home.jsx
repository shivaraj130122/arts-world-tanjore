import Hero from "../components/home/Hero";
import BrandIntro from "../components/home/BrandIntro";
import Categories from "../components/home/Categories";
import FeaturedProducts from "../components/home/FeaturedProducts";
import NewArrivals from "../components/home/NewArrivals";
import BestSellers from "../components/home/BestSellers";
import WhyChooseUs from "../components/home/WhyChooseUs";
import TanjoreHeritage from "../components/home/TanjoreHeritage";
import CustomOrderCTA from "../components/home/CustomOrderCTA";
import Testimonials from "../components/home/Testimonials";
import InstagramGallery from "../components/home/InstagramGallery";
import Newsletter from "../components/home/Newsletter";
import ContactCTA from "../components/home/ContactCTA";
import PublicSeoLinks from "../components/seo/PublicSeoLinks";

// Premium homepage for Bhavani's Art World — composed entirely from
// components/home/*. Each section is self-contained (owns its own data +
// animations), so reordering or removing a section is just editing this list.
const Home = () => {
  return (
    <div>
      <Hero />
      <BrandIntro />
      <Categories />
      <FeaturedProducts />
      <NewArrivals />
      <BestSellers />
      <WhyChooseUs />
      <TanjoreHeritage />
      <CustomOrderCTA />
      <Testimonials />
      <InstagramGallery />
      <Newsletter />
      <ContactCTA />
      <PublicSeoLinks />
    </div>
  );
};

export default Home;
