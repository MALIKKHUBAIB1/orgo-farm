import { Fragment } from "react";
import { headingId } from "@/lib/orgo/blog-types";
import type { PortableBlock, PortableSpan } from "@/lib/orgo/blog-types";

function renderSpans(block: PortableBlock) {
  const defs = block.markDefs ?? [];
  return (block.children ?? []).map((span: PortableSpan, i: number) => {
    let node: React.ReactNode = span.text;
    for (const mark of span.marks ?? []) {
      if (mark === "strong") node = <strong key={mark}>{node}</strong>;
      else if (mark === "em") node = <em key={mark}>{node}</em>;
      else if (mark === "code")
        node = (
          <code key={mark} className="rounded bg-muted px-1 font-mono text-sm">
            {node}
          </code>
        );
      else {
        const def = defs.find((d) => d._key === mark);
        if (def?._type === "link" && def.href) {
          node = (
            <a
              key={mark}
              href={def.href}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-primary underline"
            >
              {node}
            </a>
          );
        }
      }
    }
    return <Fragment key={span._key ?? i}>{node}</Fragment>;
  });
}

/** Minimal Sanity Portable Text renderer (headings, text, quotes, lists, images). */
export function PortableText({ blocks }: { blocks: PortableBlock[] }) {
  const out: React.ReactNode[] = [];
  let list: { type: "bullet" | "number"; items: PortableBlock[] } | null = null;

  const flushList = (key: string) => {
    if (!list) return;
    const items = list.items.map((b, i) => <li key={b._key ?? i}>{renderSpans(b)}</li>);
    out.push(
      list.type === "number" ? (
        <ol key={key} className="my-4 list-decimal space-y-2 pl-6 text-muted-foreground">
          {items}
        </ol>
      ) : (
        <ul key={key} className="my-4 list-disc space-y-2 pl-6 text-muted-foreground">
          {items}
        </ul>
      ),
    );
    list = null;
  };

  blocks.forEach((b, i) => {
    const key = b._key ?? String(i);
    if (b._type === "image" && b.url) {
      flushList(`l-${key}`);
      out.push(
        <figure key={key} className="my-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={b.url} alt={b.alt || ""} loading="lazy" className="w-full object-cover soft-shadow" />
        </figure>,
      );
      return;
    }
    if (b._type !== "block") return;
    if (b.listItem) {
      if (!list || list.type !== b.listItem) {
        flushList(`l-${key}`);
        list = { type: b.listItem, items: [] };
      }
      list.items.push(b);
      return;
    }
    flushList(`l-${key}`);
    const kids = renderSpans(b);
    // Anchor ids power the table of contents (must match tocFromBlocks).
    const anchor = ["h1", "h2", "h3", "h4"].includes(b.style ?? "")
      ? headingId((b.children ?? []).map((s) => s.text).join(""))
      : undefined;
    switch (b.style) {
      case "h1":
        out.push(
          <h1 key={key} id={anchor} className="mt-8 scroll-mt-24 font-display text-4xl text-primary">
            {kids}
          </h1>,
        );
        break;
      case "h2":
        out.push(
          <h2 key={key} id={anchor} className="mt-8 scroll-mt-24 font-display text-3xl text-primary">
            {kids}
          </h2>,
        );
        break;
      case "h3":
        out.push(
          <h3 key={key} id={anchor} className="mt-6 scroll-mt-24 font-display text-2xl text-primary">
            {kids}
          </h3>,
        );
        break;
      case "h4":
        out.push(
          <h4 key={key} id={anchor} className="mt-6 scroll-mt-24 text-lg font-semibold text-primary">
            {kids}
          </h4>,
        );
        break;
      case "blockquote":
        out.push(
          <blockquote key={key} className="my-4 border-l-4 border-accent pl-4 italic text-muted-foreground">
            {kids}
          </blockquote>,
        );
        break;
      default:
        out.push(
          <p key={key} className="my-4 text-[15px] leading-relaxed text-muted-foreground">
            {kids}
          </p>,
        );
    }
  });
  flushList("l-end");

  return <>{out}</>;
}
