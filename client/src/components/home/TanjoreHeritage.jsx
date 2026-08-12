import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiPlay } from "react-icons/fi";

import Container from "../ui/Container";
import Button from "../ui/Button";

const TanjoreHeritage = () => {
  return (
    <section className="section-y bg-white">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Image / Video */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
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
              duration: 0.6,
              ease: "easeOut",
            }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-secondary/15 to-primary/5">
              {/* Main Tanjore Art Image */}
              <img
                src="/images/home/tanjore-heritage.jpeg"
                alt="Traditional Tanjore artwork"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />

              {/* Soft overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />

              {/* Video indicator */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-primary shadow-sm backdrop-blur-sm">
                <FiPlay size={13} />
                Traditional Tanjore Art
              </div>
            </div>

            {/* Decorative circle */}
            <div className="absolute -bottom-4 -right-4 h-20 w-20 rounded-full border border-secondary/40 sm:-bottom-6 sm:-right-6 sm:h-28 sm:w-28" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{
              opacity: 0,
              y: 24,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.4,
            }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
              delay: 0.1,
            }}
            className="order-1 lg:order-2"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary-dark">
              Our Craft
            </span>

            <h2 className="mt-3 font-heading text-3xl font-bold text-primary md:text-4xl">
              The Beauty of Tanjore Art
            </h2>

            <p className="mt-5 text-sm leading-relaxed text-text/70 md:text-base">
              Tanjore art is inspired by India's rich artistic
              traditions, known for detailed craftsmanship, vibrant
              colors and ornamental beauty. Each painting is built up
              in layers — from the base sketch to gold-foil work and
              fine detailing — a process that rewards patience and a
              steady hand. At{" "}
              <span className="font-semibold text-primary">
                Bhavani's Art World
              </span>
              , this same care is carried into every piece we create.
            </p>

            <Link
              to="/about"
              className="mt-8 inline-block"
            >
              <Button size="lg">
                Learn More
                <FiArrowRight size={16} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default TanjoreHeritage;