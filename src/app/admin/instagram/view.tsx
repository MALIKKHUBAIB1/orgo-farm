"use client";

import { useEffect, useState } from "react";
import { Video, Image as ImageIcon, RefreshCw } from "lucide-react";
import { adminFetch } from "@/lib/orgo/admin";
import { refreshCatalog } from "@/lib/orgo/catalog";
import { INSTAGRAM_URL } from "@/lib/orgo/social";
import { btnDanger, btnGhost, btnPrimary, inputCls } from "@/components/admin/ui";

type InstaPost = { _id: string; code: string; kind: "reel" | "p"; alt: string; sortOrder: number };

type Draft = { code: string; kind: "reel" | "p"; alt: string };

const INSTA_CODE_RX = /^[A-Za-z0-9_-]{4,20}$/;

function InstaEditor({
  initial,
  onSave,
  onCancel,
}: {
  initial: InstaPost | null;
  onSave: (d: Draft, isNew: boolean) => Promise<void>;
  onCancel: () => void;
}) {
  const [code, setCode] = useState(initial?.code ?? "");
  const [kind, setKind] = useState<"reel" | "p">(initial?.kind ?? "reel");
  const [alt, setAlt] = useState(initial?.alt ?? "");
  const [busy, setBusy] = useState(false);

  return (
    <div className="mt-5 rounded-lg border border-accent/40 bg-card p-4">
      <div className="grid gap-4 md:grid-cols-3">
        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Post code</span>
          <input
            className={inputCls}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. CxYf2kLM_noP"
          />
          <span className="mt-1 block text-[11px] text-muted-foreground/70">Shortcode from the reel URL</span>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Kind</span>
          <select className={inputCls} value={kind} onChange={(e) => setKind(e.target.value as "reel" | "p")}>
            <option value="reel">Reel</option>
            <option value="p">Post</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Label</span>
          <input className={inputCls} value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Short caption" />
        </label>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          className={btnPrimary}
          disabled={busy}
          onClick={async () => {
            const c = code.trim();
            if (!INSTA_CODE_RX.test(c)) {
              alert("Code must be 4–20 characters (letters, numbers, dashes, underscores) — e.g. the part after /reel/.");
              return;
            }
            if (!alt.trim()) {
              alert("Label is required.");
              return;
            }
            setBusy(true);
            try {
              await onSave({ code: c, kind, alt: alt.trim() }, !initial);
            } finally {
              setBusy(false);
            }
          }}
          type="button"
        >
          {busy ? "Saving..." : initial ? "Save changes" : "Add post"}
        </button>
        <button className={btnGhost} onClick={onCancel} type="button">
          Cancel
        </button>
        <span className="text-[11px] text-muted-foreground/70">
          Opens at {INSTAGRAM_URL}
          {kind}/{code.trim() || "…"}
        </span>
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground/70">
        Tip: Asli shortcode use karo (URL me /reel/ ke baad ka part). Reel aur post dono embed hote hain.
        Agar kisi reel pe &ldquo;content blocked&rdquo; dikhe to uska matlab Instagram us reel ko
        (music/region) embed nahi karne deta — alag reel chuno ya Instagram pe hi share rakho.
      </p>
    </div>
  );
}

export function InstaManager() {
  const [posts, setPosts] = useState<InstaPost[]>([]);
  const [editing, setEditing] = useState<InstaPost | null | "new" | undefined>(undefined);
  const [busyId, setBusyId] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = (await adminFetch<InstaPost[]>("/api/instagram/posts")) ?? [];
        if (!cancelled) setPosts(data);
      } catch {
        if (!cancelled) setPosts([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const reload = async () => {
    try {
      setPosts((await adminFetch<InstaPost[]>("/api/instagram/posts")) ?? []);
    } catch {
      setPosts([]);
    }
  };

  const move = async (index: number, step: number) => {
    const target = posts[index + step];
    if (!target) return;
    const item = posts[index];
    setBusyId(item._id);
    try {
      await Promise.all([
        adminFetch(`/api/admin/instagram/${item._id}`, {
          method: "PATCH",
          body: JSON.stringify({ sortOrder: target.sortOrder }),
        }),
        adminFetch(`/api/admin/instagram/${target._id}`, {
          method: "PATCH",
          body: JSON.stringify({ sortOrder: item.sortOrder }),
        }),
      ]);
      await reload();
      refreshCatalog();
    } finally {
      setBusyId("");
    }
  };

  return (
    <div className="mx-auto max-w-[1000px] px-4 py-8 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-primary">Instagram Posts</h1>
          <p className="mt-1 text-sm text-muted-foreground">{posts.length} videos embedded on the Instagram page</p>
        </div>
        <div className="flex gap-2">
          <button className={btnGhost} onClick={reload} type="button">
            <RefreshCw className="size-3.5" /> Refresh
          </button>
          <button className={btnPrimary} onClick={() => setEditing("new")} type="button">
            + New post
          </button>
        </div>
      </div>

      {editing === "new" ? (
        <InstaEditor
          initial={null}
          onCancel={() => setEditing(undefined)}
          onSave={async (d) => {
            await adminFetch("/api/admin/instagram", { method: "POST", body: JSON.stringify({ ...d, sortOrder: 0 }) });
            await reload();
            refreshCatalog();
            setEditing(undefined);
          }}
        />
      ) : null}

      <div className="mt-5 overflow-hidden rounded-lg border border-border bg-card">
        {posts.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">
            No posts yet. Paste a reel shortcode above to embed your first video.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {posts.map((post, i) => (
              <li key={post._id} className="px-4 py-3">
                {editing === post ? (
                  <InstaEditor
                    initial={post}
                    onCancel={() => setEditing(undefined)}
                    onSave={async (d) => {
                      await adminFetch(`/api/admin/instagram/${post._id}`, {
                        method: "PATCH",
                        body: JSON.stringify(d),
                      });
                      await reload();
                      refreshCatalog();
                      setEditing(undefined);
                    }}
                  />
                ) : (
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex aspect-square w-14 shrink-0 items-center justify-center rounded-md border border-border ${
                        post.kind === "reel" ? "bg-gradient-to-br from-primary to-primary/70" : "bg-beige/40"
                      }`}
                    >
                      {post.kind === "reel" ? (
                        <Video className="size-6 text-white" />
                      ) : (
                        <ImageIcon className="size-5 text-primary/60" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <Video className="size-4 shrink-0 text-primary" />
                        <span className="truncate">{post.alt}</span>
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {INSTAGRAM_URL}
                        {post.kind}/{post.code}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        className={btnGhost}
                        disabled={i === 0 || busyId === post._id}
                        onClick={() => move(i, -1)}
                        type="button"
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        className={btnGhost}
                        disabled={i === posts.length - 1 || busyId === post._id}
                        onClick={() => move(i, 1)}
                        type="button"
                        title="Move down"
                      >
                        ↓
                      </button>
                      <button className={btnGhost} onClick={() => setEditing(post)} type="button">
                        Edit
                      </button>
                      <button
                        className={btnDanger}
                        disabled={busyId === post._id}
                        onClick={async () => {
                          if (!window.confirm(`Remove post "${post.alt}"?`)) return;
                          setBusyId(post._id);
                          try {
                            await adminFetch(`/api/admin/instagram/${post._id}`, { method: "DELETE", body: JSON.stringify({}) });
                            await reload();
                            refreshCatalog();
                          } finally {
                            setBusyId("");
                          }
                        }}
                        type="button"
                      >
                        {busyId === post._id ? "..." : "Delete"}
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}