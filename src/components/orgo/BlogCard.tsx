import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import type { BlogPostSummary } from "@/lib/orgo/blog-types";

export function BlogCard({ post }: { post: BlogPostSummary }) {
  return (
    <article className="group flex flex-col overflow-hidden bg-card soft-shadow transition-all duration-300 hover:-translate-y-1">
      <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.image}
          alt={post.title}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 bg-primary px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-primary-foreground">
          {post.category}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <CalendarDays className="size-3.5 text-accent" />
          {post.date}
        </p>
        <Link href={`/blog/${post.slug}`}>
          <h3 className="mt-3 font-display text-2xl leading-snug text-primary transition-colors group-hover:text-accent">
            {post.title}
          </h3>
        </Link>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
        <Link
          href={`/blog/${post.slug}`}
          className="mt-6 inline-flex w-fit items-center gap-2 text-[12px] font-semibold tracking-[0.18em] text-primary"
        >
          READ ARTICLE
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
