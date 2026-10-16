import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock3, ListTree, Tag } from "lucide-react";
import { PortableText } from "@/components/orgo/PortableText";
import { BlogCard } from "@/components/orgo/BlogCard";
import { ShareRow } from "@/components/orgo/ShareRow";
import { Reveal } from "@/components/orgo/Reveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getBlogPost, getBlogPosts } from "@/lib/orgo/blog";
import { readingMinutes, tocFromBlocks } from "@/lib/orgo/blog-types";
import { SITE_URL } from "@/lib/orgo/api";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const { posts } = await getBlogPosts();
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { post } = await getBlogPost(slug);
  if (!post) return { title: "Article not found | ORGO FARM", robots: { index: false } };
  const canonical = `/blog/${post.slug}`;
  const title = post.metaTitle?.trim() || `${post.title} | ORGO FARM`;
  const description = post.metaDescription?.trim() || post.excerpt;
  return {
    title,
    description,
    ...(post.keywords?.length ? { keywords: post.keywords } : {}),
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${SITE_URL}${canonical}`,
      images: post.image ? [{ url: post.image, alt: post.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.image ? [post.image] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { post, related } = await getBlogPost(slug);
  if (!post) notFound();

  const canonical = `${SITE_URL}/blog/${post.slug}`;
  const toc = tocFromBlocks(post.body);
  const minutes = readingMinutes(post.body);
  const description = post.metaDescription?.trim() || post.excerpt;

  const schemas: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description,
      image: post.image,
      datePublished: post.date,
      author: { "@type": "Organization", name: "ORGO FARM" },
      publisher: { "@type": "Organization", name: "ORGO FARM" },
      mainEntityOfPage: canonical,
    },
  ];
  if (post.faqs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }

  return (
    <div>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.18em] text-primary">
          <ArrowLeft className="size-4" /> BACK TO JOURNAL
        </Link>

        <div className="mt-6 max-w-3xl">
          <span className="inline-block bg-primary px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground">
            {post.category}
          </span>
          <h1 className="mt-4 font-display text-4xl leading-tight text-primary md:text-5xl">{post.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="size-4 text-accent" /> {minutes} min read
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4 text-accent" /> {post.date}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Tag className="size-4 text-accent" /> {post.category}
            </span>
          </div>
          <div className="mt-4">
            <ShareRow url={canonical} title={post.title} />
          </div>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.image} alt={post.title} className="mt-8 aspect-[16/8] w-full object-cover soft-shadow" />

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="min-w-0">
            {toc.length > 0 && (
              <details className="mb-8 border border-border bg-card p-5 lg:hidden">
                <summary className="flex cursor-pointer items-center gap-2 font-semibold text-primary">
                  <ListTree className="size-4 text-accent" /> Table of Contents
                </summary>
                <ol className="mt-3 space-y-2">
                  {toc.map((t, i) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} className="text-sm font-medium text-muted-foreground hover:text-primary">
                        <span className="mr-2 font-semibold text-accent">{String(i + 1).padStart(2, "0")}</span>
                        {t.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </details>
            )}

            <PortableText blocks={post.body} />

            <div className="mt-10 flex gap-4 border border-border bg-card p-6">
              {post.authorImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.authorImage}
                  alt={post.authorName || "Author"}
                  className="size-14 shrink-0 rounded-full border object-cover"
                />
              ) : (
                <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary font-display text-xl text-primary-foreground">
                  {(post.authorName || "O").charAt(0)}
                </span>
              )}
              <div>
                <p className="eyebrow text-muted-foreground">Written by</p>
                <p className="mt-1 font-semibold text-primary">{post.authorName?.trim() || "Team ORGO FARM"}</p>
                {post.authorRole?.trim() ? <p className="text-xs font-semibold text-accent">{post.authorRole}</p> : null}
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {post.authorBio?.trim() ||
                    "The ORGO FARM team — handcrafting natural skincare on the farm and writing honest guides on ingredients, rituals and healthy skin."}
                </p>
              </div>
            </div>

            {post.faqs.length > 0 && (
              <section className="mt-12">
                <p className="eyebrow text-accent">FAQs</p>
                <h2 className="mt-2 font-display text-3xl text-primary">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="mt-6">
                  {post.faqs.map((f, i) => (
                    <AccordionItem key={i} value={`faq-${i}`}>
                      <AccordionTrigger className="text-left">{f.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{f.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            )}
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-32 space-y-5">
              <div className="border border-border bg-card p-5">
                <p className="eyebrow text-primary">Summary</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
              </div>

              {toc.length > 0 && (
                <nav className="border border-border bg-card p-5" aria-label="Table of contents">
                  <p className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.18em] text-primary">
                    <ListTree className="size-4 text-accent" /> TABLE OF CONTENTS
                  </p>
                  <ol className="mt-3 space-y-2.5">
                    {toc.map((t, i) => (
                      <li key={t.id}>
                        <a
                          href={`#${t.id}`}
                          className="text-sm font-medium leading-snug text-muted-foreground transition-colors hover:text-primary"
                        >
                          <span className="mr-2 font-semibold text-accent">{String(i + 1).padStart(2, "0")}</span>
                          {t.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="border border-border bg-card p-4">
                  <p className="eyebrow text-muted-foreground">Published</p>
                  <p className="mt-1 text-sm font-semibold text-primary">{post.date}</p>
                </div>
                <div className="border border-border bg-card p-4">
                  <p className="eyebrow text-muted-foreground">Reading time</p>
                  <p className="mt-1 text-sm font-semibold text-primary">{minutes} min</p>
                </div>
              </div>

              <div className="bg-primary p-6 text-primary-foreground">
                <p className="font-display text-2xl leading-snug">Love natural skincare?</p>
                <p className="mt-2 text-sm text-primary-foreground/80">Shop our handmade face packs and scrub bars.</p>
                <div className="mt-4 flex flex-col gap-2">
                  <Link
                    href="/shop"
                    className="inline-flex items-center justify-center bg-primary-foreground px-4 py-2.5 text-[12px] font-semibold tracking-[0.18em] text-primary transition-opacity hover:opacity-90"
                  >
                    SHOP NOW
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center border border-primary-foreground/30 px-4 py-2.5 text-[12px] font-semibold tracking-[0.18em] transition-colors hover:bg-white/10"
                  >
                    CONTACT US
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <p className="eyebrow text-accent">Related articles</p>
            <h2 className="mt-2 font-display text-3xl text-primary md:text-4xl">Keep reading</h2>
            <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Reveal key={r.slug}>
                  <BlogCard post={r} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
