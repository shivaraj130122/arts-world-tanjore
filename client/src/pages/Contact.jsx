import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import Container from "../components/ui/Container";
import CTABanner from "../components/ui/CTABanner";
import ContactHero from "../components/contact/ContactHero";
import ContactInfo from "../components/contact/ContactInfo";
import ContactForm from "../components/contact/ContactForm";
import LocationSection from "../components/contact/LocationSection";
import ContactFAQ from "../components/contact/ContactFAQ";
import { PageSearchContent } from "../components/seo/SearchLandingContent";
import { CONTACT_INFO } from "../constants";

// Contact.jsx stays a thin page-level composition — each section owns its
// own content and animation, this file only orders them.
const Contact = () => {
  const whatsappNumber = CONTACT_INFO.phone.replace(/[^\d]/g, "");

  return (
    <div>
      <Container className="pt-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-text/50">
          <Link to="/" className="transition hover:text-primary">
            Home
          </Link>
          <FiChevronRight size={12} />
          <span className="text-primary">Contact</span>
        </nav>
      </Container>

      <ContactHero />
      <ContactInfo />

      <Container className="pb-8">
        <ContactForm />
      </Container>

      <Container className="pb-8">
        <CTABanner
          eyebrow="Prefer WhatsApp?"
          title="Chat With Us Directly"
          description="Chat with us directly about artwork, custom designs or questions."
          actions={[
            { label: "Chat on WhatsApp", href: `https://wa.me/${whatsappNumber}`, icon: FaWhatsapp },
          ]}
        />
      </Container>

      <LocationSection />
      <ContactFAQ />

      <PageSearchContent
        title="Contact Bhavani&apos;s Art World"
        links={[
          { to: "/shop", label: "Shop Artwork" },
          { to: "/collections", label: "Explore Collections" },
          { to: "/custom-orders", label: "Custom Artwork" },
        ]}
      >
        Get in touch about Tanjore paintings, fabric paintings, saree border paintings, blouse paintings, handmade gifts, flower bouquets or a custom artwork request.
      </PageSearchContent>

      <Container className="section-y">
        <CTABanner
          eyebrow="Get In Touch"
          title="Have Something Special in Mind?"
          description="Browse our existing collection or tell us about the artwork you're picturing."
          actions={[
            { label: "Explore Our Collection", to: "/shop" },
            { label: "Request Custom Order", to: "/custom-orders", variant: "outline" },
          ]}
        />
      </Container>
    </div>
  );
};

export default Contact;
