"use client";

import { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { API_URL } from "@/lib/orgo/api";
import { DEFAULT_FAQS, type Faq } from "@/lib/orgo/faqs";

export function FaqView() {
  const [faqs, setFaqs] = useState<Faq[]>(DEFAULT_FAQS);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/faqs`);
        if (!res.ok) return;
        const data: unknown = await res.json();
        if (Array.isArray(data)) {
          const list = data as Faq[];
          if (!cancelled) setFaqs(list.length ? [...list].sort((a, b) => a.sortOrder - b.sortOrder) : []);
        }
      } catch {
        /* keep default fallback */
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
    <div className="mx-auto max-w-[820px] px-4 py-14 md:px-8 md:py-20">
      <p className="eyebrow text-accent">Help</p>
      <h1 className="mt-3 text-5xl text-primary md:text-6xl">Frequently Asked Questions</h1>
      <Accordion type="single" collapsible className="mt-10">
        {faqs.length === 0 ? (
          <p className="py-8 text-sm text-muted-foreground">No FAQs yet — check back soon.</p>
        ) : (
          faqs.map((faq) => (
            <AccordionItem key={faq._id ?? faq.question} value={faq._id ?? faq.question}>
              <AccordionTrigger className="text-left font-display text-lg">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))
        )}
      </Accordion>
    </div>
  );
}