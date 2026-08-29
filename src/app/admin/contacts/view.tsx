"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/orgo/admin";
import { btnDanger, btnGhost } from "@/components/admin/ui";

type Message = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  read: boolean;
  createdAt: string;
};

function ago(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function ContactsManager() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [busyId, setBusyId] = useState("");
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const m = await adminFetch<Message[]>("/api/admin/messages");
        if (!cancelled) setMessages(m);
      } catch {
        if (!cancelled) setMessages([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [version]);

  const reload = async () => {
    try {
      setMessages(await adminFetch<Message[]>("/api/admin/messages"));
    } catch {
      setMessages([]);
    }
  };

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 md:px-6">
      <h1 className="font-display text-2xl text-primary">Contact Messages</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {messages.length} messages · <span className="font-medium text-accent">{unread} unread</span>
      </p>

      <div className="mt-6 space-y-3">
        {messages.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">No messages yet.</p>
        ) : (
          messages.map((m) => (
            <div
              key={m._id}
              className={`rounded-lg border bg-card p-5 ${m.read ? "border-border" : "border-accent/60"}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    {m.name}
                    {!m.read ? (
                      <span className="rounded bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                        New
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {m.email || "No email"} {m.phone ? `· ${m.phone}` : ""} · {ago(m.createdAt)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    className={btnGhost}
                    disabled={busyId === m._id}
                    onClick={async () => {
                      setBusyId(m._id);
                      try {
                        await adminFetch(`/api/admin/messages/${m._id}`, {
                          method: "PATCH",
                          body: JSON.stringify({ read: !m.read }),
                        });
                        await reload();
                      } finally {
                        setBusyId("");
                      }
                    }}
                    type="button"
                  >
                    {m.read ? "Mark unread" : "Mark read"}
                  </button>
                  <button
                    className={btnDanger}
                    disabled={busyId === m._id}
                    onClick={async () => {
                      if (!window.confirm("Delete this message?")) return;
                      setBusyId(m._id);
                      try {
                        await adminFetch(`/api/admin/messages/${m._id}`, { method: "DELETE", body: JSON.stringify({}) });
                        await reload();
                      } finally {
                        setBusyId("");
                      }
                    }}
                    type="button"
                  >
                    {busyId === m._id ? "..." : "Delete"}
                  </button>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground/85">{m.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}