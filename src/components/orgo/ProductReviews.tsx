"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "@/components/orgo/Reveal";
import {
  formatReviewDate,
  submitReview,
  summarizeReviews,
  type Review,
} from "@/lib/orgo/reviews";

export function Stars({ value, className = "size-3.5" }: { value: number; className?: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-terracotta">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`${className} ${i < Math.round(value) ? "fill-current" : "opacity-25"}`} />
      ))}
    </span>
  );
}

export function ProductReviews({
  slug,
  productName,
  reviews,
  onAdd,
}: {
  slug: string;
  productName: string;
  reviews: Review[];
  onAdd: (r: Review) => void;
}) {
  const summary = summarizeReviews(reviews);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      toast.error("Please add your name and review");
      return;
    }
    setSending(true);
    try {
      const created = await submitReview(slug, {
        name: name.trim(),
        rating,
        title: title.trim(),
        comment: comment.trim(),
      });
      onAdd(created);
      setName("");
      setTitle("");
      setComment("");
      setRating(5);
      toast.success("Thank you! Your review is live.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit review");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="paper border-t border-border">
      <div className="mx-auto max-w-[1280px] px-4 py-20 md:px-8 md:py-24">
        {/* Heading */}
        <div className="text-center">
          <p className="font-script text-3xl text-rose">Customer Love</p>
          <h2 className="mt-3 text-4xl text-primary md:text-5xl">What Real Skin Says</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Genuine reviews from people using {productName} in their daily ritual.
          </p>
        </div>

        {/* Half-half: score + reviews on the left, form on the right */}
        <div className="mt-12 grid items-start gap-8 lg:grid-cols-2">
          <div className="space-y-8">
            {/* Summary */}
            <div className="flex flex-col gap-6 bg-card px-8 py-8 soft-shadow sm:flex-row sm:items-center sm:gap-8">
              <div className="text-center sm:min-w-28">
                <p className="font-display text-6xl leading-none text-primary">
                  {summary.count ? summary.avg.toFixed(1) : "—"}
                </p>
                <div className="mt-2 flex justify-center">
                  <Stars value={summary.count ? summary.avg : 0} className="size-4" />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {summary.count ? `${summary.count} review${summary.count === 1 ? "" : "s"}` : "No reviews yet"}
                </p>
              </div>
              <div className="hidden h-20 w-px shrink-0 bg-border sm:block" />
              <div className="w-full flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((s) => {
                  const n = summary.dist[s - 1];
                  const pct = summary.count ? Math.round((n / summary.count) * 100) : 0;
                  return (
                    <div key={s} className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex w-8 shrink-0 items-center gap-1">
                        {s} <Star className="size-3 fill-terracotta text-terracotta" />
                      </span>
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <span className="block h-full rounded-full bg-terracotta" style={{ width: `${pct}%` }} />
                      </span>
                      <span className="w-6 shrink-0 text-right">{n}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Review cards */}
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((r, i) => (
                  <Reveal key={r.id} delay={Math.min(i * 0.06, 0.3)}>
                    <figure className="flex h-full flex-col bg-card p-8 soft-shadow">
                      <div className="flex items-center justify-between gap-3">
                        <Stars value={r.rating} />
                        <span className="text-xs text-muted-foreground">{formatReviewDate(r.createdAt)}</span>
                      </div>
                      {r.title ? (
                        <p className="mt-4 font-display text-2xl leading-snug text-primary">{r.title}</p>
                      ) : null}
                      <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                        “{r.comment}”
                      </blockquote>
                      <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary font-display text-lg text-primary-foreground">
                          {r.name.charAt(0).toUpperCase()}
                        </span>
                        <span>
                          <span className="block text-sm font-medium text-primary">{r.name}</span>
                          <span className="mt-0.5 block text-[10px] tracking-[0.16em] text-accent">
                            VERIFIED PURCHASE
                          </span>
                        </span>
                      </figcaption>
                    </figure>
                  </Reveal>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center font-script text-3xl text-primary/70">
                No stories yet — yours could be the first glow.
              </p>
            )}
          </div>

          {/* Form */}
          <div className="bg-card p-8 soft-shadow md:p-10 lg:sticky lg:top-28">
            <p className="text-center font-script text-3xl text-rose">Share Your Glow</p>
            <h3 className="mt-2 text-center text-3xl text-primary">Write a Review</h3>
            <form onSubmit={submit} className="mt-8">
              <div className="flex flex-col items-center gap-2 border-y border-border py-6">
                <p className="eyebrow text-muted-foreground">Tap to rate</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      aria-label={`${s} star${s === 1 ? "" : "s"}`}
                      className="text-terracotta transition-transform hover:scale-110"
                    >
                      <Star className={`size-8 ${s <= rating ? "fill-current" : "opacity-25"}`} />
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {["", "Not for me", "It's okay", "Good", "Love it", "Holy grail!"][rating]}
                </p>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="eyebrow text-muted-foreground">Your name *</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={60}
                    placeholder="e.g. Priya Sharma"
                    className="mt-2 w-full border border-input bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
                  />
                </label>
                <label className="block">
                  <span className="eyebrow text-muted-foreground">Headline</span>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={120}
                    placeholder="e.g. My skin glows!"
                    className="mt-2 w-full border border-input bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
                  />
                </label>
              </div>
              <label className="mt-4 block">
                <span className="eyebrow text-muted-foreground">Your story *</span>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={1000}
                  rows={4}
                  placeholder={`How did ${productName} work for your skin?`}
                  className="mt-2 w-full resize-y border border-input bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
                />
              </label>
              <button
                type="submit"
                disabled={sending}
                className="mt-6 w-full bg-primary py-4 text-[11px] tracking-[0.24em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {sending ? "SHARING..." : "SHARE MY REVIEW"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
