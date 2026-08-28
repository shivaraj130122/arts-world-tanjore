// Google Analytics 4
// Set VITE_GA_MEASUREMENT_ID in client/.env.local for local development
// and in the frontend deployment environment for production.
//
// Example:
// VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

export const initAnalytics = () => {
  if (!measurementId || typeof window === "undefined") {
    return;
  }

  if (window.__AW_GA_INITIALIZED__) {
    return;
  }

  window.__AW_GA_INITIALIZED__ = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };

  window.gtag("js", new Date());
  window.gtag("config", measurementId);

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
    measurementId
  )}`;

  document.head.appendChild(script);
};

export const trackEvent = (eventName, parameters = {}) => {
  if (
    typeof window !== "undefined" &&
    typeof window.gtag === "function"
  ) {
    window.gtag("event", eventName, parameters);
  }
};
