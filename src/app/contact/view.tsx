"use client";

import { useState } from "react";
import { Mail, MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/orgo/icons";
import { toast } from "sonner";
import { apiFetch } from "@/lib/orgo/api";
import { WHATSAPP_NUMBER } from "@/lib/orgo/products";

export function ContactView() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  return (
    <div className="mx-auto grid max-w-[1100px] gap-14 px-4 py-14 md:px-8 md:py-20 lg:grid-cols-[1.2fr_1fr]">
      <div>
        <p className="eyebrow text-accent">Contact</p>
        <h1 className="mt-3 text-5xl text-primary md:text-6xl">Let&rsquo;s Talk Natural Skincare</h1>
        <form
          className="mt-10 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (sending) return;
            const fd = new FormData(e.currentTarget);
            setSending(true);
            try {
              await apiFetch("/api/contact", {
                method: "POST",
                body: JSON.stringify({
                  name: fd.get("name"),
                  email: fd.get("email"),
                  phone: fd.get("phone"),
                  message: fd.get("message"),
                }),
              });
              setSent(true);
              (e.target as HTMLFormElement).reset();
              toast.success("Thank you — we'll get back to you soon.");
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Message could not be sent. Please try again.");
            } finally {
              setSending(false);
            }
          }}
        >
          {["Name", "Email", "Phone"].map((f) => (
            <label key={f} className="block">
              <span className="eyebrow text-muted-foreground">{f}</span>
              <input
                name={f.toLowerCase()}
                required={f !== "Phone"}
                type={f === "Email" ? "email" : "text"}
                className="mt-2 w-full border border-input bg-card px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </label>
          ))}
          <label className="block">
            <span className="eyebrow text-muted-foreground">Message</span>
            <textarea
              name="message"
              required
              rows={5}
              className="mt-2 w-full border border-input bg-card px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </label>
          <button
            disabled={sending}
            className="cursor-pointer bg-primary px-9 py-4 text-[11px] tracking-[0.24em] text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sent ? "MESSAGE SENT" : sending ? "SENDING…" : "SEND MESSAGE"}
          </button>
        </form>
      </div>

      <aside className="h-fit border border-border p-8">
        <p className="eyebrow text-accent">Reach Us</p>
        <ul className="mt-6 space-y-5 text-sm">
          <li>
            <a href="https://instagram.com/orgo.farm_" target="_blank" rel="noreferrer" className="flex items-center gap-3">
              <InstagramIcon className="size-4 text-accent" /> @orgo.farm_
            </a>
          </li>
          <li>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="flex items-center gap-3">
              <MessageCircle className="size-4 text-accent" /> WhatsApp +91 92362 06988
            </a>
          </li>
          <li className="flex items-center gap-3">
            <Mail className="size-4 text-accent" /> Orgofarm15@gmail.com
          </li>
        </ul>
        <p className="mt-8 font-script text-2xl text-rose">Made with love, from nature</p>
      </aside>
    </div>
  );
}
