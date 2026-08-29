"use client";

import { useEffect, useState } from "react";
import { Mail, RefreshCw, Send } from "lucide-react";
import { adminFetch } from "@/lib/orgo/admin";
import { btnDanger, btnGhost, btnPrimary } from "@/components/admin/ui";

type Subscriber = {
  _id: string;
  email: string;
  active: boolean;
  createdAt: string;
};

type Report = {
  _id: string;
  productNames: string[];
  sentTo: number;
  failed: number;
  status: "sent" | "no-subscribers" | "no-products";
  createdAt: string;
};

function ago(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days}d ago`;
  const hrs = Math.floor(diff / 3600000);
  if (hrs > 0) return `${hrs}h ago`;
  const mins = Math.floor(diff / 60000);
  return mins < 1 ? "just now" : `${mins}m ago`;
}

export function SubscribersManager() {
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [busyId, setBusyId] = useState("");
  const [running, setRunning] = useState(false);
  const [runMessage, setRunMessage] = useState("");
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [s, r] = await Promise.all([
          adminFetch<Subscriber[]>("/api/admin/subscriptions"),
          adminFetch<Report[]>("/api/admin/newsletter/reports"),
        ]);
        if (!cancelled) {
          setSubs(s);
          setReports(r);
        }
      } catch {
        if (!cancelled) setVersion((v) => v + 1);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [version]);

  const reload = async () => {
    try {
      const [s, r] = await Promise.all([
        adminFetch<Subscriber[]>("/api/admin/subscriptions"),
        adminFetch<Report[]>("/api/admin/newsletter/reports"),
      ]);
      setSubs(s);
      setReports(r);
    } catch {
      /* keep current */
    }
  };

  const activeCount = subs.filter((s) => s.active).length;

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-primary">Subscribers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {subs.length} subscribed · <span className="font-medium text-accent">{activeCount} active</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button className={btnGhost} onClick={() => setVersion((v) => v + 1)} type="button">
            <RefreshCw className="size-3.5" /> Refresh
          </button>
          <button
            className={btnPrimary}
            disabled={running}
            onClick={async () => {
              setRunning(true);
              setRunMessage("");
              try {
                const result = await adminFetch<{ ok: boolean; status: string; sentTo: number }>("/api/admin/newsletter/run", {
                  method: "POST",
                  body: JSON.stringify({}),
                });
                if (result.status === "no-products") setRunMessage("No new products waiting. Add a product to notify subscribers.");
                else if (result.status === "no-subscribers") setRunMessage("No active subscribers to email yet.");
                else setRunMessage(`Email sent to ${result.sentTo} subscriber(s).`);
                await reload();
              } catch (err) {
                setRunMessage(err instanceof Error ? err.message : "Broadcast failed");
              } finally {
                setRunning(false);
              }
            }}
            type="button"
          >
            <Send className="size-3.5" /> {running ? "Sending..." : "Send new arrivals now"}
          </button>
        </div>
      </div>

      {runMessage ? <p className="mt-3 text-sm text-muted-foreground">{runMessage}</p> : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="font-display text-lg text-primary">Subscriber list</h2>
          <ul className="mt-4 divide-y divide-border">
            {subs.length === 0 ? (
              <li className="py-8 text-center text-sm text-muted-foreground">
                No subscribers yet. The footer form adds them here.
              </li>
            ) : (
              subs.map((s) => (
                <li key={s._id} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Mail className="size-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{s.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {ago(s.createdAt)} ·{" "}
                        <span className={s.active ? "text-accent" : "text-rose"}>{s.active ? "Active" : "Inactive"}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      className={btnGhost}
                      disabled={busyId === s._id}
                      onClick={async () => {
                        setBusyId(s._id);
                        try {
                          await adminFetch(`/api/admin/subscriptions/${s._id}`, {
                            method: "PATCH",
                            body: JSON.stringify({ active: !s.active }),
                          });
                          await reload();
                        } finally {
                          setBusyId("");
                        }
                      }}
                      type="button"
                    >
                      {s.active ? "Pause" : "Resume"}
                    </button>
                    <button
                      className={btnDanger}
                      disabled={busyId === s._id}
                      onClick={async () => {
                        if (!window.confirm(`Remove ${s.email}?`)) return;
                        setBusyId(s._id);
                        try {
                          await adminFetch(`/api/admin/subscriptions/${s._id}`, {
                            method: "DELETE",
                            body: JSON.stringify({}),
                          });
                          await reload();
                        } finally {
                          setBusyId("");
                        }
                      }}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="font-display text-lg text-primary">Broadcast history</h2>
          {reports.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No broadcasts yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {reports.map((r) => (
                <li key={r._id} className="rounded-md border border-border p-3 text-sm">
                  <p className="font-medium text-foreground">
                    {r.status === "no-products" ? "No products" : r.productNames.join(", ") || "New arrivals"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {ago(r.createdAt)} ·{" "}
                    {r.status === "sent"
                      ? `${r.sentTo} sent${r.failed ? `, ${r.failed} failed` : ""}`
                      : r.status === "no-subscribers"
                        ? "no subscribers yet"
                        : "nothing to send"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}