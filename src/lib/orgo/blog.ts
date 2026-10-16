import { img } from "./products";
import type { BlogPostDetail, BlogPostSummary, Faq, PortableBlock } from "./blog-types";

const API_VERSION = "2025-01-01";

function sanityEnv() {
  const projectId =
    process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
  if (!projectId) return null;
  return {
    projectId,
    dataset:
      process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    token: process.env.SANITY_READ_TOKEN || "",
  };
}

export function sanityConfigured() {
  return Boolean(sanityEnv());
}

async function sanityQuery<T>(groq: string, params: Record<string, string> = {}): Promise<T> {
  const env = sanityEnv();
  if (!env) throw new Error("sanity not configured");
  const url = new URL(`https://${env.projectId}.apicdn.sanity.io/v${API_VERSION}/data/query/${env.dataset}`);
  url.searchParams.set("query", groq);
  // Sanity expects param values JSON-encoded (strings need quotes).
  for (const [k, v] of Object.entries(params)) url.searchParams.set(`$${k}`, JSON.stringify(v));
  const res = await fetch(url.toString(), {
    headers: env.token ? { Authorization: `Bearer ${env.token}` } : {},
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Sanity query failed: ${res.status}`);
  const json = (await res.json()) as { result: T };
  return json.result;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}

// Built-in fallback posts (skincare) — shown when Sanity is not configured or empty.
export const fallbackPosts: BlogPostSummary[] = [
  {
    slug: "why-handmade-natural-skincare",
    title: "Why Handmade Natural Skincare Is Better For Your Skin",
    category: "Philosophy",
    date: "12 September 2026",
    excerpt:
      "Small batches, farm-fresh botanicals and zero parabens — here's why handmade care outperforms mass-produced creams.",
    image: img.collection,
  },
  {
    slug: "how-to-use-face-pack-scrub-bar",
    title: "How To Use a Face Pack and Scrub Bar the Right Way",
    category: "How To Use",
    date: "28 August 2026",
    excerpt:
      "The simple 10-minute ritual: mix, apply, scrub gently and rinse. Get the glow without over-exfoliating.",
    image: img.howToUse,
  },
  {
    slug: "rose-vs-lemon-vs-coffee-scrub-bar",
    title: "Rose vs Lemon vs Coffee: Which Scrub Bar Is For You?",
    category: "Guides",
    date: "10 August 2026",
    excerpt:
      "Dry skin loves rose, dull skin loves lemon, tired skin loves coffee. A quick guide to picking your bar.",
    image: img.barsPackaged,
  },
];

const LIST_QUERY = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  "slug": slug.current,
  title,
  category,
  excerpt,
  "date": publishedAt,
  "image": mainImage.asset->url
}`;

const DETAIL_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  "slug": slug.current,
  title,
  category,
  excerpt,
  metaTitle,
  metaDescription,
  keywords,
  "date": publishedAt,
  "image": mainImage.asset->url,
  authorName,
  authorRole,
  authorBio,
  "authorImage": authorImage.asset->url,
  faqs[]{question, answer},
  body[] {
    _type, _key, style, listItem, level, markDefs,
    children[] { _type, _key, text, marks },
    "url": asset->url, alt
  }
}`;

type SanityListRow = {
  slug: string;
  title: string;
  category?: string;
  excerpt?: string;
  date?: string;
  image?: string;
};

const FALLBACK_IMAGE = img.collection;

// Posts hidden from the site (e.g. a test/dummy post published in Sanity by
// mistake). The slug 404s and never appears in lists or related articles.
// Permanent fix: delete the document in Sanity Studio — then remove it here.
const HIDDEN_SLUGS = new Set([
  "india-s-political-landscape-in-2026-key-issues-shaping-public-debate",
]);

export function isHiddenSlug(slug: string): boolean {
  return HIDDEN_SLUGS.has(slug);
}

function toSummary(r: SanityListRow): BlogPostSummary {
  return {
    slug: r.slug,
    title: r.title,
    category: r.category || "Journal",
    excerpt: r.excerpt || "",
    date: r.date ? formatDate(r.date) : "",
    image: r.image ? `${r.image}?w=1200&q=75&auto=format` : FALLBACK_IMAGE,
  };
}

function para(text: string): PortableBlock {
  return { _type: "block", style: "normal", children: [{ _type: "span", text }] };
}

function heading(text: string): PortableBlock {
  return { _type: "block", style: "h2", children: [{ _type: "span", text }] };
}

function bullets(items: string[]): PortableBlock[] {
  return items.map((text) => ({
    _type: "block",
    style: "normal",
    listItem: "bullet",
    children: [{ _type: "span", text }],
  }));
}

const STATIC_BODIES: Record<string, PortableBlock[]> = {
  "why-handmade-natural-skincare": [
    para(
      "Walk down any skincare aisle and you will see rows of identical creams promising miracles. Flip them over and the ingredient list reads like a chemistry exam — parabens, sulphates, artificial fragrances. Handmade natural skincare starts from the opposite belief: fewer ingredients, honest ones, made in small batches you can trust.",
    ),
    heading("Small batches mean real control"),
    para(
      "At ORGO FARM every bar is poured, cured and wrapped by hand. Small batches let us check quality at every step — from sourcing botanicals to the final label. If a batch is not perfect, it never reaches you. Mass factories cannot say that.",
    ),
    heading("No parabens, no artificial fragrance"),
    para(
      "Our products are free from parabens and artificial fragrances. The smell of our Rose Scrub Bar comes from real dried rose petals, not a perfume bottle. That matters because fragrance is one of the most common causes of skin irritation.",
    ),
    heading("Farm-fresh botanicals, not fillers"),
    ...bullets([
      "Rose petals — naturally softening and calming for dry skin.",
      "Lemon extracts — refreshing and great for dull, tired-looking skin.",
      "Coffee grounds — gentle physical exfoliation that targets the look of tan.",
      "Natural loofa — built into every scrub bar for even, gentle scrubbing.",
    ]),
    heading("How to switch to natural care"),
    para(
      "Start simple: replace your chemical soap with one scrub bar that matches your skin, and add the Signature Face Pack once or twice a week. Give your skin two to three weeks to adjust — most people notice a calmer, more even glow within the first month.",
    ),
  ],
  "how-to-use-face-pack-scrub-bar": [
    para(
      "Natural products work beautifully — but only with the right ritual. Scrub too hard or leave a face pack on too long and even the gentlest ingredients can irritate. Here is the exact 10-minute ritual we recommend for ORGO FARM products.",
    ),
    heading("The face pack ritual (once or twice a week)"),
    ...bullets([
      "Step 1 — Mix: take the required amount of Signature Face Pack powder and mix with plain water or rose water into a smooth paste.",
      "Step 2 — Apply: spread an even layer on a clean face, avoiding the eyes and lips.",
      "Step 3 — Wait 8–10 minutes: let it semi-dry. Do not let it crack fully — that over-dries the skin.",
      "Step 4 — Scrub gently: wet your fingertips and massage in circles, then rinse with lukewarm water.",
    ]),
    heading("The scrub bar ritual (2–3 times a week)"),
    ...bullets([
      "Lather the bar on damp skin — Lemon for dullness, Rose for dryness, Coffee for tan.",
      "Massage in circular motions for a minute; let the natural loofa do the work, not pressure.",
      "Rinse well and store the bar in a dry soap dish so it lasts longer.",
    ]),
    heading("Three mistakes to avoid"),
    para(
      "Do not scrub daily — over-exfoliation damages your skin barrier. Do not mix the face pack with hot water. And always do a small patch test behind your ear before the first full use.",
    ),
  ],
  "rose-vs-lemon-vs-coffee-scrub-bar": [
    para(
      "All three ORGO FARM scrub bars share the same base — natural loofa, glycerin and farm botanicals. The difference is the hero ingredient. Pick by what your skin needs most right now.",
    ),
    heading("Rose Scrub Bar — for dry, sensitive skin"),
    para(
      "Made with dried rose petals and rose extract, this is our softest, most moisturising bar with a luxurious natural fragrance. Choose rose if your skin feels tight after bathing, or if you simply love a calming floral ritual.",
    ),
    heading("Lemon Scrub Bar — for dull, oily skin"),
    para(
      "Cold-pressed lemon extracts refresh and energise, helping skin look brighter and more awake. Choose lemon if your skin looks tired or gets oily through the day. Best for normal to oily skin.",
    ),
    heading("D-Tan Coffee Bar — for tan and dark spots"),
    para(
      "Roasted coffee grounds give gentle physical exfoliation that targets the look of stubborn tan, pigmentation and dark spots. Our most popular bar — choose coffee if you spend time outdoors or want visibly brighter-looking skin.",
    ),
    heading("The quick verdict"),
    ...bullets([
      "Dry or sensitive skin → Rose.",
      "Dull or oily skin → Lemon.",
      "Tan, spots or outdoor lifestyle → Coffee.",
      "Still confused → start with Coffee, then try the others. At ₹150 a bar, experimenting is easy.",
    ]),
  ],
};

const STATIC_FAQS: Record<string, Faq[]> = {
  "why-handmade-natural-skincare": [
    {
      question: "Is handmade skincare better than branded creams?",
      answer:
        "It depends on the maker. Honest handmade skincare uses fewer, recognisable ingredients and small quality-checked batches — so you avoid parabens, sulphates and artificial fragrances common in mass products.",
    },
    {
      question: "Is ORGO FARM suitable for sensitive skin?",
      answer:
        "Our products are free from parabens and artificial fragrances, which suits most sensitive skin. Start with the Rose Scrub Bar and always do a patch test first.",
    },
  ],
  "how-to-use-face-pack-scrub-bar": [
    {
      question: "How often should I use the face pack?",
      answer:
        "Once or twice a week is enough. Leave it on for 8–10 minutes, never let it dry till it cracks, and rinse with lukewarm water.",
    },
    {
      question: "Can I use a scrub bar daily?",
      answer:
        "No — 2–3 times a week is ideal. Daily scrubbing over-exfoliates and can damage your skin barrier.",
    },
    {
      question: "How do I make the scrub bar last longer?",
      answer:
        "Keep it in a dry soap dish away from direct shower spray. A dry bar easily lasts several weeks.",
    },
  ],
  "rose-vs-lemon-vs-coffee-scrub-bar": [
    {
      question: "Which scrub bar is best for tan removal?",
      answer:
        "The D-Tan Coffee Bar — roasted coffee grounds gently exfoliate and target the look of stubborn tan and dark spots.",
    },
    {
      question: "Which bar suits dry skin?",
      answer:
        "The Rose Scrub Bar. It is our most moisturising bar, made with dried rose petals and rose extract, and suits all skin types including dry skin.",
    },
  ],
};

function staticDetail(slug: string): BlogPostDetail | null {
  const p = fallbackPosts.find((x) => x.slug === slug);
  if (!p) return null;
  return {
    ...p,
    body: STATIC_BODIES[slug] ?? [para(p.excerpt)],
    faqs: STATIC_FAQS[slug] ?? [],
    metaTitle: "",
    metaDescription: "",
    keywords: [],
    authorName: "Team ORGO FARM",
    authorRole: "Skincare Makers",
    authorBio:
      "The ORGO FARM team — handcrafting natural skincare on the farm and writing honest guides on ingredients, rituals and healthy skin.",
    authorImage: "",
  };
}

export async function getBlogPosts(): Promise<{ posts: BlogPostSummary[]; source: "sanity" | "static" }> {
  if (!sanityEnv()) return { posts: fallbackPosts, source: "static" };
  try {
    const rows = await sanityQuery<SanityListRow[]>(LIST_QUERY);
    const visible = (rows ?? []).filter((r) => r.slug && !isHiddenSlug(r.slug));
    if (visible.length === 0) return { posts: fallbackPosts, source: "static" };
    return { posts: visible.map(toSummary), source: "sanity" };
  } catch (e) {
    console.error("[blog] Sanity list failed, using static:", e);
    return { posts: fallbackPosts, source: "static" };
  }
}

export async function getBlogPost(
  slug: string,
): Promise<{ post: BlogPostDetail | null; related: BlogPostSummary[]; source: "sanity" | "static" }> {
  // Hidden slugs behave as if they don't exist.
  if (isHiddenSlug(slug)) return { post: null, related: [], source: "static" };
  if (sanityEnv()) {
    try {
      const row = await sanityQuery<
        | (SanityListRow & {
            body?: PortableBlock[];
            faqs?: Faq[];
            metaTitle?: string;
            metaDescription?: string;
            keywords?: string[];
            authorName?: string;
            authorRole?: string;
            authorBio?: string;
            authorImage?: string;
          })
        | null
      >(DETAIL_QUERY, { slug });
      if (row) {
        const post = {
          ...toSummary(row),
          body: Array.isArray(row.body) && row.body.length > 0 ? row.body : [],
          faqs: Array.isArray(row.faqs) ? row.faqs.filter((f) => f.question && f.answer) : [],
          metaTitle: row.metaTitle || "",
          metaDescription: row.metaDescription || "",
          keywords: Array.isArray(row.keywords) ? row.keywords.filter(Boolean) : [],
          authorName: row.authorName || "",
          authorRole: row.authorRole || "",
          authorBio: row.authorBio || "",
          authorImage: row.authorImage ? `${row.authorImage}?w=200&q=75&auto=format` : "",
        } as BlogPostDetail;
        return { post, related: await relatedPosts(post.slug, post.category), source: "sanity" };
      }
    } catch (e) {
      console.error("[blog] Sanity detail failed, trying static:", e);
    }
  }
  const post = staticDetail(slug);
  return { post, related: post ? await relatedPosts(post.slug, post.category) : [], source: "static" };
}

async function relatedPosts(currentSlug: string, category: string): Promise<BlogPostSummary[]> {
  try {
    const { posts } = await getBlogPosts();
    const others = posts.filter((p) => p.slug !== currentSlug);
    others.sort((a, b) => Number(b.category === category) - Number(a.category === category));
    return others.slice(0, 3);
  } catch {
    return [];
  }
}
