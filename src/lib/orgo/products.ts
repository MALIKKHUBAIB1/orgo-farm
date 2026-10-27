
export const img = {
  facePack: "https://ik.imagekit.io/hliyltsjxz/orgo/face-pack.jpg",
  lemonBar: "https://ik.imagekit.io/hliyltsjxz/orgo/lemon-bar.jpg",
  roseBar: "/rose4.jpeg",
  barsPackaged: "https://ik.imagekit.io/hliyltsjxz/orgo/bars-packaged.jpg",
  collection: "https://ik.imagekit.io/hliyltsjxz/orgo/collection.jpg",
  howToUse: "https://ik.imagekit.io/hliyltsjxz/orgo/how-to-use.jpg",
  lid: "https://ik.imagekit.io/hliyltsjxz/orgo/lid.jpg",
  curationCard: "https://ik.imagekit.io/hliyltsjxz/orgo/curation-card.jpg",
  curationTiers: "https://ik.imagekit.io/hliyltsjxz/orgo/curation-tiers.jpg",
  soapCollection: "/soap/WhatsApp Image 2026-10-23 at 11.31.57 PM (1).jpeg",
  soapCloseup: "/soap/WhatsApp Image 2026-10-23 at 11.31.58 PM (3).jpeg",
  logo: "/orgo/logo-transparent.png",
  curationBronze: "/bronze.jpeg",
  curationSilver: "/silver.jpeg",
  curationGold: "/golds.jpeg",
  roseBottle: "/rose.jpeg",
  rosePack: "/rose3.jpeg",
  roseSoap: "/rose2.jpeg",
};

// Business WhatsApp (orders are currently taken on WhatsApp: +91 92362 06988).
// NOTE: Keep this — when online payment integration is added later, swap ordering
// to payment but keep this number for support/order enquiries on the site.
export const WHATSAPP_NUMBER = "919236206988";

export type Product = {
  slug: string;
  name: string;
  size: string;
  price: number;
  eachNote?: string;
  badge?: string;
  category: string;
  type: string;
  concerns: string[];
  short: string;
  description: string;
  benefits: string[];
  ingredients: string;
  howToUse: string;
  suitableFor: string;
  image: string;
  gallery: string[];
  inStock: boolean;
  featured: boolean;
};

export function displayProductImage(product: Pick<Product, "slug" | "image">): string {
  return product.slug === "rose-scrub-bar" ? img.roseBar : product.image;
}

export function displayProductGallery(product: Pick<Product, "slug" | "gallery">): string[] {
  if (product.slug === "rose-scrub-bar") {
    return [...new Set([img.roseBar, ...product.gallery])];
  }
  if (product.slug === "pure-rose-water") {
    return [...new Set([...product.gallery, img.roseBar])];
  }
  return product.gallery;
}

