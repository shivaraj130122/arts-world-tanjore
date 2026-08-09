import { FiImage } from "react-icons/fi";
import { classNames } from "../../utils/helpers";

// Every product currently ships with an empty `image` field (no real
// photography exists yet, and no fake image files should be invented per
// project rules). Rendering `<img src="">` or a path to a file that doesn't
// exist produces a broken-image icon in the browser — this component avoids
// that everywhere a product image appears, falling back to a branded
// placeholder instead.
const ProductImage = ({ src, alt, className = "", iconSize = 22 }) => {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={classNames("h-full w-full object-cover", className)}
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5">
      <FiImage size={iconSize} className="text-primary/25" />
    </div>
  );
};

export default ProductImage;
