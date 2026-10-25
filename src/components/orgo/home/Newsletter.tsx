"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Reveal } from "@/components/orgo/Reveal";

export function Newsletter() {
  const [email, setEmail] = useState("");
  return (
    <section className="gradient-forest relative overflow-hidden">
      <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-16 size-80 rounded-full bg-sage/15 blur-3xl" />
      <div className="relative mx-auto max-w-[1280px] px-4 py-20 md:px-8 md:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-script text-3xl text-gold">Stay Close to Nature</p>
          <h2 className="mt-3 text-4xl leading-tight text-white md:text-5xl">
            A Little More Nature In Your Inbox
          </h2>
          <p className="mt-4 text-sm text-white/75">
            Get skincare tips, product updates and exclusive offers from ORGO FARM.
          </p>
          <form
            className="mt-8 flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              if (!email.trim()) return;
              setEmail("");
              toast.success("Thank you for subscribing to ORGO FARM.");
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 border border-white/25 bg-white/10 px-5 py-4 text-sm text-white outline-none placeholder:text-white/50 focus:border-gold"
            />
            <button className="bg-gold px-9 py-4 text-[11px] font-semibold tracking-[0.24em] text-[#14271A] transition-all hover:opacity-90">
              SUBSCRIBE
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
