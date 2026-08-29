"use client";

import { useEffect, useState } from "react";
import { HelpCircle, RefreshCw } from "lucide-react";
import { adminFetch } from "@/lib/orgo/admin";
import { refreshCatalog } from "@/lib/orgo/catalog";
import { btnDanger, btnGhost, btnPrimary, inputCls } from "@/components/admin/ui";
import type { Faq } from "@/lib/orgo/faqs";

type Draft = { question: string; answer: string };

function FaqEditor({
  initial,
  onSave,
  onCancel,
}: {
  initial: (Faq & { _id: string }) | null;
  onSave: (d: Draft, isNew: boolean) => Promise<void>;
  onCancel: () => void;
}) {
  const [question, setQuestion] = useState(initial?.question ?? "");
  const [answer, setAnswer] = useState(initial?.answer ?? "");
  const [busy, setBusy] = useState(false);

  return (
    <div className="mt-5 rounded-lg border border-accent/40 bg-card p-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Question</span>
          <input className={inputCls} value={question} onChange={(e) => setQuestion(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Answer</span>
          <textarea className={inputCls} rows={3} value={answer} onChange={(e) => setAnswer(e.target.value)} />
        </label>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          className={btnPrimary}
          disabled={busy}
          onClick={async () => {
            if (!question.trim() || !answer.trim()) {
              alert("Both question and answer are required.");
              return;
            }
            setBusy(true);
            try {
              await onSave({ question: question.trim(), answer: answer.trim() }, !initial);
            } finally {
              setBusy(false);
            }
          }}
          type="button"
        >
          {busy ? "Saving..." : initial ? "Save changes" : "Add FAQ"}
        </button>
        <button className={btnGhost} onClick={onCancel} type="button">
          Cancel
        </button>
      </div>
    </div>
  );
}

export function FaqsManager() {
  const [faqs, setFaqs] = useState<(Faq & { _id: string })[]>([]);
  const [editing, setEditing] = useState<(Faq & { _id: string }) | null | "new" | undefined>(undefined);
  const [busyId, setBusyId] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = (await adminFetch<(Faq & { _id: string })[]>("/api/faqs")) ?? [];
        if (!cancelled) setFaqs(data);
      } catch {
        if (!cancelled) setFaqs([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const reload = async () => {
    try {
      setFaqs((await adminFetch<(Faq & { _id: string })[]>("/api/faqs")) ?? []);
    } catch {
      setFaqs([]);
    }
  };

  const move = async (index: number, step: number) => {
    const target = faqs[index + step];
    if (!target) return;
    const item = faqs[index];
    setBusyId(item._id);
    try {
      await Promise.all([
        adminFetch(`/api/admin/faqs/${item._id}`, {
          method: "PATCH",
          body: JSON.stringify({ sortOrder: target.sortOrder }),
        }),
        adminFetch(`/api/admin/faqs/${target._id}`, {
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
          <h1 className="font-display text-2xl text-primary">FAQs</h1>
          <p className="mt-1 text-sm text-muted-foreground">{faqs.length} questions on the FAQ page</p>
        </div>
        <div className="flex gap-2">
          <button className={btnGhost} onClick={reload} type="button">
            <RefreshCw className="size-3.5" /> Refresh
          </button>
          <button className={btnPrimary} onClick={() => setEditing("new")} type="button">
            + New FAQ
          </button>
        </div>
      </div>

      {editing === "new" ? (
        <FaqEditor
          initial={null}
          onCancel={() => setEditing(undefined)}
          onSave={async (d) => {
            await adminFetch("/api/admin/faqs", {
              method: "POST",
              body: JSON.stringify({ ...d, sortOrder: 0 }),
            });
            await reload();
            refreshCatalog();
            setEditing(undefined);
          }}
        />
      ) : null}

      <div className="mt-5 overflow-hidden rounded-lg border border-border bg-card">
        {faqs.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">No FAQs yet. Add one above.</p>
        ) : (
          <ul className="divide-y divide-border">
            {faqs.map((faq, i) => (
              <li key={faq._id} className="px-4 py-3">
                {editing === faq ? (
                  <FaqEditor
                    initial={faq}
                    onCancel={() => setEditing(undefined)}
                    onSave={async (d, isNew) => {
                      await adminFetch(`/api/admin/faqs/${faq._id}`, {
                        method: "PATCH",
                        body: JSON.stringify(d),
                      });
                      await reload();
                      refreshCatalog();
                      setEditing(undefined);
                    }}
                  />
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <HelpCircle className="size-4 shrink-0 text-primary" />
                        <span className="truncate">{faq.question}</span>
                      </p>
                      <p className="mt-1 pl-6 text-xs leading-relaxed text-muted-foreground">{faq.answer}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        className={btnGhost}
                        disabled={i === 0 || busyId === faq._id}
                        onClick={() => move(i, -1)}
                        type="button"
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        className={btnGhost}
                        disabled={i === faqs.length - 1 || busyId === faq._id}
                        onClick={() => move(i, 1)}
                        type="button"
                        title="Move down"
                      >
                        ↓
                      </button>
                      <button className={btnGhost} onClick={() => setEditing(faq)} type="button">
                        Edit
                      </button>
                      <button
                        className={btnDanger}
                        disabled={busyId === faq._id}
                        onClick={async () => {
                          if (!window.confirm(`Delete FAQ "${faq.question}"?`)) return;
                          setBusyId(faq._id);
                          try {
                            await adminFetch(`/api/admin/faqs/${faq._id}`, { method: "DELETE", body: JSON.stringify({}) });
                            await reload();
                            refreshCatalog();
                          } finally {
                            setBusyId("");
                          }
                        }}
                        type="button"
                      >
                        {busyId === faq._id ? "..." : "Delete"}
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