import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiSend } from "react-icons/fi";
import Container from "../ui/Container";
import Button from "../ui/Button";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // Frontend-only demo — no email is actually stored on a server yet.
    toast.success("Thank you for subscribing!");
    setEmail("");
  };

  return (
    <section className="section-y bg-secondary/10">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-xl text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary-dark">
            Stay Connected
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-primary md:text-4xl">
            Stay Inspired
          </h2>
          <p className="mt-3 text-sm text-text/60 md:text-base">
            Get updates on new artwork, collections and special creations.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full flex-1 rounded-full border border-primary/20 bg-white px-5 py-3 text-sm outline-none focus:border-primary"
            />
            <Button type="submit" size="lg" className="shrink-0">
              Subscribe <FiSend size={15} />
            </Button>
          </form>
        </motion.div>
      </Container>
    </section>
  );
};

export default Newsletter;
