export type Faq = {
  _id?: string;
  question: string;
  answer: string;
  sortOrder: number;
};

export const DEFAULT_FAQS: Faq[] = [
  {
    sortOrder: 0,
    question: "How do I place an order?",
    answer:
      "Add products to your cart and check out on the website, or tap Order on WhatsApp on any product page to place your order directly with us.",
  },
  { sortOrder: 1, question: "Do you ship across India?", answer: "Yes, we ship to all serviceable PIN codes across India." },
  { sortOrder: 2, question: "Is standard shipping free?", answer: "Yes — standard shipping is free across India on every order." },
  { sortOrder: 3, question: "What is fast delivery?", answer: "Fast delivery is a priority dispatch option available at ₹100 at checkout." },
  {
    sortOrder: 4,
    question: "How do I use the Face Pack?",
    answer:
      "Mix the powder with water or rose water into a smooth paste, apply an even layer, leave for 8–10 minutes, gently scrub and rinse. See our How To Use page for all six steps.",
  },
  { sortOrder: 5, question: "How often should I use the Face Pack?", answer: "We recommend 2–3 times a week for best results." },
  { sortOrder: 6, question: "Are the products handmade?", answer: "Yes. Every ORGO FARM product is handcrafted in small batches." },
  { sortOrder: 7, question: "Are the products free from parabens?", answer: "Yes. Our formulations are made without parabens." },
  { sortOrder: 8, question: "Do you use artificial fragrances?", answer: "No. We use natural ingredients only — no artificial fragrances." },
  {
    sortOrder: 9,
    question: "How can I track my order?",
    answer: "Use the Track Order section in your account, or message us on WhatsApp with your order ID.",
  },
  {
    sortOrder: 10,
    question: "What is your return policy?",
    answer: "Unopened products can be returned within 7 days of delivery. Contact us and we'll help.",
  },
];