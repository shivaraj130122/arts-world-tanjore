export const SEO_KEYWORD_MAP = {
  homepage: {
    primary: [
      "Tanjore paintings",
      "handmade Tanjore paintings",
      "Bhavani's Art World",
    ],
    secondary: [
      "Tanjore paintings online",
      "traditional Indian art",
      "custom artwork",
    ],
  },

  categories: {
    "tanjore-paintings": {
      primary: "Tanjore Paintings",
      secondary: [
        "handmade Tanjore paintings",
        "traditional Tanjore art",
        "Tanjore paintings online",
      ],
      intro:
        "Explore handcrafted Tanjore paintings created with traditional Indian artistry, rich detail, and a timeless decorative character.",
    },

    "fabric-paintings": {
      primary: "Fabric Paintings",
      secondary: [
        "hand-painted fabric paintings",
        "fabric art paintings",
        "handmade fabric art",
      ],
      intro:
        "Discover hand-painted fabric paintings that combine artistic detail, color, and texture for distinctive handmade decor and gifts.",
    },

    "saree-border-painting": {
      primary: "Saree Border Paintings",
      secondary: [
        "hand-painted saree borders",
        "saree border painting",
        "custom saree border designs",
      ],
      intro:
        "Browse hand-painted saree border designs created to add a distinctive artistic touch to traditional Indian drapes and special occasions.",
    },

    "blouse-painting": {
  primary: "Blouse Painting",
  secondary: [
    "blouse painting designs",
    "hand painted blouse designs",
    "custom blouse painting",
    "blouse fabric painting",
  ],
  intro:
    "Explore beautiful blouse painting designs and hand painted blouse artwork created on fabric. Discover custom blouse paintings and traditional Indian-inspired designs for sarees, weddings, and special occasions.",
},

    "blouse-paintings": {
      primary: "Blouse Paintings",
      secondary: [
        "hand-painted blouse designs",
        "blouse painting",
        "custom blouse paintings",
      ],
      intro:
        "Explore custom blouse paintings and hand-painted blouse designs made to bring personalized artwork and detail to your occasion wear.",
    },

    "gifts-crafts": {
      primary: "Handmade Gifts & Crafts",
      secondary: [
        "handmade gifts",
        "handcrafted gifts",
        "traditional Indian crafts",
        "art gifts",
      ],
      intro:
        "Find handmade gifts and crafts created for thoughtful celebrations, memorable occasions, and people who appreciate Indian artistry.",
    },

    "flower-bouquets": {
      primary: "Handmade Flower Bouquets",
      secondary: [
        "handmade flower bouquets",
        "decorative flower bouquets",
        "art flower bouquets",
      ],
      intro:
        "Discover handmade flower bouquets designed as lasting decorative pieces and thoughtful gifts with an artistic touch.",
    },

    "flower-flower-bouquets": {
      primary: "Handmade Flower Bouquets",
      secondary: [
        "handmade flower bouquets",
        "decorative flower bouquets",
        "art flower bouquets",
      ],
      intro:
        "Discover handmade flower bouquets designed as lasting decorative pieces and thoughtful gifts with an artistic touch.",
    },

    "customized-art": {
      primary: "Custom Artwork",
      secondary: [
        "custom Tanjore paintings",
        "personalized artwork",
        "custom portraits",
      ],
      intro:
        "Create personalized artwork made around your idea, occasion, or memory with handcrafted attention to detail.",
    },
  },
};

export const getCategorySeoContent = (slug) =>
  SEO_KEYWORD_MAP.categories[slug] || null;
