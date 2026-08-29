"use client";

import Link from "next/link";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/orgo/icons";
import { img, WHATSAPP_NUMBER } from "@/lib/orgo/products";
import { API_URL } from "@/lib/orgo/api";

const cols = [
  {
    title: "SHOP",
    links: [
      { label: "All Products", to: "/shop" },
      { label: "Face Masks", to: "/type/face-masks" },
      { label: "Scrub Bars", to: "/type/scrub-bars" },
      { label: "Tan Removal", to: "/concerns/tan" },
      { label: "Acne Care", to: "/concerns/acne" },
      { label: "Curations", to: "/collections" },
    ],
  },
  {
    title: "ABOUT",
    links: [
      { label: "Our Story", to: "/about" },
      { label: "Our Philosophy", to: "/about" },
      { label: "Why ORGO FARM", to: "/about" },
    ],
  },
  {
    title: "HELP",
    links: [
      { label: "FAQ", to: "/faq" },
      { label: "Contact", to: "/contact" },
      { label: "Shipping", to: "/faq" },
      { label: "Returns", to: "/faq" },
      { label: "Track Order", to: "/account" },
    ],
  },
] as const;

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  return (
    <form
      className="mt-5"
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus("sending");
        setMessage("");
        try {
          const res = await fetch(`${API_URL}/api/subscriptions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email.trim() }),
          });
          const data: unknown = await res.json().catch(() => null);
          if (!res.ok) {
            const msg =
              data && typeof data === "object" && "error" in data && typeof data.error === "string"
                ? data.error
                : "Subscription failed";
            setMessage(msg);
            setStatus("error");
            return;
          }
          setMessage("You're on the list! New products will land in your inbox.");
          setStatus("done");
          setEmail("");
        } catch {
          setMessage("We couldn't reach the server. Please try again.");
          setStatus("error");
        }
      }}
    >
      <p className="text-sm font-medium text-primary-foreground/90">Join for new product alerts</p>
      <div className="mt-2 flex items-stretch gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="w-full min-w-0 rounded-md border border-primary-foreground/25 bg-primary-foreground/10 px-3 py-2 text-sm text-primary-foreground placeholder:text-primary-foreground/40 outline-none focus:border-primary-foreground/60"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className={`shrink-0 rounded-md bg-primary-foreground px-4 py-2 text-sm font-medium text-primary transition hover:opacity-90 disabled:opacity-50 ${
            status === "done" ? "opacity-90" : ""
          }`}
        >
          {status === "sending" ? "Joining..." : status === "done" ? "Subscribed" : "Subscribe"}
        </button>
      </div>
      {message ? (
        <p className={`mt-2 text-xs ${status === "error" ? "text-rose" : "text-primary-foreground/75"}`}>{message}</p>
      ) : null}
    </form>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-[1280px] gap-12 px-4 py-16 md:grid-cols-[1.4fr_repeat(4,1fr)] md:px-8">
        <div>
          <img src={img.logo} alt="ORGO FARM logo" className="size-16 rounded-full object-cover" />
          <p className="mt-5 font-display text-2xl tracking-[0.18em]">ORGO FARM</p>
          <p className="mt-2 text-sm text-primary-foreground/70">Pure & Natural Skincare Products</p>
          <p className="mt-6 font-script text-2xl text-primary-foreground/80">Handcrafted With Love</p>
          <NewsletterForm />
        </div>

        {cols.map((c) => (
          <div key={c.title}>
            <p className="eyebrow text-primary-foreground/60">{c.title}</p>
            <ul className="mt-5 space-y-3 text-sm">
              {c.links.map((l, i) => (
                <li key={c.title + i}>
                  <Link href={l.to} className="text-primary-foreground/85 transition-colors hover:text-primary-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <p className="eyebrow text-primary-foreground/60">FOLLOW</p>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <Link href="/instagram" className="flex items-center gap-2">
                <InstagramIcon className="size-4" /> Instagram Videos
              </Link>
            </li>
            <li>
              <a href="#" className="flex items-center gap-2">
                <FacebookIcon className="size-4" /> Facebook
              </a>
            </li>
            <li>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                <MessageCircle className="size-4" /> WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-4 py-6 text-xs text-primary-foreground/65 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="flex flex-wrap gap-6">
            <span>Privacy Policy</span>
            <span>Terms &amp; Conditions</span>
            <span>Shipping Policy</span>
            <Link href="/admin" className="text-primary-foreground/45 transition-colors hover:text-primary-foreground">
              Admin
            </Link>
          </div>
          <p>© ORGO FARM. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
