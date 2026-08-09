import { useState } from "react";
import { motion } from "framer-motion";
import { FiTruck, FiShield, FiHeadphones, FiFeather, FiEdit3 } from "react-icons/fi";
import { classNames } from "../../utils/helpers";

const CARE_POINTS = [
  "Keep away from direct moisture",
  "Avoid harsh cleaning chemicals",
  "Keep artwork away from prolonged direct sunlight",
  "Handle framed artwork carefully",
];

const TRUST_FEATURES = [
  { icon: FiFeather, label: "Handcrafted Artwork" },
  { icon: FiShield, label: "Secure Packaging" },
  { icon: FiEdit3, label: "Custom Creations" },
  { icon: FiHeadphones, label: "Customer Support" },
];

// Builds the Specifications list from whichever optional fields the product
// actually has — nothing fabricated for products missing a given field.
const buildSpecs = (product) => {
  const specs = [];
  if (product.material) specs.push({ label: "Material", value: product.material });
  if (product.style) specs.push({ label: "Style", value: product.style });
  if (product.dimensions) specs.push({ label: "Dimensions", value: product.dimensions });
  if (product.frame) specs.push({ label: "Frame", value: product.frame });
  if (typeof product.handmade === "boolean") {
    specs.push({ label: "Handmade", value: product.handmade ? "Yes" : "No" });
  }
  if (typeof product.customizable === "boolean") {
    specs.push({ label: "Customization", value: product.customizable ? "Available" : "Not available" });
  }
  return specs;
};

const TABS = ["Description", "Specifications", "Shipping & Delivery", "Care Instructions"];

const ProductInformation = ({ product }) => {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const specs = buildSpecs(product);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mt-14"
    >
      <div
        role="tablist"
        aria-label="Product information"
        className="flex flex-wrap gap-2 border-b border-primary/10 pb-1"
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={classNames(
              "rounded-full px-4 py-2 text-sm font-medium transition",
              activeTab === tab
                ? "bg-primary text-background"
                : "text-text/60 hover:bg-primary/10 hover:text-primary"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="py-6" role="tabpanel">
        {activeTab === "Description" && (
          <p className="max-w-2xl text-sm leading-relaxed text-text/70">
            {product.description || "No description available for this piece yet."}
          </p>
        )}

        {activeTab === "Specifications" && (
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {specs.length > 0 ? (
              specs.map((spec) => (
                <div key={spec.label} className="flex justify-between border-b border-primary/5 pb-2 sm:block sm:border-none sm:pb-0">
                  <dt className="text-xs uppercase tracking-wide text-text/40">{spec.label}</dt>
                  <dd className="text-sm font-medium text-text">{spec.value}</dd>
                </div>
              ))
            ) : (
              <p className="text-sm text-text/50">
                Specifications for this piece aren&apos;t listed yet.
              </p>
            )}
          </dl>
        )}

        {activeTab === "Shipping & Delivery" && (
          <div className="max-w-xl space-y-2 text-sm leading-relaxed text-text/70">
            <p className="flex items-start gap-2">
              <FiTruck className="mt-0.5 shrink-0 text-secondary-dark" size={16} />
              Carefully packed for safe delivery.
            </p>
            <p>Delivery timelines may vary based on location.</p>
          </div>
        )}

        {activeTab === "Care Instructions" && (
          <ul className="max-w-xl list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-text/70">
            {CARE_POINTS.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Trust features */}
      <div className="mt-4 grid grid-cols-1 gap-4 border-t border-primary/10 pt-8 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST_FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.label} className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary/15 text-secondary-dark">
                <Icon size={18} />
              </div>
              <span className="text-sm font-medium text-text">{feature.label}</span>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
};

export default ProductInformation;
