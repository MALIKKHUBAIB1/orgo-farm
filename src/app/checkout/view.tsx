"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Lock, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/orgo/api";
import { inr } from "@/lib/orgo/products";
import { useShop } from "@/lib/orgo/store";
import { useAuth } from "@/lib/orgo/auth";
import { useCatalog } from "@/lib/orgo/catalog";
import { resolveImage } from "@/lib/orgo/image";
import { getSessionKey } from "@/lib/orgo/session";
import { loadProfile, saveProfileData, type ProfileAddress } from "@/lib/orgo/profile";
import { AddressFields } from "@/components/address-fields";

const payments = ["UPI", "Credit / Debit Card", "Net Banking", "Wallets", "Cash on Delivery"];

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="eyebrow text-muted-foreground">{label}</span>
      <input
        {...rest}
        className="mt-2 w-full border border-input bg-card px-4 py-3 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}

export function CheckoutView() {
  const { cart, clearCart, placeOrder, setQty } = useShop();
  const { user } = useAuth();
  const { products } = useCatalog();
  const router = useRouter();
  const [shipping, setShipping] = useState<"standard" | "fast">("standard");
  const [payment, setPayment] = useState<string>(payments[0]!);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", state: "", pin: "" });
  const [submitting, setSubmitting] = useState(false);
  const [editInfo, setEditInfo] = useState(false);
  const [saved, setSaved] = useState<ProfileAddress | null>(null);
  const [addrMode, setAddrMode] = useState<"saved" | "new">("new");

  useEffect(() => {
    const key = user?.shopKey || getSessionKey();
    if (!key) return;
    let cancelled = false;
    loadProfile(key)
      .then((p) => {
        if (cancelled) return;
        if (p.address.address) {
          setSaved(p.address);
          setAddrMode("saved");
        }
        setForm((f) => ({
          name: f.name || p.name || user?.name || "",
          email: f.email || p.email || user?.email || "",
          phone: f.phone || p.phone || user?.phone || "",
          address: f.address || p.address.address,
          city: f.city || p.address.city,
          state: f.state || p.address.state,
          pin: f.pin || p.address.pin,
        }));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [user]);

  const lines = cart.flatMap((l) => {
    const product = products.find((p) => p.slug === l.slug);
    return product ? [{ ...l, product }] : [];
  });
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const ship = shipping === "fast" ? 100 : 0;
  const total = subtotal + ship;

  const effName = user && !editInfo ? user.name || form.name : form.name;
  const effEmail = user && !editInfo ? user.email || form.email : form.email;
  const effPhone = user && !editInfo ? user.phone || form.phone : form.phone;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 py-24 text-center md:px-8">
        <h1 className="text-4xl text-primary">Your cart is empty</h1>
        <Link href="/shop" className="mt-8 inline-block bg-primary px-9 py-4 text-[11px] tracking-[0.24em] text-primary-foreground">
          SHOP NATURAL SKINCARE
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-14 md:px-8 md:py-20">
      <h1 className="text-4xl text-primary md:text-5xl">Checkout</h1>
      <p className="mt-2 flex items-center gap-2 text-xs tracking-[0.16em] text-muted-foreground">
        <Lock className="size-3.5" /> SECURE CHECKOUT
      </p>

      <form
        className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px]"
        onSubmit={async (e) => {
          e.preventDefault();
          if (submitting) return;
          setSubmitting(true);
          const addr: ProfileAddress =
            user && addrMode === "saved" && saved
              ? saved
              : { address: form.address, city: form.city, state: form.state, pin: form.pin };
          try {
            const order = await apiFetch<{ id: string }>("/api/orders", {
              method: "POST",
              body: JSON.stringify({
                lines: cart.map((l) => ({ slug: l.slug, qty: l.qty })),
                customer: { name: effName, email: effEmail, phone: effPhone },
                address: addr,
                shipping,
                payment,
              }),
            });
            placeOrder({
              id: order.id,
              lines: cart,
              total,
              name: effName,
              address: addr.address,
              city: addr.city,
              state: addr.state,
              pin: addr.pin,
              shipping,
              payment,
              placedAt: new Date().toISOString(),
            });
            clearCart();
            const key = user?.shopKey || getSessionKey();
            if (key) {
              saveProfileData(key, {
                name: effName,
                email: effEmail,
                phone: effPhone,
                address: addr,
              }).catch(() => {});
            }
            router.push("/order-confirmed");
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "We couldn't place your order. Please try again.");
            setSubmitting(false);
          }
        }}
      >
        <div className="space-y-10">
          <section>
            <h2 className="font-display text-2xl text-primary">Customer Information</h2>

            {user && !editInfo ? (
              <div className="mt-5 flex items-center justify-between gap-4 border border-border p-5">
                <div className="flex items-center gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary font-display text-lg uppercase text-primary-foreground">
                    {effName.charAt(0)}
                  </span>
                  <div className="min-w-0 text-sm">
                    <p className="font-display text-base">{effName}</p>
                    <p className="truncate text-muted-foreground">{effEmail}</p>
                    {effPhone ? <p className="text-muted-foreground">{effPhone}</p> : null}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditInfo(true)}
                  className="shrink-0 text-[10px] tracking-[0.2em] text-primary underline underline-offset-4"
                >
                  EDIT
                </button>
              </div>
            ) : (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Name" required value={form.name} onChange={set("name")} autoComplete="name" />
                <Field label="Email" type="email" required value={form.email} onChange={set("email")} autoComplete="email" />
                <Field
                  label="Phone"
                  required
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value.replace(/[^0-9+()\-\s]/g, "").slice(0, 15) })
                  }
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="10-digit mobile number"
                />
                {user ? (
                  <button
                    type="button"
                    onClick={() => setEditInfo(false)}
                    className="justify-self-start text-sm text-primary underline underline-offset-4 sm:col-span-2"
                  >
                    Use my account details instead
                  </button>
                ) : null}
              </div>
            )}
          </section>

          <section>
            <h2 className="font-display text-2xl text-primary">Delivery Address</h2>

            {user && saved ? (
              <div className="mt-5 space-y-3">
                <label
                  className={`flex cursor-pointer items-start gap-3 border p-4 text-sm ${
                    addrMode === "saved" ? "border-primary" : "border-border"
                  }`}
                >
                  <input
                    type="radio"
                    checked={addrMode === "saved"}
                    onChange={() => setAddrMode("saved")}
                    className="mt-1 accent-[var(--primary)]"
                  />
                  <span>
                    <span className="eyebrow text-accent">Default Address</span>
                    <span className="mt-1 block leading-relaxed">
                      {saved.address}, {saved.city}
                      <br />
                      {saved.state} — {saved.pin}
                    </span>
                  </span>
                </label>
                <label
                  className={`flex cursor-pointer items-center gap-3 border p-4 text-sm ${
                    addrMode === "new" ? "border-primary" : "border-border"
                  }`}
                >
                  <input
                    type="radio"
                    checked={addrMode === "new"}
                    onChange={() => setAddrMode("new")}
                    className="accent-[var(--primary)]"
                  />
                  Use a different address
                </label>
                {addrMode === "new" ? (
                  <div className="grid gap-4 pt-2 sm:grid-cols-2">
                    <AddressFields
                      value={{ address: form.address, city: form.city, state: form.state, pin: form.pin }}
                      onChange={(a) => setForm((f) => ({ ...f, ...a }))}
                    />
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <AddressFields
                  value={{ address: form.address, city: form.city, state: form.state, pin: form.pin }}
                  onChange={(a) => setForm((f) => ({ ...f, ...a }))}
                />
              </div>
            )}
          </section>

          <section>
            <h2 className="font-display text-2xl text-primary">Delivery Options</h2>
            <div className="mt-5 space-y-3">
              {([
                ["standard", "Standard Shipping", "FREE"],
                ["fast", "Fast Delivery", "+₹100"],
              ] as const).map(([k, label, price]) => (
                <label
                  key={k}
                  className={`flex cursor-pointer items-center justify-between border p-4 text-sm ${
                    shipping === k ? "border-primary" : "border-border"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <input type="radio" checked={shipping === k} onChange={() => setShipping(k)} className="accent-[var(--primary)]" />
                    {label}
                  </span>
                  <span className="text-accent">{price}</span>
                </label>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl text-primary">Payment</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {payments.map((p) => (
                <label
                  key={p}
                  className={`flex cursor-pointer items-center gap-3 border p-4 text-sm ${
                    payment === p ? "border-primary" : "border-border"
                  }`}
                >
                  <input type="radio" checked={payment === p} onChange={() => setPayment(p)} className="accent-[var(--primary)]" />
                  {p}
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="h-fit border border-border p-7">
          <h2 className="eyebrow text-accent">Order Summary</h2>
          <ul className="mt-5 space-y-4 text-sm">
            {lines.map((l) => (
              <li key={l.slug} className="flex gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resolveImage(l.product.image)} alt="" className="size-14 object-cover" />
                <div className="flex-1">
                  <p className="leading-snug">{l.product.name}</p>
                  <div className="mt-1 inline-flex items-center border border-border">
                    <button
                      type="button"
                      disabled={l.qty <= 1}
                      onClick={() => setQty(l.slug, l.qty - 1)}
                      className="px-2 py-0.5 text-muted-foreground hover:text-primary disabled:opacity-40"
                      aria-label={`Decrease ${l.product.name} quantity`}
                    >
                      <Minus className="size-3" />
                    </button>
                    <span className="w-6 text-center text-xs">{l.qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty(l.slug, l.qty + 1)}
                      className="px-2 py-0.5 text-muted-foreground hover:text-primary"
                      aria-label={`Increase ${l.product.name} quantity`}
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>
                </div>
                <span>{inr(l.product.price * l.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-6 space-y-2 border-t border-border pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{inr(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd>{ship ? inr(ship) : "FREE"}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 font-display text-xl">
              <dt>Total</dt>
              <dd>{inr(total)}</dd>
            </div>
          </dl>
          <button
            disabled={submitting}
            className="mt-7 w-full bg-primary py-4 text-[11px] tracking-[0.24em] text-primary-foreground disabled:opacity-60"
          >
            {submitting ? "PLACING ORDER…" : "PLACE ORDER"}
          </button>
        </aside>
      </form>
    </div>
  );
}
