export type BlogPostSummary = {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  image: string;
};

export type PortableSpan = {
  _type: "span";
  _key?: string;
  text: string;
  marks?: string[];
};

export type PortableBlock = {
  _type: string;
  _key?: string;
  style?: string;
  listItem?: "bullet" | "number";
  level?: number;
  children?: PortableSpan[];
  markDefs?: Array<{ _key: string; _type: string; href?: string }>;
  url?: string;
  alt?: string;
};

export type BlogPostDetail = BlogPostSummary & {
  body: PortableBlock[];
  faqs: Faq[];
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  authorName?: string;
  authorRole?: string;
  authorBio?: string;
  authorImage?: string;
};

export type Faq = {
  question: string;
  answer: string;
};

/** Anchor id for a heading (must match PortableText renderer output). */
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function blockText(b: PortableBlock): string {
  return (b.children ?? []).map((s) => s.text).join("");
}

export type TocEntry = { id: string; text: string };

/** h2/h3 headings for the table of contents. */
export function tocFromBlocks(blocks: PortableBlock[]): TocEntry[] {
  const out: TocEntry[] = [];
  for (const b of blocks) {
    if (b._type === "block" && (b.style === "h2" || b.style === "h3")) {
      const text = blockText(b).trim();
      if (text) out.push({ id: headingId(text), text });
    }
  }
  return out;
}

/** Rough reading time in minutes (200 wpm, min 1). */
export function readingMinutes(blocks: PortableBlock[]): number {
  let words = 0;
  for (const b of blocks) {
    if (b._type === "block") words += blockText(b).trim().split(/\s+/).filter(Boolean).length;
  }
  return Math.max(1, Math.round(words / 200));
}
