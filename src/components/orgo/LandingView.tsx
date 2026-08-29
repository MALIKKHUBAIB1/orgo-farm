import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { inr, WHATSAPP_NUMBER, type Product } from "@/lib/orgo/products";
import { ProductCard } from "@/components/orgo/ProductCard";

export function LandingView({
  kicker,
  title,
  subtitle,
  intro,
  products,
  links,
  waMessage,
}: {
  kicker: string;
  title: string;
  subtitle: string;
  intro: string;
  products: Product[];
  links: { href: string; label: string }[];
  waMessage: string;
}) {
  return (
    <>
      <section className="paper border-b border-border">
        <div className="mx-auto max-w-[1280px] px-4 py-14 md:px-8 md:py-20">
          <p className="eyebrow text-accent">{kicker}</p>
          <h1 className="mt-3 font-display text-5xl text-primary md:text-6xl">{title}</h1>
          <p className="mt-3 text-sm text-muted-foreground">{subtitle}</p>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">{intro}</p>
          {links.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="border border-primary/30 px-4 py-2 text-[10px] tracking-[0.18em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-14 md:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 rounded-sm border border-border p-8 text-center">
          <p className="font-display text-2xl text-primary">Not sure which one to pick?</p>
          <p className="max-w-md text-sm text-muted-foreground">
            Talk to us on WhatsApp and we&apos;ll help you choose the right product. Orders start from{" "}
            {inr(Math.min(...products.map((p) => p.price)))}.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`}
            target="_blank"
            rel="noreferrer"
            className="mt-2 flex items-center gap-2 bg-primary px-8 py-3.5 text-[10px] tracking-[0.22em] text-primary-foreground"
          >
            <MessageCircle className="size-4" /> ORDER ON WHATSAPP
          </a>
        </div>
      </section>
    </>
  );
}