"use client";

import { useEffect, useState } from "react";
import { Eye, Loader2 } from "lucide-react";
import { adminFetch, adminUploadImage } from "@/lib/orgo/admin";
import { refreshCatalog } from "@/lib/orgo/catalog";
import type { HeroSettings } from "@/lib/orgo/hero-settings";
import { img } from "@/lib/orgo/products";
import { Field, btnGhost, btnPrimary, inputCls } from "@/components/admin/ui";

const defaults: HeroSettings = {
  heroImage: "",
  overlayImage: "",
  tagline: "",
  title: "",
  subtitle: "",
};

function HeroPreview({ settings }: { settings: HeroSettings }) {
  const heroImage = settings.heroImage || img.soapCollection;
  const overlayImage = settings.overlayImage || img.facePack;
  const tagline = settings.tagline || "Handcrafted with Love";
  const title = settings.title || "Pure Care.<br>Straight From Nature.";
  const subtitle =
    settings.subtitle ||
    "Premium handmade skincare crafted with natural, farm-fresh ingredients and brought directly from the farm to your skin.";
  const [titleA, ...titleRest] = title.split("<br>");

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border bg-beige/40 px-4 py-2">
        <Eye className="size-3.5 text-muted-foreground" />
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Live preview — this is exactly what appears on the homepage
        </span>
      </div>
      <div className="p-5">
        <div className="grid items-center gap-6 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <p className="font-script text-2xl text-rose">{tagline}</p>
            <h1 className="mt-3 text-3xl leading-[1.1] text-primary md:text-4xl">
              {titleA}
              <br />
              {titleRest.join("<br>")}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
          </div>
          <div className="relative">
            <div className="absolute -left-6 top-6 hidden size-32 rounded-full bg-beige/70 blur-3xl md:block" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImage}
              alt="Hero preview"
              className="relative aspect-[4/5] w-full rounded-t-[999px] object-cover"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={overlayImage}
              alt="Overlay preview"
              className="absolute -bottom-4 -left-4 hidden w-24 rounded-sm object-cover md:block"
              onError={(e) => ((e.target as HTMLImageElement).src = img.facePack)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

type ImagePickerProps = {
  label: string;
  url: string;
  onChange: (url: string) => void;
  auto: string;
};

function ImagePicker({ label, url, onChange, auto }: ImagePickerProps) {
  const [uploading, setUploading] = useState(false);
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="flex gap-3">
        <div className="h-32 w-28 shrink-0 overflow-hidden rounded-md border border-border bg-beige/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url || auto}
            alt={label}
            className="h-full w-full object-cover"
            onError={(e) => ((e.target as HTMLImageElement).src = auto)}
          />
        </div>
        <div className="flex-1 space-y-2">
          <label className="block">
            <span className="mb-1 block text-[11px] text-muted-foreground/70">Image URL (or upload)</span>
            <input className={inputCls} value={url} onChange={(e) => onChange(e.target.value)} placeholder="https://..." />
          </label>
          <div className="flex gap-2">
            <button
              className={btnGhost}
              disabled={uploading}
              onClick={async () => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = async () => {
                  const file = input.files?.[0];
                  if (!file) return;
                  setUploading(true);
                  try {
                    const uploaded = await adminUploadImage(file, "/hero");
                    onChange(uploaded);
                  } catch (err) {
                    alert(err instanceof Error ? err.message : "Upload failed");
                  } finally {
                    setUploading(false);
                  }
                };
                input.click();
              }}
              type="button"
            >
              {uploading ? <Loader2 className="size-3.5 animate-spin" /> : "Upload"}
            </button>
            <span className="self-center text-[11px] text-muted-foreground/60">Empty = default image</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSettingsManager() {
  const [settings, setSettings] = useState<HeroSettings>(defaults);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await adminFetch<{ settings: HeroSettings | null }>("/api/admin/hero-settings");
        if (!cancelled && data.settings) setSettings({ ...defaults, ...data.settings });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const set = <K extends keyof HeroSettings>(key: K, value: HeroSettings[K]) =>
    setSettings((s) => ({ ...s, [key]: value }));

  const save = async () => {
    setBusy(true);
    try {
      await adminFetch<{ settings: HeroSettings }>("/api/admin/hero-settings", {
        method: "PUT",
        body: JSON.stringify(settings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      refreshCatalog();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save settings.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center"><p className="text-sm text-muted-foreground">Loading hero settings...</p></div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-8">
      <h1 className="font-display text-2xl text-primary">Hero Section</h1>
      <p className="mt-1 text-xs text-muted-foreground">
        Change the hero section images and text at the top of the homepage. Save to update the homepage instantly.
      </p>

      <div className="mt-6">
        <HeroPreview settings={settings} />
      </div>

      <div className="mt-6 space-y-5">
        <section className="rounded-lg border border-accent/40 bg-card p-5">
          <ImagePicker
            label="Main hero image"
            url={settings.heroImage}
            onChange={(url) => set("heroImage", url)}
            auto={img.soapCollection}
          />
        </section>

        <section className="rounded-lg border border-accent/40 bg-card p-5">
          <ImagePicker
            label="Overlay image (small pouch)"
            url={settings.overlayImage}
            onChange={(url) => set("overlayImage", url)}
            auto={img.facePack}
          />
        </section>

        <section className="rounded-lg border border-accent/40 bg-card p-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Text content</p>
          <div className="grid gap-4">
            <Field label="Tagline" hint="e.g. Handcrafted with Love">
              <input className={inputCls} value={settings.tagline} onChange={(e) => set("tagline", e.target.value)} />
            </Field>
            <Field label="Title" hint="Use <br> for a line break">
              <input className={inputCls} value={settings.title} onChange={(e) => set("title", e.target.value)} placeholder="Pure Care.<br>Straight From Nature." />
            </Field>
            <Field label="Subtitle">
              <textarea className={inputCls} rows={3} value={settings.subtitle} onChange={(e) => set("subtitle", e.target.value)} />
            </Field>
          </div>
        </section>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <button className={btnPrimary} disabled={busy} onClick={save} type="button">
          {busy ? "Saving..." : "Save hero"}
        </button>
        {saved ? <span className="text-sm text-accent">Saved — homepage updated!</span> : null}
        <button className={btnGhost} onClick={() => setSettings(defaults)} type="button">
          Reset to defaults
        </button>
      </div>
    </div>
  );
}