// Central place for static, app-wide constants.
// Keeping these out of components makes copy edits and future CMS wiring trivial.

export const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Shop", path: "/shop" },
  { label: "Collections", path: "/collections" },
  { label: "Custom Orders", path: "/custom-orders" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

export const FOOTER_QUICK_LINKS = [
  { label: "Home", path: "/" },
  { label: "Shop", path: "/shop" },
  { label: "About Us", path: "/about" },
  { label: "Contact", path: "/contact" },
  { label: "Cart", path: "/cart" },
  { label: "Wishlist", path: "/wishlist" },
];

export const FOOTER_CATEGORIES = [
  { label: "Tanjore Paintings", path: "/shop?category=tanjore-paintings" },
  { label: "Fabric Paintings", path: "/shop?category=fabric-paintings" },
  { label: "Blouse Painting", path: "/shop?category=blouse-painting" },
  { label: "Saree Border Painting", path: "/shop?category=saree-border-painting" },
  { label: "Customized Art", path: "/shop?category=customized-art" },
  { label: "Gifts & Crafts", path: "/shop?category=gifts-crafts" },
];

export const CONTACT_INFO = {
  phone: "+91 9902067179",
  email: "shiva130122@gmail.com",
  address: {
    line1: "Bukkasagara",
    line2: "Jigani",
    city: "Bengaluru",
    state: "Karnataka",
  },
};

export const SOCIAL_LINKS = [
  { label: "Facebook", url: "https://facebook.com", icon: "FaFacebookF" },
  { label: "Instagram", url: "https://instagram.com/tanjore_artby_bhavani", icon: "FaInstagram" },
  { label: "Twitter", url: "https://twitter.com", icon: "FaTwitter" },
  { label: "YouTube", url: "https://youtube.com", icon: "FaYoutube" },
  { label: "WhatsApp", url: "https://wa.me/919902067179", icon: "FaWhatsapp" },
];

export const SITE_NAME = "Bhavani's Art World";
export const SITE_TAGLINE = "Where Colors Tell Stories";
export const SITE_SECONDARY_TAGLINE = "Paintings | Crafts | Creativity";
export const INSTAGRAM_HANDLE = "tanjore_artby_bhavani";