export const products: Product[] = [
  {
    slug: "signature-face-pack",
    name: "Signature Face Pack Pouch",
    size: "50g",
    price: 199,
    badge: "BESTSELLER",
    category: "Face Care",
    type: "Face Masks",
    concerns: ["Acne", "Tan", "Dullness"],
    short: "Deep cleansing face pack for a naturally radiant glow.",
    description:
      "Deeply cleanses dirt and excess oil, fights acne and blemishes, fades sun tan for a radiant glow. Perfect for all skin types.",
    benefits: [
      "Deep cleansing",
      "Helps fight acne & blemishes",
      "Helps reduce appearance of tan",
      "Suitable for all skin types",
    ],
    ingredients:
      "Natural face pack powder blend of farm-fresh botanical herbs, rose petals and clay. No parabens. No artificial fragrances.",
    howToUse:
      "Mix the required amount with water or rose water into a smooth paste. Apply an even layer, leave for 8–10 minutes, gently scrub and rinse.",
    suitableFor: "All skin types. For external use only. Patch test recommended.",
    image: img.facePack,
    gallery: [img.facePack, img.lid, img.howToUse, img.collection],
    inStock: true,
    featured: true,
  },
  {
    slug: "lemon-scrub-bar",
    name: "Lemon Scrub Bar",
    size: "90g × 2",
    price: 299,
    eachNote: "₹150 each",
    category: "Body Care",
    type: "Scrub Bars",
    concerns: ["Dullness", "Dry Skin"],
    short: "Refreshing loofa scrub bar with natural lemon extracts.",
    description:
      "Deeply exfoliates dead skin, refreshes and energizes the body, and supports healthy-looking skin with natural lemon extracts.",
    benefits: [
      "Deep exfoliation with natural loofa",
      "Refreshes and energizes",
      "Natural lemon extracts",
      "Handcrafted in small batches",
    ],
    ingredients: "Cold-pressed lemon extracts, natural loofa, glycerin soap base, farm-fresh botanicals.",
    howToUse: "Lather on damp skin, massage in circular motions, rinse well. Store in a dry soap dish.",
    suitableFor: "Normal to oily skin. For external use only.",
    image: img.lemonBar,
    gallery: [img.lemonBar, img.barsPackaged, img.collection],
    inStock: true,
    featured: true,
  },
  {
    slug: "rose-scrub-bar",
    name: "Rose Scrub Bar",
    size: "90g × 2",
    price: 299,
    eachNote: "₹150 each",
    category: "Body Care",
    type: "Scrub Bars",
    concerns: ["Dry Skin", "Dullness"],
    short: "Softening rose bar with a luxurious natural fragrance.",
    description:
      "Softens and smooths skin, deeply moisturizes with a luxurious rose fragrance, and promotes a supple, glowing complexion.",
    benefits: [
      "Softens and smooths skin",
      "Deeply moisturizing",
      "Luxurious natural rose fragrance",
      "Handcrafted with dried rose petals",
    ],
    ingredients: "Dried rose petals, rose extract, natural loofa, glycerin soap base.",
    howToUse: "Lather on damp skin, massage gently, rinse well. Follow with a moisturizer.",
    suitableFor: "All skin types, especially dry skin. For external use only.",
    image: img.roseBar,
    gallery: [img.roseBar, img.roseSoap],
    inStock: true,
    featured: true,
  },
  {
    slug: "d-tan-coffee-bar",
    name: "D-Tan Coffee Bar",
    size: "90g × 2",
    price: 299,
    eachNote: "₹150 each",
    badge: "POPULAR",
    category: "Body Care",
    type: "Scrub Bars",
    concerns: ["Tan", "Acne", "Pigmentation"],
    short: "Coffee bar that targets the look of tan and dark spots.",
    description:
      "Helps reduce the appearance of acne and pigmentation, targets the look of stubborn tan and dark spots, and supports naturally brighter-looking skin.",
    benefits: [
      "Targets the look of stubborn tan",
      "Helps with the appearance of dark spots",
      "Supports brighter-looking skin",
      "Natural coffee grounds for gentle scrub",
    ],
    ingredients: "Roasted coffee grounds, natural botanicals, glycerin soap base.",
    howToUse: "Lather on damp skin, massage in circular motions for 1–2 minutes, rinse well.",
    suitableFor: "All skin types. For external use only. Patch test recommended.",
    image: img.barsPackaged,
    gallery: [img.collection, img.lid],
    inStock: true,
    featured: true,
  },
  {
    slug: "pure-rose-water",
    name: "Pure Rose Water",
    size: "100 ml",
    price: 220,
    badge: "BESTSELLER",
    category: "Face Care",
    type: "Rose Water / Facial Mist",
    concerns: ["Dry Skin", "Dullness"],
    short:
      "Refresh and hydrate your skin with Orgo Farm Pure Rose Water. A refreshing addition to your daily skincare routine.",
    description:
      "ORGO FARM Pure Handcrafted Rose Water\nRefresh, hydrate, and tone your skin with our natural Rose Water. Distilled from fresh rose petals and packaged in a convenient spray bottle, this pure, handcrafted floral mist is the ultimate multi-tasker for your daily skincare routine.",
    benefits: [
      "Refreshes the skin",
      "Helps skin feel hydrated",
      "Adds a refreshing touch to your skincare routine",
      "Suitable for daily use, depending on individual skin tolerance",
    ],
    ingredients: "Ingredients: Rose Water (Rosa Damascena Flower Water)",
    howToUse:
      "SHAKE WELL BEFORE USE\n(All-in-One Multi-Purpose Guide)\n\n1: Prep & Tone\nHold the bottle 5–6 inches away from your face and spritz 2–3 times over clean skin to hydrate, balance pH, and tighten pores. Let it air dry or gently pat it in.\n\n2: Mask Mix\nSpritz or pour directly into your face pack powder to form a smooth, botanical paste instead of plain water.\n\n3: Midday Refresh\nSpray lightly over your face anytime throughout the day to revive dull, tired skin with an instant dewy glow.\n\n4: Makeup Prep & Set\nMist before makeup application to create a plump, hydrated canvas, or spray lightly over finished makeup to melt powdery textures into a natural finish.",
    suitableFor: "",
    image: img.roseBottle,
    gallery: [img.rosePack, img.roseBottle],
    inStock: true,
    featured: false,
  },
];

