"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch, adminUploadImage } from "@/lib/orgo/admin";
import { refreshCatalog } from "@/lib/orgo/catalog";
import { resolveImage } from "@/lib/orgo/image";
import { inr, type Product } from "@/lib/orgo/products";
import { Field, btnDanger, btnGhost, btnPrimary, inputCls } from "@/components/admin/ui";

type ProductDraft = {
  name: string;
  slug: string;
  size: string;
  price: number;
  eachNote: string;
  badge: string;
  category: string;
  type: string;
  concernsText: string;
  short: string;
  description: string;
  benefitsText: string;
  ingredients: string;
  howToUse: string;
  suitableFor: string;
  image: string;
  galleryText: string;
  inStock: boolean;
  featured: boolean;
};

const emptyDraft: ProductDraft = {
  name: "",
  slug: "",
  size: "",
  price: 0,
  eachNote: "",
  badge: "",
  category: "",
  type: "",
  concernsText: "",
  short: "",
  description: "",
  benefitsText: "",
  ingredients: "",
  howToUse: "",
  suitableFor: "",
  image: "",
  galleryText: "",
  inStock: true,
  featured: false,
};

function toDraft(p: Product): ProductDraft {
  return {
    name: p.name,
    slug: p.slug,
    size: p.size,
    price: p.price,
    eachNote: p.eachNote ?? "",
    badge: p.badge ?? "",
    category: p.category,
    type: p.type,
    concernsText: p.concerns.join(", "),
    short: p.short,
    description: p.description,
    benefitsText: p.benefits.join("\n"),
    ingredients: p.ingredients,
    howToUse: p.howToUse,
    suitableFor: p.suitableFor ?? "",
    image: p.image,
    galleryText: p.gallery.join(", "),
    inStock: p.inStock,
    featured: p.featured,
  };
}

function galleryPaths(text: string) {
  return text.split(",").map((s) => s.trim()).filter(Boolean);
}

function fromDraft(d: ProductDraft) {
  return {
    name: d.name.trim(),
    slug: d.slug.trim().toLowerCase(),
    size: d.size.trim(),
    price: Number(d.price),
    eachNote: d.eachNote.trim() || undefined,
    badge: d.badge.trim() || undefined,
    category: d.category.trim(),
    type: d.type.trim(),
    concerns: d.concernsText.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 10),
    short: d.short.trim(),
    description: d.description.trim(),
    benefits: d.benefitsText.split("\n").map((s) => s.trim()).filter(Boolean).slice(0, 10),
    ingredients: d.ingredients.trim(),
    howToUse: d.howToUse.trim(),
    suitableFor: d.suitableFor.trim() || "",
    image: d.image.trim(),
    gallery: galleryPaths(d.galleryText).slice(0, 12),
    inStock: d.inStock,
    featured: d.featured,
  };
}

function ProductForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: ProductDraft | null;
  onSave: (d: ProductDraft, isNew: boolean) => Promise<void>;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<ProductDraft>(initial ?? emptyDraft);
  const [priceText, setPriceText] = useState(initial ? String(initial.price) : "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const galleryList = useMemo(() => galleryPaths(draft.galleryText), [draft.galleryText]);

  const set = <K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) => {
    setError("");
    setDraft((d) => ({ ...d, [key]: value }));
  };

  const onPriceChange = (raw: string) => {
    const filtered = raw.replace(/[^0-9.]/g, "");
    const firstDot = filtered.indexOf(".");
    const int = firstDot === -1 ? filtered : filtered.slice(0, firstDot);
    const dec = firstDot === -1 ? "" : filtered.slice(firstDot + 1).replace(/\./g, "").slice(0, 2);
    const clean = (int ? String(Number(int)) : "") + (dec ? `.${dec}` : "");
    const n = clean === "" ? 0 : Number(clean);
    setError("");
    setPriceText(firstDot !== -1 ? `${int}.${dec}` : filtered);
    setDraft((d) => ({ ...d, price: Number.isFinite(n) ? n : 0 }));
  };

  const onUpload = async (file: File) => {
    setUploading(true);
    try {
      const path = await adminUploadImage(file);
      set("image", path);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onUploadGallery = async (file: File) => {
    setUploadingGallery(true);
    try {
      const path = await adminUploadImage(file);
      set("galleryText", [...galleryList, path].join(", "));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGallery = (path: string) =>
    set("galleryText", galleryList.filter((p) => p !== path).join(", "));

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-primary">{initial ? "Edit Product" : "New Product"}</h1>
        <button className={btnGhost} onClick={onCancel} type="button">
          Back to list
        </button>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Field label="Product name">
          <input className={inputCls} value={draft.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field label="Slug" hint="Lowercase letters, numbers & dashes. Used in the URL.">
          <input className={inputCls} value={draft.slug} onChange={(e) => set("slug", e.target.value)} />
        </Field>
        <Field label="Size">
          <input className={inputCls} value={draft.size} onChange={(e) => set("size", e.target.value)} placeholder="50g" />
        </Field>
        <Field label="Price (₹)">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₹</span>
            <input
              className={`${inputCls} pl-8`}
              type="text"
              inputMode="decimal"
              value={priceText}
              placeholder="0"
              onChange={(e) => onPriceChange(e.target.value)}
            />
          </div>
        </Field>
        <Field label="Each note" hint="Optional, e.g. ₹150 each">
          <input className={inputCls} value={draft.eachNote} onChange={(e) => set("eachNote", e.target.value)} />
        </Field>
        <Field label="Badge" hint="Optional, e.g. BESTSELLER">
          <input className={inputCls} value={draft.badge} onChange={(e) => set("badge", e.target.value)} />
        </Field>
        <Field label="Category">
          <input className={inputCls} value={draft.category} onChange={(e) => set("category", e.target.value)} />
        </Field>
        <Field label="Type">
          <input className={inputCls} value={draft.type} onChange={(e) => set("type", e.target.value)} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Concerns" hint="Comma separated, e.g. Acne, Tan, Dullness">
            <input className={inputCls} value={draft.concernsText} onChange={(e) => set("concernsText", e.target.value)} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Short description">
            <input className={inputCls} value={draft.short} onChange={(e) => set("short", e.target.value)} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Description">
            <textarea className={inputCls} rows={4} value={draft.description} onChange={(e) => set("description", e.target.value)} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Benefits" hint="One per line">
            <textarea className={inputCls} rows={4} value={draft.benefitsText} onChange={(e) => set("benefitsText", e.target.value)} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Ingredients">
            <textarea className={inputCls} rows={3} value={draft.ingredients} onChange={(e) => set("ingredients", e.target.value)} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="How to use">
            <textarea className={inputCls} rows={3} value={draft.howToUse} onChange={(e) => set("howToUse", e.target.value)} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Suitable for">
            <input className={inputCls} value={draft.suitableFor} onChange={(e) => set("suitableFor", e.target.value)} />
          </Field>
        </div>
      </div>

      <div className="mt-8">
        <span className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">Main image</span>
        <div className="mt-3 grid gap-5 sm:grid-cols-[auto_1fr]">
          {draft.image ? (
            <div className="relative size-44 overflow-hidden rounded-lg border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolveImage(draft.image)}
                alt="Main image preview"
                className="size-full object-cover"
                onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
              />
              <button
                className="absolute right-1.5 top-1.5 rounded-full bg-black/70 px-2 py-0.5 text-[11px] font-medium text-white hover:bg-black"
                onClick={() => set("image", "")}
                type="button"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex size-44 items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
              No image set
            </div>
          )}
          <div className="flex flex-col justify-start gap-2 sm:max-w-md">
            <label className="inline-flex cursor-pointer items-center justify-center gap-2 self-start rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
              {uploading ? "Uploading..." : draft.image ? "Upload to replace" : "Upload image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void onUpload(file);
                  e.target.value = "";
                }}
              />
            </label>
            <input
              className={inputCls}
              value={draft.image}
              onChange={(e) => set("image", e.target.value)}
              placeholder="/orgo/face-pack.jpg or /uploads/..."
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between gap-3">
          <span className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Gallery photos <span className="normal-case">({galleryList.length})</span>
          </span>
          <label className="inline-flex cursor-pointer items-center gap-2 self-start rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50">
            {uploadingGallery ? "Uploading..." : "+ Add photo"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploadingGallery}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void onUploadGallery(file);
                e.target.value = "";
              }}
            />
          </label>
        </div>

        {galleryList.length > 0 ? (
          <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {galleryList.map((path) => (
              <div key={path} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolveImage(path)}
                  alt="Gallery preview"
                  className="size-full object-cover"
                  onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                />
                <button
                  className="absolute right-1.5 top-1.5 rounded-full bg-black/70 px-2 py-0.5 text-[11px] font-medium text-white opacity-0 transition group-hover:opacity-100 hover:bg-black"
                  onClick={() => removeGallery(path)}
                  type="button"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-xs text-muted-foreground">No gallery photos yet.</p>
        )}

        <div className="mt-3">
          <p className="mb-1 text-[11px] text-muted-foreground/70">Comma separated image paths (or use Add photo)</p>
          <input
            className={inputCls}
            value={draft.galleryText}
            onChange={(e) => set("galleryText", e.target.value)}
            placeholder="/orgo/face-pack-1.jpg, /orgo/face-pack-2.jpg"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-5">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={draft.inStock} onChange={(e) => set("inStock", e.target.checked)} />
          In stock
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={draft.featured} onChange={(e) => set("featured", e.target.checked)} />
          Featured
        </label>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <button
          className={btnPrimary}
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setError("");
            try {
              await onSave(draft, !initial);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Something went wrong");
            } finally {
              setBusy(false);
            }
          }}
          type="button"
        >
          {busy ? "Saving..." : initial ? "Save changes" : "Create product"}
        </button>
        <button className={btnGhost} onClick={onCancel} type="button">
          Cancel
        </button>
        {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
      </div>
    </div>
  );
}

export function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Product | null | "new" | undefined>(undefined);
  const [busyId, setBusyId] = useState("");
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const p = await adminFetch<Product[]>("/api/products");
        if (!cancelled) setProducts(p);
      } catch {
        if (!cancelled) setProducts([]);
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

  const reload = async () => {
    try {
      setProducts(await adminFetch<Product[]>("/api/products"));
    } catch {
      setProducts([]);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q),
    );
  }, [products, query]);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 md:px-6">
      <h1 className="font-display text-2xl text-primary">Product Management</h1>
      <p className="mt-1 text-sm text-muted-foreground">{products.length} products in the store</p>

      {editing === undefined ? (
        <>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <input
              className={`${inputCls} w-64`}
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className={btnPrimary} onClick={() => setEditing("new")} type="button">
              + New product
            </button>
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border border-border bg-card">
            {filtered.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-muted-foreground">No products found.</p>
            ) : (
              <ul className="divide-y divide-border">
                {filtered.map((p) => (
                  <li key={p.slug} className="flex flex-wrap items-center gap-4 px-4 py-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={resolveImage(p.image)}
                      alt={p.name}
                      className="h-12 w-12 shrink-0 rounded-md border border-border object-cover"
                      onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.slug} · {p.category} / {p.type}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="hidden rounded bg-beige/60 px-2 py-1 font-medium text-primary sm:inline">{inr(p.price)}</span>
                      {p.badge ? <span className="hidden rounded border border-accent/40 px-2 py-1 text-accent lg:inline">{p.badge}</span> : null}
                      <button
                        className={`rounded px-2 py-1 ${p.inStock ? "bg-primary/10 text-primary" : "bg-rose/10 text-rose"}`}
                        onClick={async () => {
                          setBusyId(p.slug);
                          try {
                            await adminFetch(`/api/products/${p.slug}`, { method: "PATCH", body: JSON.stringify({ inStock: !p.inStock }) });
                            await reload();
                            refreshCatalog();
                          } finally {
                            setBusyId("");
                          }
                        }}
                        disabled={busyId === p.slug}
                        type="button"
                        title="Toggle stock"
                      >
                        {busyId === p.slug ? "..." : p.inStock ? "In stock" : "Out of stock"}
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className={btnGhost} onClick={() => setEditing(p)} type="button">
                        Edit
                      </button>
                      <button
                        className={btnDanger}
                        onClick={async () => {
                          if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
                          setBusyId(p.slug);
                          try {
                            await adminFetch(`/api/products/${p.slug}`, { method: "DELETE", body: JSON.stringify({}) });
                            await reload();
                            refreshCatalog();
                          } finally {
                            setBusyId("");
                          }
                        }}
                        disabled={busyId === p.slug}
                        type="button"
                      >
                        {busyId === p.slug ? "..." : "Delete"}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      ) : (
        <ProductForm
          initial={editing && editing !== "new" ? toDraft(editing) : null}
          onCancel={() => setEditing(undefined)}
          onSave={async (draft, isNew) => {
            const body = fromDraft(draft);
            if (isNew) {
              await adminFetch("/api/products", { method: "POST", body: JSON.stringify(body) });
            } else {
              await adminFetch(`/api/products/${body.slug}`, { method: "PATCH", body: JSON.stringify(body) });
            }
            await reload();
            refreshCatalog();
            setEditing(undefined);
          }}
        />
      )}
    </div>
  );
}