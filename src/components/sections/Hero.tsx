"use client";

import Image from "next/image";
import { useRef } from "react";

import portrait from "@/assets/img/hero-portrait.png";
import { LocalTime } from "@/components/LocalTime";
import { Signature } from "@/components/Signature";
import { TopoCanvas } from "@/components/TopoCanvas";
import { site } from "@/data/site";
import { whenLoaded } from "@/lib/app-state";
import { gsap, prefersReducedMotion, SplitText, useGSAP } from "@/lib/gsap";

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const reduced = prefersReducedMotion();
      const lines = gsap.utils.toArray<HTMLElement>("[data-name-line]");
      const splits = lines.map((l) => new SplitText(l, { type: "chars", charsClass: "inline-block will-change-transform" }));
      const chars = splits.flatMap((s) => s.chars);

      if (!reduced) {
        gsap.set(chars, { yPercent: 115 });
        gsap.set(lines, { fontVariationSettings: "'wdth' 75" });
        gsap.set("[data-portrait]", { yPercent: 14, scale: 1.06, autoAlpha: 0 });
        gsap.set("[data-hero-fade]", { autoAlpha: 0, y: 18 });
      }

      const unsub = whenLoaded(contextSafe!(() => {
        if (reduced) return;
        gsap
          .timeline({ delay: 0.15 })
          .to("[data-portrait]", { yPercent: 0, scale: 1, autoAlpha: 1, duration: 1.8, ease: "expo" }, 0)
          .to(chars, { yPercent: 0, duration: 1.3, stagger: 0.045, ease: "expo" }, 0.1)
          .to(lines, { fontVariationSettings: "'wdth' 112", duration: 1.6, ease: "expo" }, 0.25)
          .to("[data-hero-fade]", { autoAlpha: 1, y: 0, duration: 1, stagger: 0.07 }, 0.7);
      }));

      // scroll-out: name pulls apart and compresses, portrait lags behind
      if (!reduced) {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 },
          defaults: { ease: "none" },
        });
        tl.to(lines[0], { xPercent: -14, fontVariationSettings: "'wdth' 80" }, 0)
          .to(lines[1], { xPercent: 10, fontVariationSettings: "'wdth' 80" }, 0)
          .to("[data-portrait-wrap]", { yPercent: 16 }, 0)
          .to("[data-hero-sig]", { yPercent: -25, rotate: -9 }, 0)
          .to("[data-hero-topo]", { autoAlpha: 0.2 }, 0)
          .to("[data-hero-info]", { y: -60, autoAlpha: 0 }, 0);
      }

      return () => {
        unsub();
        splits.forEach((s) => s.revert());
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} data-theme="light" className="relative h-[100svh] min-h-[620px] overflow-hidden bg-cream text-ink">
      <div data-hero-topo className="absolute inset-0">
        <TopoCanvas className="h-full w-full" color={[0.055, 0.055, 0.07, 0.2]} density={7.5} />
      </div>

      {/* portrait, anchored to the bottom-right where the photo frame cropped it */}
      <div data-portrait-wrap className="absolute -right-[30vw] bottom-0 z-20 h-[56svh] md:right-0 md:h-[min(88svh,60vw)]">
        <div data-portrait className="relative h-full origin-bottom" style={{ aspectRatio: `${portrait.width} / ${portrait.height}` }}>
          <Image
            src={portrait}
            alt="Kavin Krish, looking up and to the left"
            priority
            data-preload
            sizes="(min-width: 768px) 60vw, 66vh"
            quality={90}
            className="h-full w-full object-contain object-right-bottom"
          />
        </div>
      </div>

      {/* one column: name, signature, role. Stacked in flow so they can never collide. */}
      <div className="relative z-30 flex h-full flex-col px-[var(--gutter)] pb-[var(--gutter)] pt-[calc(var(--header-h)+4vh)] md:w-[58vw] md:pt-[calc(var(--header-h)+3vh)]">
        <h1 className="display leading-[0.8]">
          <span className="sr-only">
            {site.fullName}, {site.role}
          </span>
          <span aria-hidden className="block overflow-hidden pb-[0.04em]">
            <span data-name-line className="block text-[25vw] [font-variation-settings:'wdth'_112] md:text-[min(14.4vw,24svh)]">
              Kavin
            </span>
          </span>
          <span aria-hidden className="block overflow-hidden pb-[0.04em]">
            <span data-name-line className="block text-[25vw] [font-variation-settings:'wdth'_112] md:text-[min(14.4vw,24svh)]">
              Krish
            </span>
          </span>
        </h1>

        <div
          data-hero-sig
          className="pointer-events-none mt-[1.5svh] h-[12svh] w-[58vw] self-end -rotate-[4deg] text-blue md:my-[2.5svh] md:h-auto md:min-h-0 md:w-full md:flex-1 md:self-start md:pl-[5vw]"
        >
          <Signature className="h-full w-full" align="left" strokeWidth={4.6} delay={0.55} duration={1.9} />
        </div>

        {/* role + status */}
        <div
          data-hero-info
          className="mt-auto flex flex-col gap-4 rounded-[18px] bg-cream/80 p-4 backdrop-blur-md md:mt-0 md:max-w-[36vw] md:gap-5 md:rounded-none md:bg-transparent md:p-0 md:backdrop-blur-none"
        >
          <p data-hero-fade className="text-[clamp(22px,min(2.3vw,4.2svh),36px)] leading-[1.02] tracking-[-0.02em]">
            <span className="serif-i">Machine learning</span>
            <span className="font-semibold"> & full-stack</span>
            <br />
            <span className="font-semibold">engineer, building</span>
            <span className="serif-i"> end to end.</span>
          </p>
          <div data-hero-fade className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="label text-ink/60">
              {site.schoolShort} · {site.years}
            </span>
            <span className="label text-ink/60">
              {site.city} · <LocalTime />
            </span>
          </div>
          <div data-hero-fade>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-ink/15 bg-paper/70 px-4 py-2 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue" />
              </span>
              <span className="label text-ink/80">{site.status}</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
