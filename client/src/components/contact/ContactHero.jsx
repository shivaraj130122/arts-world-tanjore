import { motion } from "framer-motion";
import Container from "../ui/Container";

const ContactHero = () => {
  return (
    <section className="bg-primary py-14 text-background sm:py-16">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto max-w-xl text-center"
        >
          <h1 className="font-heading text-3xl font-bold sm:text-4xl">Let&apos;s Connect</h1>
          <p className="mt-3 text-sm text-background/75 md:text-base">
            Have a question about an artwork, custom order or something
            special you&apos;re looking for? We&apos;d love to hear from you.
          </p>
        </motion.div>
      </Container>
    </section>
  );
};

export default ContactHero;
