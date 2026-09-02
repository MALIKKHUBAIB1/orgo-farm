"use client";

import { useEffect, useState } from "react";
import { Activity, Globe, MonitorSmartphone, MapPin, RefreshCw, Users } from "lucide-react";
import { adminFetch } from "@/lib/orgo/admin";
import type { Analytics } from "@/lib/orgo/analytics";
import { btnGhost } from "@/components/admin/ui";

function fmtTime(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? "—"
    : d.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
}

function Stat({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Activity }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon className="size-4 text-primary" />
      </div>
      <p className="mt-3 font-display text-3xl text-primary">{value}</p>
    </div>
  );
}

function Sparkline({ data, max }: { data: { count: number }[]; max: number }) {
  if (!data.length) return <p className="py-8 text-center text-sm text-muted-foreground">No traffic yet — it will appear here once someone visits the site.</p>;
  const h = 80;
  const w = 100;
  const step = w / data.length;
  const pts = data.map((d, i) => `${(i * step).toFixed(1)},${(h - (d.count / max) * h).toFixed(1)}`);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-28 w-full">
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke="var(--primary, #4a5d47)"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AnalyticsView() {
  const [days, setDays] = useState(7);
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async (d: number) => {
    setLoading(true);
    try {
      setDays(d);
      setData(await adminFetch<Analytics>(`/api/admin/analytics?days=${d}`));
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(7);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const maxDaily = data ? Math.max(1, ...data.daily.map((d) => d.count)) : 1;

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-primary">Traffic & Visitors</h1>
          <p className="mt-1 text-sm text-muted-foreground">Who visited, when, and from where — all in one place.</p>
        </div>
        <div className="flex items-center gap-2">
          {[7, 14, 30].map((d) => (
            <button key={d} className={`${btnGhost} ${days === d ? "!text-primary" : ""}`} onClick={() => load(d)} type="button">
              {d}d
            </button>
          ))}
          <button className={btnGhost} onClick={() => load(days)} type="button" title="Refresh">
            <RefreshCw className="size-3.5" />
          </button>
        </div>
      </div>

      {loading && !data ? (
        <p className="mt-10 text-sm text-muted-foreground">Loading analytics...</p>
      ) : !data ? (
        <p className="mt-10 text-sm text-muted-foreground">Could not load analytics.</p>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Stat label="Total visits" value={String(data.total)} icon={Activity} />
            <Stat label="Unique visitors" value={String(data.unique)} icon={Users} />
            <Stat label="Period" value={`${data.periodDays} days`} icon={Globe} />
            <Stat label="Daily avg" value={data.total ? (data.total / data.periodDays).toFixed(1) : "0"} icon={MonitorSmartphone} />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-5">
              <h2 className="font-display text-base text-primary">Visits per day</h2>
              <div className="mt-3">
                <Sparkline data={data.daily} max={maxDaily} />
                {data.daily.length ? (
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                    {data.daily.map((d) => (
                      <span key={d.date}>
                        {d.date.slice(5)}: <span className="text-foreground">{d.count}</span>
                        <span className="text-muted-foreground/60"> ({d.unique}u)</span>
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-5">
              <h2 className="font-display text-base text-primary">Top pages</h2>
              <ul className="mt-3 space-y-2">
                {data.paths.length === 0 ? (
                  <li className="text-sm text-muted-foreground">No data yet.</li>
                ) : (
                  data.paths.map((p) => (
                    <li key={p.path} className="flex items-center justify-between gap-3 text-sm">
                      <span className="truncate text-muted-foreground">{p.path}</span>
                      <span className="shrink-0 font-medium text-foreground">{p.count}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-5">
              <h2 className="font-display text-base text-primary">Devices</h2>
              <ul className="mt-3 space-y-2">
                {data.devices.length === 0 ? (
                  <li className="text-sm text-muted-foreground">No data.</li>
                ) : (
                  data.devices.map((d) => (
                    <li key={d.label} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{d.label}</span>
                      <span className="font-medium text-foreground">{d.count}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h2 className="font-display text-base text-primary">Browsers</h2>
              <ul className="mt-3 space-y-2">
                {data.browsers.length === 0 ? (
                  <li className="text-sm text-muted-foreground">No data.</li>
                ) : (
                  data.browsers.map((d) => (
                    <li key={d.label} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{d.label}</span>
                      <span className="font-medium text-foreground">{d.count}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h2 className="font-display text-base text-primary">Operating system</h2>
              <ul className="mt-3 space-y-2">
                {data.os.length === 0 ? (
                  <li className="text-sm text-muted-foreground">No data.</li>
                ) : (
                  data.os.map((d) => (
                    <li key={d.label} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{d.label}</span>
                      <span className="font-medium text-foreground">{d.count}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-5">
              <h2 className="flex items-center gap-2 font-display text-base text-primary">
                <MapPin className="size-4" /> IP addresses
              </h2>
              <ul className="mt-3 divide-y divide-border">
                {data.ips.length === 0 ? (
                  <li className="py-4 text-sm text-muted-foreground">No visitors yet.</li>
                ) : (
                  data.ips.map((v) => (
                    <li key={v.ip} className="flex items-center justify-between py-2.5 text-sm">
                      <div>
                        <p className="font-medium text-foreground">{v.ip}</p>
                        <p className="text-[11px] text-muted-foreground">
                          Last seen: {fmtTime(v.lastSeen)}
                          {v.ip.includes("127") || v.ip.startsWith("::1") || v.ip.startsWith("::ffff:127") ? " · Local" : ""}
                        </p>
                      </div>
                      <span className="shrink-0 rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {v.count} visits
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div className="rounded-lg border border-border bg-card p-5">
              <h2 className="font-display text-base text-primary">Recent activity</h2>
              <ul className="mt-3 divide-y divide-border">
                {data.recent.length === 0 ? (
                  <li className="py-4 text-sm text-muted-foreground">No activity yet.</li>
                ) : (
                  data.recent.map((v, i) => (
                    <li key={i} className="py-2.5 text-sm">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate font-medium text-foreground">{v.path || "/"}</span>
                        <span className="shrink-0 text-[11px] text-muted-foreground">{fmtTime(v.createdAt)}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        {v.ip || "—"} · {v.browser || "?"} / {v.os || "?"} · {v.device || "?"}
                        {v.took ? ` · ${v.took}ms` : ""}
                      </p>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}