export type Curation = {
  slug: string;
  tier: "Bronze" | "Silver" | "Gold";
  title: string;
  label: string;
  items: string[];
  price: number;
  cta: string;
};

export const curations: Curation[] = [
  {
    slug: "bronze-essential-trio",
    tier: "Bronze",
    title: "Essential Trio",
    label: "IDEAL FOR BEGINNERS",
    items: ["Tan Remover Soap Bar", "Face Mask", "Hair / Beard Oil"],
    price: 649,
    cta: "SHOP BRONZE",
  },
  {
    slug: "silver-head-to-toe",
    tier: "Silver",
    title: "Head-to-Toe Care",
    label: "ADVANCED WELLNESS",
    items: [
      "2 Tan Remover Bars",
      "Lime Body Scrub Loofa Bar",
      "Face Mask",
      "Hair / Beard Oil",
      "Hydrating Rose Mist",
    ],
    price: 1249,
    cta: "SHOP SILVER",
  },
  {
    slug: "gold-ultimate-luxury",
    tier: "Gold",
    title: "Ultimate Luxury",
    label: "PURE INDULGENCE",
    items: [
      "Tan Remover Soap Bar",
      "Rose Body Scrub Bar",
      "Face Mask",
      "Detox Mask",
      "Hair / Beard Oil",
      "Premium Travel Pouch",
    ],
    price: 1899,
    cta: "SHOP GOLD",
  },
];

export const categories = [
  "Face Care",
  "Body Care",
  "Hair & Beard Care",
  "Scrub Bars",
  "Face Masks",
  "Curated Wellness",
];

export const steps = [
  { n: "01", title: "Cleanse", text: "Wash your face with a gentle cleanser and pat dry." },
  {
    n: "02",
    title: "Prepare",
    text: "Take required amount of face pack powder. Mix with water or rose water to make a smooth paste.",
  },
  {
    n: "03",
    title: "Apply",
    text: "Apply an even layer of the paste on your face and neck. Avoid the eye and lip area.",
  },
  { n: "04", title: "Wait", text: "Leave it on for 8–10 minutes. Let the pack dry naturally." },
  { n: "05", title: "Gentle Scrub", text: "Gently massage in circular motions for 1–2 minutes." },
  {
    n: "06",
    title: "Rinse & Moisturize",
    text: "Rinse off with plain water. Pat dry and apply a good moisturizer.",
  },
];

export const ingredients = [
  { name: "Rose", text: "Softens, soothes and adds a natural glow.", image: img.roseBar },
  { name: "Coffee", text: "Gently buffs away dullness and the look of tan.", image: img.barsPackaged },
  { name: "Lemon", text: "Refreshes and energizes tired skin.", image: img.lemonBar },
  { name: "Botanical Herbs", text: "Farm-fresh herbs chosen for balance and calm.", image: img.collection },
  { name: "Face Pack Powder", text: "A fine natural blend for weekly deep cleansing.", image: img.facePack },
];

export function findProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function inr(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}
