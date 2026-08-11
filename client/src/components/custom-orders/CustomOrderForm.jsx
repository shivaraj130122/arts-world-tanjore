import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiUpload, FiX, FiImage } from "react-icons/fi";
import Container from "../ui/Container";
import Button from "../ui/Button";
import { ARTWORK_TYPES } from "../../constants/customOrders";
import { PRICE_RANGES } from "../../utils/productFilters";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Budget dropdown reuses the exact price buckets already defined for Shop
// filtering, minus the "All Prices" option — one source of truth for price
// ranges across the whole app.
const BUDGET_OPTIONS = PRICE_RANGES.filter((r) => r.id !== "all");

// Frontend-only demo. The reference image is previewed locally via
// URL.createObjectURL and never uploaded anywhere — no Cloudinary, no
// backend storage exists yet.
const CustomOrderForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [referenceImage, setReferenceImage] = useState(null); // { file, previewUrl }
  const [imageError, setImageError] = useState("");

  // Revoke the object URL whenever it's replaced or the component unmounts,
  // so we don't leak memory across repeated selections.
  useEffect(() => {
    return () => {
      if (referenceImage?.previewUrl) URL.revokeObjectURL(referenceImage.previewUrl);
    };
  }, [referenceImage]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setImageError("Please upload a JPG, PNG, or WEBP image.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setImageError("That image is too large. Please choose a file under 5MB.");
      return;
    }

    setImageError("");
    if (referenceImage?.previewUrl) URL.revokeObjectURL(referenceImage.previewUrl);
    setReferenceImage({ file, previewUrl: URL.createObjectURL(file) });
  };

  const handleRemoveImage = () => {
    if (referenceImage?.previewUrl) URL.revokeObjectURL(referenceImage.previewUrl);
    setReferenceImage(null);
    setImageError("");
  };

 const onSubmit = async (data) => {
  const whatsappNumber = "919880556398";

  const message = `
*New Custom Artwork Request*

*Customer Details*
Name: ${data.name}
Phone / WhatsApp: ${data.phone}
Email: ${data.email}

*Artwork Details*
Artwork Type: ${data.artworkType}
Preferred Size: ${data.preferredSize || "Not specified"}
Preferred Style: ${data.preferredStyle || "Not specified"}
Budget: ${data.budget || "No preference"}
Occasion: ${data.occasion || "Not specified"}

 *Requirements*
${data.details}

Reference Image:
${
  referenceImage
    ? "A reference image has been selected. Could you please resend the image here on WhatsApp so we can review it along with your requirements?"
    : "No reference image provided."
}
`.trim();

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;

  window.open(whatsappUrl, "_blank", "noopener,noreferrer");

  toast.success(
    "Request prepared. WhatsApp is opening with your details."
  );

  reset();
  handleRemoveImage();
};

  return (
    <section id="custom-order-form" className="section-y scroll-mt-20">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-14">
          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5 rounded-3xl border border-primary/10 bg-white p-6 lg:col-span-3 sm:p-8"
          >
            <h2 className="font-heading text-xl font-semibold text-primary">
              Tell Us About Your Idea
            </h2>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="co-name" className="mb-1.5 block text-sm font-medium text-text">
                  Full Name
                </label>
                <input
                  id="co-name"
                  {...register("name", { required: "Please enter your name" })}
                  aria-invalid={errors.name ? "true" : "false"}
                  className="w-full rounded-lg border border-primary/20 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
              </div>

              <div>
                <label htmlFor="co-phone" className="mb-1.5 block text-sm font-medium text-text">
                  Phone / WhatsApp
                </label>
                <input
                  id="co-phone"
                  type="tel"
                  {...register("phone", { required: "Please enter a phone number" })}
                  aria-invalid={errors.phone ? "true" : "false"}
                  className="w-full rounded-lg border border-primary/20 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="co-email" className="mb-1.5 block text-sm font-medium text-text">
                Email
              </label>
              <input
                id="co-email"
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
              <label htmlFor="co-type" className="mb-1.5 block text-sm font-medium text-text">
                Artwork Type
              </label>
              <select
                id="co-type"
                {...register("artworkType", { required: "Please choose an artwork type" })}
                aria-invalid={errors.artworkType ? "true" : "false"}
                defaultValue=""
                className="w-full rounded-lg border border-primary/20 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
              >
                <option value="" disabled>
                  Select an artwork type
                </option>
                {ARTWORK_TYPES.map((type) => (
                  <option key={type.id} value={type.title}>
                    {type.title}
                  </option>
                ))}
              </select>
              {errors.artworkType && (
                <p className="mt-1 text-xs text-red-600">{errors.artworkType.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="co-size" className="mb-1.5 block text-sm font-medium text-text">
                  Preferred Size <span className="font-normal text-text/40">(optional)</span>
                </label>
                <input
                  id="co-size"
                  placeholder="e.g. 12 x 16 inches"
                  {...register("preferredSize")}
                  className="w-full rounded-lg border border-primary/20 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="co-style" className="mb-1.5 block text-sm font-medium text-text">
                  Preferred Style <span className="font-normal text-text/40">(optional)</span>
                </label>
                <input
                  id="co-style"
                  placeholder="e.g. Traditional gold foil"
                  {...register("preferredStyle")}
                  className="w-full rounded-lg border border-primary/20 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="co-budget" className="mb-1.5 block text-sm font-medium text-text">
                  Budget Range <span className="font-normal text-text/40">(optional)</span>
                </label>
                <select
                  id="co-budget"
                  {...register("budget")}
                  defaultValue=""
                  className="w-full rounded-lg border border-primary/20 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
                >
                  <option value="">No preference</option>
                  {BUDGET_OPTIONS.map((range) => (
                    <option key={range.id} value={range.label}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="co-occasion" className="mb-1.5 block text-sm font-medium text-text">
                  Occasion <span className="font-normal text-text/40">(optional)</span>
                </label>
                <input
                  id="co-occasion"
                  placeholder="e.g. Anniversary, Housewarming"
                  {...register("occasion")}
                  className="w-full rounded-lg border border-primary/20 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="co-details" className="mb-1.5 block text-sm font-medium text-text">
                Description / Requirements
              </label>
              <textarea
                id="co-details"
                rows={5}
                placeholder="Tell us about your idea — theme, colors, inspiration, deadline..."
                {...register("details", { required: "Please share some details about your idea" })}
                aria-invalid={errors.details ? "true" : "false"}
                className="w-full rounded-lg border border-primary/20 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
              {errors.details && <p className="mt-1 text-xs text-red-600">{errors.details.message}</p>}
            </div>

            {/* Reference image */}
            <div>
              <span className="mb-1.5 block text-sm font-medium text-text">
                Reference Image <span className="font-normal text-text/40">(optional)</span>
              </span>

              {referenceImage ? (
                <div className="flex items-center gap-4 rounded-lg border border-primary/20 bg-background p-3">
                  <img
                    src={referenceImage.previewUrl}
                    alt="Reference preview"
                    className="h-16 w-16 shrink-0 rounded-md object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text">
                      {referenceImage.file.name}
                    </p>
                    <p className="text-xs text-text/50">
                      {(referenceImage.file.size / (1024 * 1024)).toFixed(1)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    aria-label="Remove reference image"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-text/50 hover:bg-red-50 hover:text-red-600"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="co-image"
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-primary/25 bg-background px-4 py-8 text-center transition hover:border-secondary"
                >
                  <FiUpload size={20} className="text-primary/50" />
                  <span className="text-sm text-text/60">
                    <span className="font-medium text-primary">Click to upload</span> a reference image
                  </span>
                  <span className="text-xs text-text/40">JPG, PNG, or WEBP — up to 5MB</span>
                  <input
                    id="co-image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>
              )}
              {imageError && <p className="mt-1.5 text-xs text-red-600">{imageError}</p>}
            </div>

            <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? "Submitting..." : "Submit Custom Order Request"}
            </Button>
          </motion.form>

          {/* Side visual / info */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
  className="lg:col-span-2"
>
  {/* Custom artwork collage */}
  <div className="overflow-hidden rounded-3xl border border-primary/10 bg-[#fff8ef] shadow-sm">
    <img
      src="/images/custom-orders-collage.png"
      alt="Custom artwork creations"
      className="block h-auto w-full object-contain"
    />
  </div>

  {/* Reference information */}
  <div className="mt-6 rounded-2xl border border-secondary/30 bg-secondary/10 p-5">
    <p className="flex items-center gap-2 text-sm font-semibold text-primary">
      <FiImage size={15} /> Sharing a reference helps
    </p>

    <p className="mt-1.5 text-sm text-text/60">
      A photo, sketch, or even a rough idea gives us a starting
      point — it's optional, but it helps us understand your
      vision faster.
    </p>
  </div>
</motion.div>
          
        </div>
      </Container>
    </section>
  );
};

export default CustomOrderForm;
