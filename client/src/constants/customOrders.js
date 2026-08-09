// Single source of truth for custom-order artwork types. Used by both
// CustomOrderCategories.jsx (the visual cards) and CustomOrderForm.jsx (the
// Artwork Type dropdown) so the list never drifts out of sync between them.
// Kept in constants/ (not the component file) so the component only
// exports a component — required for Fast Refresh to work correctly.

export const ARTWORK_TYPES = [
  { id: "custom-tanjore", title: "Custom Tanjore Painting", desc: "A personalized Tanjore piece in your chosen theme." },
  { id: "portrait", title: "Portrait Artwork", desc: "A hand-painted portrait for a loved one or special memory." },
  { id: "fabric-blouse", title: "Fabric / Blouse Painting", desc: "Custom hand-painted designs on fabric or a blouse piece." },
  { id: "saree-border", title: "Saree Border Design", desc: "A hand-painted border designed for your saree." },
  { id: "gift-art", title: "Personalized Gift Art", desc: "A meaningful, made-to-order piece for gifting." },
  { id: "occasion", title: "Special Occasion Artwork", desc: "Artwork created around a wedding, festival or milestone." },
];

export default ARTWORK_TYPES;
