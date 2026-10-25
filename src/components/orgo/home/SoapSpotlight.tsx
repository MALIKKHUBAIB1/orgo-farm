import Image from "next/image";
import { ArrowDownToLine, FileText, Leaf } from "lucide-react";
import { img } from "@/lib/orgo/products";

const catalogueUrl = "/soap/Natural%20Soap%20Presentation%20(1).pdf";

export function SoapSpotlight() {
  return (
    <section className="wash-blush border-y border-border">
      <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-4 py-16 md:px-8 md:py-20 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          <Image
            src={img.soapCollection}
            alt="ORGO FARM natural handmade soap bars"
            width={900}
            height={1600}
            sizes="(max-width: 1024px) 90vw, 45vw"
            className="aspect-[4/3] w-full object-cover soft-shadow"
          />
          <span className="absolute bottom-4 left-4 bg-card/95 px-4 py-2 font-script text-xl text-primary">
            Made with love, from nature
          </span>
        </div>
        <div>
          <Leaf className="size-7 text-accent" strokeWidth={1.4} />
          <p className="eyebrow mt-5 text-accent">The ORGO FARM soap collection</p>
          <h2 className="mt-3 text-4xl leading-tight text-primary md:text-5xl">A natural bar for every kind of care.</h2>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Discover the Countryside, Garden, and Art collections, and find a thoughtful soap gift box. Browse the
            catalogue for the full range and details.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={catalogueUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-primary px-5 py-3 text-[10px] tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-90"
            >
              <FileText className="size-4" /> VIEW SOAP CATALOGUE
            </a>
            <a
              href={catalogueUrl}
              download="ORGO-FARM-Natural-Soap-Catalogue.pdf"
              className="inline-flex items-center gap-2 border border-primary px-5 py-3 text-[10px] tracking-[0.16em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <ArrowDownToLine className="size-4" /> DOWNLOAD PDF
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
