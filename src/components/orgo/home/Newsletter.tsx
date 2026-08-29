"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Reveal } from "@/components/orgo/Reveal";

export function Newsletter() {
  const [email, setEmail] = useState("");
  return (
    <section className="paper">
      <div className="mx-auto max-w-[1280px] px-4 py-20 md:px-8 md:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl leading-tight text-primary md:text-5xl">A Little More Nature In Your Inbox</h2>
          <p className="mt-4 text-sm text-muted-foreground">
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
              className="flex-1 border border-input bg-card px-5 py-4 text-sm outline-none focus:border-primary"
            />
            <button className="bg-primary px-9 py-4 text-[11px] tracking-[0.24em] text-primary-foreground">
              SUBSCRIBE
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
