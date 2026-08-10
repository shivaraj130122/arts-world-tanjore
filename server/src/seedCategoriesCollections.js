const dotenv = require("dotenv");
const connectDB = require("./config/db");

const Category = require("./models/Category");
const Collection = require("./models/Collection");

dotenv.config();

const categories = [
  {
    _id: "cat-tanjore-paintings",
    title: "Tanjore Paintings",
    description:
      "Classic gold-foil Tanjore art, rich in color and detail.",
    slug: "tanjore-paintings",
    itemCount: 6,
    image: "",
    isActive: true,
  },
  {
    _id: "cat-fabric-paintings",
    title: "Fabric Paintings",
    description:
      "Hand-painted fabric art blending color with texture.",
    slug: "fabric-paintings",
    itemCount: 4,
    image: "",
    isActive: true,
  },
  {
    _id: "cat-blouse-painting",
    title: "Blouse Painting",
    description:
      "Custom hand-painted blouse designs for every occasion.",
    slug: "blouse-painting",
    itemCount: 3,
    image: "",
    isActive: true,
  },
  {
    _id: "cat-saree-border-painting",
    title: "Saree Border Painting",
    description:
      "Intricate hand-painted borders that elevate every drape.",
    slug: "saree-border-painting",
    itemCount: 2,
    image: "",
    isActive: true,
  },
  {
    _id: "cat-customized-art",
    title: "Customized Art",
    description:
      "Personalized portraits and made-to-order artwork.",
    slug: "customized-art",
    itemCount: 3,
    image: "",
    isActive: true,
  },
  {
    _id: "cat-gifts-crafts",
    title: "Gifts & Crafts",
    description:
      "Curated handmade gifts and craft pieces for every occasion.",
    slug: "gifts-crafts",
    itemCount: 2,
    image: "",
    isActive: true,
  },
];

const collections = [
  {
    _id: "collection-divine-art",
    title: "Divine Art",
    description:
      "Sacred Tanjore artworks featuring traditional deities.",
    slug: "divine-art",
    image: "",
    category: "Tanjore Paintings",
    isActive: true,
    sortOrder: 1,
  },
  {
    _id: "collection-tanjore-classics",
    title: "Tanjore Classics",
    description:
      "Traditional Tanjore paintings with timeless gold detailing.",
    slug: "tanjore-classics",
    image: "",
    category: "Tanjore Paintings",
    isActive: true,
    sortOrder: 2,
  },
  {
    _id: "collection-fabric-art",
    title: "Fabric Art",
    description:
      "Hand-painted artwork created on premium fabrics.",
    slug: "fabric-art",
    image: "",
    category: "Fabric Paintings",
    isActive: true,
    sortOrder: 3,
  },
  {
    _id: "collection-custom-creations",
    title: "Custom Creations",
    description:
      "Personalized artwork created specially for you.",
    slug: "custom-creations",
    image: "",
    category: "Customized Art",
    isActive: true,
    sortOrder: 4,
  },
  {
    _id: "collection-wedding-art",
    title: "Wedding Art",
    description:
      "Beautiful handmade artwork for weddings and special occasions.",
    slug: "wedding-art",
    image: "",
    category: "Blouse Painting",
    isActive: true,
    sortOrder: 5,
  },
  {
    _id: "collection-gifting",
    title: "Gifting Collection",
    description:
      "Handmade gifts and crafts for memorable occasions.",
    slug: "gifting-collection",
    image: "",
    category: "Gifts & Crafts",
    isActive: true,
    sortOrder: 6,
  },
];

const seedCategoriesCollections = async () => {
  try {
    await connectDB();

    await Category.deleteMany({});
    await Collection.deleteMany({});

    await Category.insertMany(categories);
    await Collection.insertMany(collections);

    console.log(
      `${categories.length} categories inserted successfully.`
    );

    console.log(
      `${collections.length} collections inserted successfully.`
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "Categories/collections seeding failed:",
      error.message
    );

    process.exit(1);
  }
};

seedCategoriesCollections();