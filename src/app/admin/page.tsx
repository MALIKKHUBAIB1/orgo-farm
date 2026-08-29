"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Package, Users, ShoppingBag, MessagesSquare, IndianRupee, Sparkles, Mail } from "lucide-react";
import { adminFetch } from "@/lib/orgo/admin";
import { inr } from "@/lib/orgo/products";
import { RequireAdmin } from "@/components/admin/ui";

type Stats = {
  users: number;
  products: number;
  curations: number;
  messages: number;
  unread: number;
  orders: number;
  revenue: number;
  subscribers: number;
  broadcasts: number;
};

type AdminOrder = {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  customer: { name: string };
};

function StatCard({ label, value, icon: Icon, accent }: { label: string; value: string; icon: typeof Package; accent?: boolean }) {
  return (
    <div className={`rounded-lg border bg-card p-5 ${accent ? "border-accent/50" : "border-border"}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon className={`size-4 ${accent ? "text-accent" : "text-primary"}`} />
      </div>
      <p className="mt-3 font-display text-3xl text-primary">{value}</p>
    </div>
  );
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [s, o] = await Promise.all([
          adminFetch<Stats>("/api/admin/stats"),
          adminFetch<AdminOrder[]>("/api/admin/orders"),
        ]);
        if (!cancelled) {
          setStats(s);
          setOrders(o);
        }
      } catch {
        if (!cancelled) setStats(null);
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

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 md:px-6">
      <h1 className="font-display text-2xl text-primary">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Your store at a glance.</p>

      {stats ? (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          <StatCard label="Products" value={String(stats.products)} icon={Package} />
          <StatCard label="Users" value={String(stats.users)} icon={Users} />
          <StatCard label="Orders" value={String(stats.orders)} icon={ShoppingBag} />
          <StatCard label="Revenue" value={inr(stats.revenue)} icon={IndianRupee} accent />
          <StatCard label="Messages" value={`${stats.unread}/${stats.messages}`} icon={MessagesSquare} />
          <StatCard label="Curations" value={String(stats.curations)} icon={Sparkles} />
          <StatCard label="Subscribers" value={String(stats.subscribers)} icon={Mail} />
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">Could not load stats.</p>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-primary">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-muted-foreground hover:text-primary">
              View all
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {orders.length === 0 ? (
              <li className="py-6 text-center text-sm text-muted-foreground">No orders yet.</li>
            ) : (
              orders.map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{o.customer?.name ?? "Guest"}</p>
                    <p className="text-xs text-muted-foreground">{o.id}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        o.status === "cancelled" ? "bg-rose/10 text-rose" : "bg-primary/10 text-primary"
                      }`}
                    >
                      {o.status}
                    </span>
                    <span className="font-display">{inr(o.total)}</span>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <Link
            href="/admin/products"
            className="rounded-lg border border-border bg-card p-5 transition hover:border-primary/40"
          >
            <p className="font-display text-lg text-primary">Product Management</p>
            <p className="mt-1 text-sm text-muted-foreground">Add, edit or remove products. Upload images.</p>
          </Link>
          <Link
            href="/admin/contacts"
            className="rounded-lg border border-border bg-card p-5 transition hover:border-primary/40"
          >
            <p className="font-display text-lg text-primary">Contact Messages</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {stats && stats.unread > 0 ? `${stats.unread} unread messages waiting.` : "No unread messages."}
            </p>
          </Link>
          <Link
            href="/admin/curations"
            className="rounded-lg border border-border bg-card p-5 transition hover:border-primary/40"
          >
            <p className="font-display text-lg text-primary">Curations</p>
            <p className="mt-1 text-sm text-muted-foreground">Manage Bronze, Silver and Gold sets.</p>
          </Link>
          <Link
            href="/admin/subscribers"
            className="rounded-lg border border-border bg-card p-5 transition hover:border-primary/40"
          >
            <p className="font-display text-lg text-primary">Subscribers</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {stats ? `${stats.subscribers} on the list · ${stats.broadcasts} broadcasts sent.` : "Manage email subscribers."}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
export default function DashboardPage() {
  return (
    <RequireAdmin>
      <Dashboard />
    </RequireAdmin>
  );
}
