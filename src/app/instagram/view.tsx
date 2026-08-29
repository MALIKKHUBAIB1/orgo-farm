"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { InstagramEmbed } from "@/components/orgo/InstagramEmbed";
import { InstagramIcon } from "@/components/orgo/icons";
import { API_URL } from "@/lib/orgo/api";
import { INSTAGRAM_HANDLE, INSTAGRAM_POSTS, INSTAGRAM_URL, type InstaPost } from "@/lib/orgo/social";

const tiles = [
  { title: "Handmade Process", script: "made with love" },
  { title: "Skincare Rituals", script: "glow naturally" },
  { title: "Farm Fresh Ingredients", script: "straight from soil" },
  { title: "Behind The Scenes", script: "life at orgo farm" },
  { title: "Customer Reviews", script: "real results" },
  { title: "New Launches", script: "coming soon" },
];

function permalinkUrl(code: string, kind: "reel" | "p") {
  return `${INSTAGRAM_URL}${kind}/${code}/`;
}

export function InstagramView() {
  const [posts, setPosts] = useState<InstaPost[]>(INSTAGRAM_POSTS);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/instagram/posts`);
        if (!res.ok) return;
        const data: unknown = await res.json();
        // Preserve the bundled reel until the admin catalogue contains entries.
        if (Array.isArray(data) && !cancelled && (data.length > 0 || INSTAGRAM_POSTS.length === 0)) {
          setPosts(data as InstaPost[]);
        }
      } catch {
        /* keep default */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [version]);

  useEffect(() => {
    const bump = () => setVersion((v) => v + 1);
    window.addEventListener("orgo-catalog-changed", bump);
    return () => window.removeEventListener("orgo-catalog-changed", bump);
  }, []);

  const hasPosts = posts.length > 0;

  return (
    <div>
      <section className="border-b border-border bg-muted">
        <div className="mx-auto max-w-[1280px] px-4 py-16 text-center md:px-8 md:py-24">
          <p className="eyebrow flex items-center justify-center gap-2 text-accent">
            <InstagramIcon className="size-4" /> {INSTAGRAM_HANDLE.toUpperCase()} · INSTAGRAM
          </p>
          <h1 className="mt-4 font-display text-4xl text-primary md:text-6xl">Videos From Our Farm</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Product making, skincare rituals and behind-the-scenes moments — all our videos, right here
            in one place.
          </p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-3 bg-primary px-9 py-4 text-[11px] tracking-[0.22em] text-primary-foreground transition-opacity hover:opacity-90"
          >
            <InstagramIcon className="size-4" /> FOLLOW {INSTAGRAM_HANDLE.toUpperCase()}
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-16 md:px-8 md:py-20">
        {hasPosts ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const permalink = permalinkUrl(post.code, post.kind);
              return (
                <article
                  key={post.code}
                  className="group block overflow-hidden border border-border bg-card transition-shadow hover:shadow-lg"
                >
                  <div className="aspect-[4/5] w-full overflow-hidden bg-card">
                    <InstagramEmbed permalink={permalink} />
                  </div>
                  <a
                    href={permalink}
                    target="_blank"
                    rel="noreferrer"
                    className="block border-t border-border px-4 py-3 text-xs text-muted-foreground transition-colors hover:text-primary"
                  >
                    {post.alt}
                  </a>
                </article>
              );
            })}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {tiles.map((t) => (
                <a
                  key={t.title}
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex aspect-square flex-col items-center justify-center gap-3 border border-border bg-card p-6 text-center transition-all hover:border-primary hover:shadow-md"
                >
                  <InstagramIcon className="size-6 text-accent transition-transform group-hover:scale-110" />
                  <span className="font-script text-2xl text-primary">{t.script}</span>
                  <span className="eyebrow text-muted-foreground">{t.title}</span>
                  <span className="text-[10px] tracking-[0.18em] text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    WATCH ON INSTAGRAM →
                  </span>
                </a>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Our latest reels will be embedded here soon — follow us on Instagram in the meantime!
            </p>
          </>
        )}
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-6 px-4 py-14 text-center md:flex-row md:justify-between md:px-8 md:text-left">
          <div>
            <h2 className="font-display text-2xl md:text-3xl">New videos every week</h2>
            <p className="mt-2 text-sm text-primary-foreground/70">
              Natural skincare tips, product launches aur farm life — sab kuch {INSTAGRAM_HANDLE} pe.
            </p>
          </div>
          <Link
            href="/shop"
            className="shrink-0 border border-primary-foreground px-9 py-4 text-[11px] tracking-[0.22em] text-primary-foreground transition-colors hover:bg-primary-foreground hover:text-primary"
          >
            SHOP THE PRODUCTS
          </Link>
        </div>
      </section>
    </div>
  );
}
