"use client";

import { useState } from "react";
import { Check, Link2, MessageCircle, Send, Share2 } from "lucide-react";
import { FacebookIcon } from "@/components/orgo/icons";

export function ShareRow({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const links = [
    {
      label: "Share on WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
      Icon: MessageCircle,
    },
    {
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      Icon: FacebookIcon,
    },
    {
      label: "Share on Telegram",
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      Icon: Send,
    },
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      Icon: Share2,
    },
  ];
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] font-semibold tracking-[0.2em] text-primary">SHARE</span>
      {links.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          title={label}
          className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <Icon className="size-4" />
        </a>
      ))}
      <button
        type="button"
        aria-label="Copy link"
        title="Copy link"
        onClick={() =>
          navigator.clipboard.writeText(url).then(
            () => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            },
            () => undefined,
          )
        }
        className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      >
        {copied ? <Check className="size-4 text-primary" /> : <Link2 className="size-4" />}
      </button>
    </div>
  );
}
