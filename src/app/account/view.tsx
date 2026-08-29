"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/orgo/api";
import { inr } from "@/lib/orgo/products";
import { useShop } from "@/lib/orgo/store";
import { useAuth } from "@/lib/orgo/auth";
import { emptyProfile, loadProfile, saveProfileData, type ProfileAddress, type ProfileData } from "@/lib/orgo/profile";
import { AddressFields } from "@/components/address-fields";

const tabs = ["Profile", "Orders", "Wishlist", "Saved Addresses", "Track Order"] as const;
const timeline = ["Order Placed", "Confirmed", "Packed", "Shipped", "Out For Delivery", "Delivered"];
const STATUS_STEP: Record<string, number> = { placed: 0, confirmed: 1, shipped: 3, delivered: 5 };
const EMPTY_ADDRESS: ProfileAddress = { address: "", city: "", state: "", pin: "" };

type MyOrder = {
  id: string;
  lines: { slug: string; name: string; qty: number; price: number }[];
  total: number;
  status: string;
  createdAt: string;
};

function Input({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="eyebrow text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border border-input bg-card px-4 py-3 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}

function AuthCard() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [busy, setBusy] = useState(false);
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "" });
  const set = (k: keyof typeof f) => (v: string) => setF({ ...f, [k]: v });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      if (mode === "login") {
        await login(f.email, f.password);
        toast.success("Welcome back!");
      } else {
        await register(f.name, f.email, f.phone, f.password);
        toast.success("Account created. Happy shopping!");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 md:py-28">
      <h1 className="text-center font-display text-4xl text-primary">
        {mode === "login" ? "Welcome Back" : "Create Account"}
      </h1>
      <p className="mt-3 text-center text-sm text-muted-foreground">
        {mode === "login"
          ? "Log in to view your orders, wishlist and saved addresses."
          : "Create an account to keep your details safe across all devices."}
      </p>

      <form onSubmit={submit} className="mt-10 space-y-4 border border-border p-8">
        {mode === "register" ? (
          <Input label="Name" value={f.name} onChange={set("name")} required placeholder="Your full name" />
        ) : null}
        <Input label="Email" type="email" value={f.email} onChange={set("email")} required placeholder="you@example.com" />
        {mode === "register" ? (
          <Input label="Phone" value={f.phone} onChange={set("phone")} placeholder="+91…" />
        ) : null}
        <Input
          label="Password"
          type="password"
          value={f.password}
          onChange={set("password")}
          required
          placeholder={mode === "register" ? "Minimum 6 characters" : "••••••••"}
        />
        <button
          disabled={busy}
          className="w-full cursor-pointer bg-primary py-4 text-[11px] tracking-[0.24em] text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "PLEASE WAIT…" : mode === "login" ? "LOGIN" : "CREATE ACCOUNT"}
        </button>
        <p className="pt-2 text-center text-sm text-muted-foreground">
          {mode === "login" ? "New here? " : "Already have an account?"}
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-primary underline underline-offset-4"
          >
            {mode === "login" ? "Create an account" : "Log in"}
          </button>
        </p>
      </form>
    </div>
  );
}

