import { useEffect } from "react";

// Calls onClose when Escape is pressed, only while isActive is true.
// Used by simple modal/drawer overlays (Quick View, mobile filter drawer)
// that just need Escape-to-close — components with extra keyboard behavior
// (like the image lightbox's arrow-key navigation) keep their own handler.
export const useEscapeKey = (onClose, isActive) => {
  useEffect(() => {
    if (!isActive) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isActive, onClose]);
};
