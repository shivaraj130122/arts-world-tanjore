import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import Button from "../ui/Button";
import { submitContactMessage } from "../../services/contactService";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (formData) => {
    try {
      await submitContactMessage(formData);

      toast.success(
        "Thank you! Your message has been received."
      );

      reset();
    } catch (error) {
      console.error(
        "Contact form submission failed:",
        error
      );

      toast.error(
        error.message ||
          "Unable to send your message. Please try again."
      );
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5 rounded-3xl border border-primary/10 bg-white p-6 sm:p-8"
    >
      {/* Name */}
      <div>
        <label
          htmlFor="contact-name"
          className="mb-1.5 block text-sm font-medium text-text"
        >
          Full Name
        </label>

        <input
          id="contact-name"
          type="text"
          {...register("name", {
            required: "Please enter your name",
            minLength: {
              value: 2,
              message:
                "Name must contain at least 2 characters",
            },
            maxLength: {
              value: 100,
              message:
                "Name must be less than 100 characters",
            },
          })}
          aria-invalid={errors.name ? "true" : "false"}
          className="w-full rounded-lg border border-primary/20 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
        />

        {errors.name && (
          <p className="mt-1 text-xs text-red-600">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email + Phone */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Email */}
        <div>
          <label
            htmlFor="contact-email"
            className="mb-1.5 block text-sm font-medium text-text"
          >
            Email
          </label>

          <input
            id="contact-email"
            type="email"
            {...register("email", {
              required: "Please enter your email",
              pattern: {
                value: EMAIL_PATTERN,
                message:
                  "Please enter a valid email address",
              },
            })}
            aria-invalid={
              errors.email ? "true" : "false"
            }
            className="w-full rounded-lg border border-primary/20 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
          />

          {errors.email && (
            <p className="mt-1 text-xs text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="contact-phone"
            className="mb-1.5 block text-sm font-medium text-text"
          >
            Phone{" "}
            <span className="font-normal text-text/40">
              (optional)
            </span>
          </label>

          <input
            id="contact-phone"
            type="tel"
            {...register("phone", {
              maxLength: {
                value: 30,
                message:
                  "Phone number is too long",
              },
            })}
            className="w-full rounded-lg border border-primary/20 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
          />

          {errors.phone && (
            <p className="mt-1 text-xs text-red-600">
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      {/* Subject */}
      <div>
        <label
          htmlFor="contact-subject"
          className="mb-1.5 block text-sm font-medium text-text"
        >
          Subject{" "}
          <span className="font-normal text-text/40">
            (optional)
          </span>
        </label>

        <input
          id="contact-subject"
          type="text"
          {...register("subject", {
            maxLength: {
              value: 200,
              message:
                "Subject must be less than 200 characters",
            },
          })}
          className="w-full rounded-lg border border-primary/20 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
        />

        {errors.subject && (
          <p className="mt-1 text-xs text-red-600">
            {errors.subject.message}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="contact-message"
          className="mb-1.5 block text-sm font-medium text-text"
        >
          Message
        </label>

        <textarea
          id="contact-message"
          rows={5}
          {...register("message", {
            required: "Please enter a message",
            minLength: {
              value: 5,
              message:
                "Message must contain at least 5 characters",
            },
            maxLength: {
              value: 5000,
              message:
                "Message must be less than 5000 characters",
            },
          })}
          aria-invalid={
            errors.message ? "true" : "false"
          }
          className="w-full rounded-lg border border-primary/20 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
        />

        {errors.message && (
          <p className="mt-1 text-xs text-red-600">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full sm:w-auto"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </motion.form>
  );
};

export default ContactForm;