export function AccountView() {
  const { user, ready, logout } = useAuth();
  const { wishlist } = useShop();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Profile");
  const [profile, setProfile] = useState<ProfileData>(emptyProfile);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [addressForm, setAddressForm] = useState<ProfileAddress>(EMPTY_ADDRESS);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressFormKey, setAddressFormKey] = useState(0);
  const [orders, setOrders] = useState<MyOrder[] | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    apiFetch<MyOrder[]>("/api/orders/mine")
      .then((o) => !cancelled && setOrders(o))
      .catch(() => !cancelled && setOrders([]));
    loadProfile(user.shopKey)
      .then((p) => {
        if (!cancelled) {
          setProfile(p);
          setLoaded(true);
        }
      })
      .catch(() => !cancelled && setLoaded(true));
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!ready)
    return (
      <div className="py-32 text-center text-sm text-muted-foreground">Loading your account…</div>
    );

  if (!user) return <AuthCard />;

  async function handleSave(data: ProfileData) {
    if (saving) return;
    setSaving(true);
    try {
      const saved = await saveProfileData(user!.shopKey, data);
      setProfile(saved);
      toast.success("Saved!");
      return saved;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function resetAddressForm() {
    setAddressForm(EMPTY_ADDRESS);
    setEditingAddressId(null);
    setAddressFormKey((key) => key + 1);
  }

  async function saveAddress() {
    const addresses = editingAddressId
      ? profile.addresses.map((item) => (item.id === editingAddressId ? { ...addressForm, id: item.id } : item))
      : [...profile.addresses, { ...addressForm, id: `new-${Date.now()}` }];
    const saved = await handleSave({
      ...profile,
      name: profile.name || user!.name,
      email: profile.email || user!.email,
      phone: profile.phone || user!.phone,
      address: addresses[0] ?? EMPTY_ADDRESS,
      addresses,
    });
    if (saved) resetAddressForm();
  }

  async function deleteAddress(id: string) {
    const addresses = profile.addresses.filter((item) => item.id !== id);
    const saved = await handleSave({ ...profile, address: addresses[0] ?? EMPTY_ADDRESS, addresses });
    if (saved && editingAddressId === id) resetAddressForm();
  }

  const latest = orders?.[0];
  const step = latest ? (STATUS_STEP[latest.status] ?? -1) : -1;

  return (
    <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-14 md:px-8 md:py-20 lg:grid-cols-[240px_1fr]">
      <aside>
        <h1 className="font-display text-3xl text-primary">My Account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Hi, {user.name.split(" ")[0]} 👋
          <br />
          {user.email}
        </p>
        <nav className="mt-8 space-y-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`block w-full border-l-2 px-4 py-3 text-left text-sm ${
                tab === t ? "border-primary bg-muted text-primary" : "border-transparent text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
          <button
            onClick={() => {
              logout();
              toast.success("Logged out.");
            }}
            className="block w-full px-4 py-3 text-left text-sm text-muted-foreground hover:text-primary"
          >
            Logout
          </button>
        </nav>
      </aside>

      <div className="border border-border p-8">
        {tab === "Profile" ? (
          <div>
            <h2 className="font-display text-2xl text-primary">Account Overview</h2>

            <div className="mt-6 flex items-center gap-5 border border-border p-6">
              <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary font-display text-2xl uppercase text-primary-foreground">
                {user.name.charAt(0)}
              </span>
              <div>
                <p className="font-display text-xl">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <dl className="mt-4 grid gap-px border border-border bg-border sm:grid-cols-3">
              {(
                [
                  ["Full Name", user.name],
                  ["Email", user.email],
                  ["Phone", user.phone || "—"],
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="bg-card p-5">
                  <dt className="eyebrow text-muted-foreground">{k}</dt>
                  <dd className="mt-2 break-words text-sm">{v}</dd>
                </div>
              ))}
            </dl>

            <dl className="mt-4 grid gap-px border border-border bg-border sm:grid-cols-2">
              <button
                onClick={() => setTab("Orders")}
                className="cursor-pointer bg-card p-5 text-left transition-colors hover:bg-muted"
              >
                <dt className="eyebrow text-muted-foreground">Orders</dt>
                <dd className="mt-1 font-display text-3xl text-primary">
                  {orders === null ? "…" : orders.length}
                </dd>
              </button>
              <button
                onClick={() => setTab("Wishlist")}
                className="cursor-pointer bg-card p-5 text-left transition-colors hover:bg-muted"
              >
                <dt className="eyebrow text-muted-foreground">Wishlist Items</dt>
                <dd className="mt-1 font-display text-3xl text-primary">{wishlist.length}</dd>
              </button>
            </dl>

            <p className="mt-6 text-xs text-muted-foreground">
              Account details come from your login. Manage your delivery address under{" "}
              <button onClick={() => setTab("Saved Addresses")} className="text-primary underline underline-offset-4">
                Saved Addresses
              </button>
              .
            </p>
          </div>
        ) : null}

        {tab === "Orders" ? (
          <div>
            <h2 className="font-display text-2xl text-primary">Orders</h2>
            {orders === null ? (
              <p className="mt-4 text-sm text-muted-foreground">Loading orders…</p>
            ) : orders.length === 0 ? (
              <div className="mt-6">
                <p className="text-sm text-muted-foreground">No orders yet.</p>
                <Link href="/shop" className="mt-4 inline-block bg-primary px-8 py-3.5 text-[11px] tracking-[0.22em] text-primary-foreground">
                  START SHOPPING
                </Link>
              </div>
            ) : (
              <ul className="mt-6 space-y-4">
                {orders.map((o) => (
                  <li key={o.id} className="border border-border p-6 text-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="font-display text-lg">{o.id}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(o.createdAt).toDateString()}
                      </span>
                      <span
                        className={`eyebrow ${o.status === "cancelled" ? "text-destructive" : "text-accent"}`}
                      >
                        {(o.status ?? "placed").toUpperCase()}
                      </span>
                    </div>
                    <p className="mt-3 text-muted-foreground">
                      {o.lines.map((l) => `${l.name} × ${l.qty}`).join(", ")}
                    </p>
                    <p className="mt-3 font-display text-xl">{inr(o.total)}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}

        {tab === "Wishlist" ? (
          <div>
            <h2 className="font-display text-2xl text-primary">Wishlist</h2>
            <p className="mt-3 text-sm text-muted-foreground">{wishlist.length} saved items.</p>
            <Link href="/wishlist" className="mt-5 inline-block border border-primary px-6 py-3 text-[10px] tracking-[0.2em] text-primary">
              VIEW WISHLIST
            </Link>
          </div>
        ) : null}

        {tab === "Saved Addresses" ? (
          <div className="max-w-2xl">
            <p className="eyebrow text-accent">Address book</p>
            <h2 className="mt-2 font-display text-3xl text-primary">Saved Addresses</h2>
            <p className="mt-3 text-sm text-muted-foreground">Your first saved address will be auto-filled at checkout.</p>

            {!loaded ? <p className="mt-6 text-sm text-muted-foreground">Loading saved addresses…</p> : null}
            {loaded && profile.addresses.length === 0 ? (
              <div className="mt-6 border border-dashed border-border p-6 text-sm text-muted-foreground">No address saved yet. Add one below.</div>
            ) : null}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {profile.addresses.map((address, index) => (
                <article key={address.id} className="border border-border p-5">
                  <span className={`eyebrow ${index === 0 ? "text-accent" : "text-muted-foreground"}`}>
                    {index === 0 ? "Default for checkout" : "Saved address"}
                  </span>
                  <p className="mt-3 text-sm font-medium text-primary">{user.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {address.address}<br />{address.city}, {address.state} — {address.pin}
                  </p>
                  <div className="mt-5 flex gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setAddressForm(address);
                        setEditingAddressId(address.id);
                        setAddressFormKey((key) => key + 1);
                      }}
                      className="inline-flex cursor-pointer items-center gap-1.5 text-xs text-primary hover:text-accent"
                    >
                      <Pencil className="size-3.5" /> Edit
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => void deleteAddress(address.id)}
                      className="inline-flex cursor-pointer items-center gap-1.5 text-xs text-destructive disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Trash2 className="size-3.5" /> Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <form className="mt-10 border-t border-border pt-8" onSubmit={(event) => { event.preventDefault(); void saveAddress(); }}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-display text-2xl text-primary">{editingAddressId ? "Edit address" : "Add a new address"}</h3>
                {editingAddressId ? <button type="button" onClick={resetAddressForm} className="cursor-pointer text-xs text-muted-foreground underline underline-offset-4">Cancel edit</button> : null}
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <AddressFields key={`${editingAddressId ?? "new"}-${addressFormKey}`} value={addressForm} onChange={setAddressForm} />
              </div>
              <button disabled={saving} className="mt-6 inline-flex cursor-pointer items-center gap-2 bg-primary px-8 py-3.5 text-[11px] tracking-[0.22em] text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60">
                <Plus className="size-4" /> {saving ? "SAVING…" : editingAddressId ? "UPDATE ADDRESS" : "SAVE ADDRESS"}
              </button>
            </form>
          </div>
        ) : null}

        {tab === "Track Order" ? (
          <div>
            <h2 className="font-display text-2xl text-primary">Order Tracking</h2>
            {!latest ? (
              <p className="mt-4 text-sm text-muted-foreground">No orders to track yet.</p>
            ) : latest.status === "cancelled" ? (
              <p className="mt-4 text-sm text-destructive">
                Order {latest.id} has been cancelled. Contact us if you have any questions.
              </p>
            ) : (
              <>
                <p className="mt-3 text-sm text-muted-foreground">
                  Order {latest.id} · {latest.status.toUpperCase()}
                </p>
                <ol className="mt-8 space-y-6">
                  {timeline.map((t, i) => {
                    const done = i <= step;
                    return (
                      <li key={t} className="flex items-start gap-4">
                        <span className={`mt-1 size-3 rounded-full ${done ? "bg-primary" : "bg-border"}`} />
                        <div>
                          <p className={done ? "text-primary" : "text-muted-foreground"}>{t}</p>
                          {i < timeline.length - 1 ? <span className="mt-2 block h-6 w-px bg-border" /> : null}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
