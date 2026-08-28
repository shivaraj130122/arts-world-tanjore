import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import Container from "../components/ui/Container";
import CTABanner from "../components/ui/CTABanner";
import CustomOrderHero from "../components/custom-orders/CustomOrderHero";
import CustomOrderSteps from "../components/custom-orders/CustomOrderSteps";
import CustomOrderCategories from "../components/custom-orders/CustomOrderCategories";
import CustomOrderForm from "../components/custom-orders/CustomOrderForm";
import CustomOrderOptions from "../components/custom-orders/CustomOrderOptions";
import CustomOrderBenefits from "../components/custom-orders/CustomOrderBenefits";
import CustomOrderFAQ from "../components/custom-orders/CustomOrderFAQ";
import { PageSearchContent } from "../components/seo/SearchLandingContent";
import { CONTACT_INFO } from "../constants";

// CustomOrders.jsx stays a thin page-level composition — each section owns
// its own content and animation, this file only orders them.
const CustomOrders = () => {
  const whatsappNumber = CONTACT_INFO.phone.replace(/[^\d]/g, "");

  return (
    <div>
      <Container className="pt-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-text/50">
          <Link to="/" className="transition hover:text-primary">
            Home
          </Link>
          <FiChevronRight size={12} />
          <span className="text-primary">Custom Orders</span>
        </nav>
      </Container>

      <CustomOrderHero />
      <CustomOrderSteps />
      <CustomOrderCategories />
      <CustomOrderForm />
      <CustomOrderOptions />
      <CustomOrderBenefits />

      <Container className="pb-8">
        <CTABanner
          eyebrow="Prefer WhatsApp?"
          title="Discuss Your Idea Directly"
          description="Prefer to talk it through? Chat with us directly on WhatsApp about your custom artwork idea."
          actions={[
            { label: "Chat on WhatsApp", href: `https://wa.me/${whatsappNumber}`, icon: FaWhatsapp },
          ]}
        />
      </Container>

      <CustomOrderFAQ />

      <PageSearchContent
        title="Custom Tanjore Paintings & Personalized Artwork"
        links={[
          { to: "/shop?category=tanjore-paintings", label: "Browse Tanjore Paintings" },
          { to: "/shop?category=blouse-painting", label: "Blouse Paintings" },
          { to: "/shop?category=saree-border-painting", label: "Saree Border Paintings" },
          { to: "/contact", label: "Contact Bhavani&apos;s Art World" },
        ]}
      >
        Request a personalized creation for a meaningful memory, celebration or gifting occasion. Custom options include Tanjore paintings, portraits, fabric or blouse painting, saree border designs and personalized gift art.
      </PageSearchContent>

      <Container className="section-y">
        <CTABanner
          eyebrow="Ready When You Are"
          title="Let's Bring Your Idea to Life"
          description="Browse our existing collection for inspiration, or jump straight into your custom request."
          actions={[
            { label: "Explore Our Collection", to: "/shop" },
            { label: "Start Your Order", scrollTo: "custom-order-form", variant: "outline" },
          ]}
        />
      </Container>
    </div>
  );
};

export default CustomOrders;
