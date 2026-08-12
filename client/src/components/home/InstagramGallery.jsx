import { motion } from "framer-motion";
import { FaInstagram } from "react-icons/fa";

import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import Button from "../ui/Button";

import {
  SOCIAL_LINKS,
  INSTAGRAM_HANDLE,
} from "../../constants";

const INSTAGRAM_MEDIA = [
  {
    type: "image",
    src: "/images/home/instagram-1.png",
    alt: "Hand-painted green blouse with peacock artwork",
  },
  {
    type: "image",
    src: "/images/home/instagram-2.png",
    alt: "Hand-painted traditional skirt",
  },
  {
    type: "image",
    src: "/images/home/instagram-3.png",
    alt: "Hand-painted gold blouse with peacock artwork",
  },
  {
    type: "image",
    src: "/images/home/instagram-4.png",
    alt: "Detailed peacock artwork",
  },
  {
    type: "image",
    src: "/images/home/instagram-5.png",
    alt: "Hand-painted gold blouse",
  },
  {
    type: "image",
    src: "/images/home/instagram-6.png",
    alt: "Hand-painted black blouse",
  },
];

const InstagramGallery = () => {
  const instagram = SOCIAL_LINKS.find(
    (social) => social.label === "Instagram"
  );

  const instagramUrl =
    instagram?.url ||
    `https://instagram.com/${INSTAGRAM_HANDLE}`;

  return (
    <section className="section-y">
      <Container>
        <SectionTitle
          eyebrow="Follow The Studio"
          title="Follow Our Art Journey"
          description="See our latest creations, custom artwork and behind-the-scenes moments."
        />

        {/* Instagram Media Gallery */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
          {INSTAGRAM_MEDIA.map((media, index) => (
            <motion.a
              key={media.src}
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{
                opacity: 0,
                scale: 0.92,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
              }}
              viewport={{
                once: true,
                amount: 0.3,
              }}
              transition={{
                duration: 0.4,
                delay: index * 0.06,
              }}
              className="group relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5"
            >
              {/* Image */}
              <img
                src={media.src}
                alt={media.alt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />

              {/* Instagram hover overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-primary/0 opacity-0 transition-all duration-300 group-hover:bg-primary/50 group-hover:opacity-100">
                <FaInstagram
                  size={24}
                  className="text-background"
                />

                <span className="text-xs font-medium text-background">
                  View on Instagram
                </span>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Instagram Button */}
        <div className="mt-8 flex justify-center">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="md"
            >
              <FaInstagram size={16} />
              Follow @{INSTAGRAM_HANDLE}
            </Button>
          </a>
        </div>
      </Container>
    </section>
  );
};

export default InstagramGallery;