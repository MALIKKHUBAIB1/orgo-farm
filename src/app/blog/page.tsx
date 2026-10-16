import type { Metadata } from "next";
import { BlogCard } from "@/components/orgo/BlogCard";
import { Reveal } from "@/components/orgo/Reveal";
import { getBlogPosts } from "@/lib/orgo/blog";
import { SITE_URL } from "@/lib/orgo/api";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Journal — Natural Skincare Guides & Rituals | ORGO FARM",
  description:
    "ORGO FARM journal: guides on handmade natural skincare, face packs, scrub bars, ingredients and daily rituals for healthy glowing skin.",
  alternates: { canonical: "/blog" },
  keywords: [
    "natural skincare blog India",
    "organic skincare guides",
    "face pack tips",
    "scrub bar guide",
    "ORGO FARM journal",
  ],
  openGraph: {
    title: "Journal — Natural Skincare Guides & Rituals | ORGO FARM",
    description: "Practical writing on handmade natural skincare, ingredients and daily rituals.",
    type: "website",
    url: `${SITE_URL}/blog`,
  },
};

export default async function BlogPage() {
  const { posts, source } = await getBlogPosts();

  return (
    <>
      <section className="paper border-b border-border">
        <div className="mx-auto max-w-[1280px] px-4 py-16 text-center md:px-8 md:py-24">
          <p className="font-script text-3xl text-rose">From Our Farm</p>
          <h1 className="mt-4 text-5xl text-primary md:text-7xl">Journal &amp; Rituals</h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Practical guidance on handmade natural skincare — ingredients, rituals and honest care
            for healthy, glowing skin.
          </p>
          {source === "static" ? (
            <p className="mx-auto mt-4 max-w-xl text-xs text-muted-foreground">
              Showing built-in guides. Publish posts in Sanity Studio to manage this page live.
            </p>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-16 md:px-8 md:py-20">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={Math.min(i * 0.06, 0.3)}>
              <BlogCard post={post} />
            </Reveal>
          ))}
        </div>

        {posts.length === 0 ? (
          <p className="py-20 text-center text-sm text-muted-foreground">
            No articles yet — please check back soon.
          </p>
        ) : null}
      </section>
    </>
  );
}
