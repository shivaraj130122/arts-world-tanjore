import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Button from "../ui/Button";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Frontend-only demo submission — no backend/email API exists yet, so this
// only shows a success toast and resets the form. Wire to a real endpoint
// once one exists.
const ContactForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    toast.success("Thank you! Your message has been received.");
    reset();
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5 rounded-3xl border border-primary/10 bg-white p-6 sm:p-8"
    >
      <div>
        <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-text">
          Full Name
        </label>
        <input
          id="contact-name"
          {...register("name", { required: "Please enter your name" })}
          aria-invalid={errors.name ? "true" : "false"}
          className="w-full rounded-lg border border-primary/20 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-text">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            {...register("email", {
              required: "Please enter your email",
              pattern: { value: EMAIL_PATTERN, message: "Please enter a valid email address" },
            })}
            aria-invalid={errors.email ? "true" : "false"}
            className="w-full rounded-lg border border-primary/20 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="contact-phone" className="mb-1.5 block text-sm font-medium text-text">
            Phone <span className="font-normal text-text/40">(optional)</span>
          </label>
          <input
            id="contact-phone"
            type="tel"
            {...register("phone")}
            className="w-full rounded-lg border border-primary/20 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className="mb-1.5 block text-sm font-medium text-text">
          Subject <span className="font-normal text-text/40">(optional)</span>
        </label>
        <input
          id="contact-subject"
          {...register("subject")}
          className="w-full rounded-lg border border-primary/20 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-text">
          Message
        </label>
        <textarea
          id="contact-message"
          rows={5}
          {...register("message", { required: "Please enter a message" })}
          aria-invalid={errors.message ? "true" : "false"}
          className="w-full rounded-lg border border-primary/20 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
        {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>}
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </motion.form>
  );
};

export default ContactForm;
