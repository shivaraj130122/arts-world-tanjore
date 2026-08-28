import { Link } from "react-router-dom";
import {
  FiPhone,
  FiMail,
  FiMapPin,
} from "react-icons/fi";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";
import {
  FOOTER_QUICK_LINKS,
  FOOTER_CATEGORIES,
  CONTACT_INFO,
  SOCIAL_LINKS,
  SITE_NAME,
  SITE_TAGLINE,
} from "../../constants";
import logo from "../../assets/images/bhavani-art-world-logo-nav.jpg";

const ICONS = {
  FaFacebookF: FaFacebookF,
  FaInstagram: FaInstagram,
  FaTwitter: FaTwitter,
  FaYoutube: FaYoutube,
  FaWhatsapp: FaWhatsapp,
};

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-secondary/20 bg-primary text-background">
      <div className="container-app grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Company Info */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-secondary/30">
              <img
                src={logo}
                alt={`${SITE_NAME} logo`}
                className="h-full w-full object-cover"
              />
            </span>
            <div className="leading-tight">
              <p className="font-heading text-lg font-bold">{SITE_NAME}</p>
              <p className="text-[11px] uppercase tracking-wide text-secondary">
                {SITE_TAGLINE}
              </p>
            </div>
          </div>
          <p className="text-sm text-background/70">
            Handcrafted Tanjore paintings, custom portraits, and curated gifts —
            bringing timeless South Indian artistry into modern homes.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="mb-4 font-heading text-base font-semibold text-secondary">
            Quick Links
          </h4>
          <ul className="space-y-2">
            {FOOTER_QUICK_LINKS.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="text-sm text-background/70 transition hover:text-secondary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
            <Link to="/collections" className="text-sm text-background/70 transition hover:text-secondary">
              Collections
            </Link>
            <Link to="/custom-orders" className="text-sm text-background/70 transition hover:text-secondary">
              Custom Orders
            </Link>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="mb-4 font-heading text-base font-semibold text-secondary">
            Categories
          </h4>
          <ul className="space-y-2">
            {FOOTER_CATEGORIES.map((cat) => (
              <li key={cat.label}>
                <Link
                  to={cat.path}
                  className="text-sm text-background/70 transition hover:text-secondary"
                >
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="mb-4 font-heading text-base font-semibold text-secondary">
            Contact Us
          </h4>
          <ul className="space-y-3 text-sm text-background/70">
            <li className="flex items-start gap-2">
              <FiPhone className="mt-0.5 shrink-0 text-secondary" />
              <a href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, "")}`} className="hover:text-secondary">
                {CONTACT_INFO.phone}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <FiMail className="mt-0.5 shrink-0 text-secondary" />
              <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-secondary">
                {CONTACT_INFO.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <FiMapPin className="mt-0.5 shrink-0 text-secondary" />
              <span>
                {CONTACT_INFO.address.line1}, {CONTACT_INFO.address.line2},
                <br />
                {CONTACT_INFO.address.city}, {CONTACT_INFO.address.state}
              </span>
            </li>
          </ul>

          <div className="mt-5 flex items-center gap-3">
            {SOCIAL_LINKS.map((social) => {
              const Icon = ICONS[social.icon];
              return (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="grid h-9 w-9 place-items-center rounded-full bg-background/10 text-background transition hover:bg-secondary hover:text-primary"
                >
                  {Icon ? <Icon size={14} /> : null}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-background/10 py-5">
        <p className="container-app text-center text-xs text-background/60">
          © {year} {SITE_NAME} — {SITE_TAGLINE}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
