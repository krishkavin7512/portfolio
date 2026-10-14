"use client";

import Image from "next/image";
import { useRef } from "react";

import hackathon from "@/assets/img/hackathon.jpg";
import macaw from "@/assets/img/lens-macaw-2.jpg";
import { Magnetic } from "@/components/Magnetic";
import { TransitionLink } from "@/components/providers/PageTransition";
import { TopoCanvas } from "@/components/TopoCanvas";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.6} className={className} aria-hidden>
      <path d="M5 15 15 5M7 5h8v8" />
    </svg>
  );
}

const BLOCKS = [
  {
    key: "on",
    lead: "On",
    word: "build",
    href: "/#work",
    body: "Machine learning, full-stack products and the occasional hackathon all-nighter.",
    align: "md:items-end md:text-right",
  },
  {
    key: "off",
    lead: "Off",
    word: "play",
    href: "/#off-screen",
    body: "Valorant on PC, the piano, and a Sony α6100 that goes everywhere I do.",
    align: "md:items-start md:text-left",
  },
];

export function OnOff() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.8 },
        defaults: { ease: "none" },
      });
      tl.fromTo("[data-side='left']", { xPercent: -55, rotate: -8 }, { xPercent: 8, rotate: 4 }, 0).fromTo(
        "[data-side='right']",
        { xPercent: 55, rotate: 8 },
        { xPercent: -8, rotate: -4 },
        0,
      );

      gsap.utils.toArray<HTMLElement>("[data-block]").forEach((b, i) => {
        const t = gsap.timeline({ scrollTrigger: { trigger: b, start: "top 75%", once: true }, delay: i * 0.12 });
        t.from(b.querySelectorAll("[data-rise]"), { yPercent: 105, duration: 1.2, stagger: 0.08 })
          .fromTo(
            b.querySelector("[data-scrawl]"),
            { clipPath: "inset(-20% 100% -20% 0%)" },
            { clipPath: "inset(-20% 0% -20% 0%)", duration: 1.1, ease: "power2.inOut" },
            0.45,
          )
          .from(b.querySelectorAll("[data-fade]"), { autoAlpha: 0, y: 16, duration: 0.9, stagger: 0.08 }, 0.5);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} data-theme="light" className="relative overflow-hidden bg-cream py-[16vh] text-ink md:min-h-[100svh] md:py-0">
      <div className="absolute inset-0 opacity-70">
        <TopoCanvas className="h-full w-full" color={[0.055, 0.055, 0.07, 0.16]} density={6} seed={7.3} />
      </div>

      <div data-side="left" className="pointer-events-none absolute -left-[4vw] top-[14%] hidden w-[24vw] md:block">
        <div className="overflow-hidden rounded-[10px] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)]">
          <Image src={hackathon} alt="" placeholder="blur" sizes="24vw" quality={80} className="h-auto w-full" />
        </div>
      </div>
      <div data-side="right" className="pointer-events-none absolute -right-[4vw] top-[24%] hidden w-[22vw] md:block">
        <div className="overflow-hidden rounded-[10px] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)]">
          <Image src={macaw} alt="" placeholder="blur" sizes="22vw" quality={80} className="h-auto w-full" />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex max-w-[1100px] flex-col items-center gap-24 px-[var(--gutter)] md:h-[100svh] md:flex-row md:justify-center md:gap-[5vw]">
        {BLOCKS.map((b) => (
          <div key={b.key} data-block className={`flex flex-col items-center text-center ${b.align}`}>
            <h2 className="relative">
              <span className="block overflow-hidden">
                <span data-rise className="serif-i block text-[clamp(52px,6.2vw,104px)] leading-[0.9]">
                  {b.lead}
                </span>
              </span>
              <span className="block overflow-hidden">
                <span data-rise className="display block text-[clamp(56px,7.4vw,128px)]">
                  Screen
                </span>
              </span>
              <span
                data-scrawl
                aria-hidden
                className="script pointer-events-none absolute -top-[0.08em] left-1/2 -translate-x-1/2 -rotate-[9deg] text-[clamp(84px,9vw,160px)] text-blue"
              >
                {b.word}
              </span>
            </h2>
            <p data-fade className="mt-7 max-w-[300px] text-[16px] leading-[1.45] text-ink/70">
              {b.body}
            </p>
            <div data-fade className="mt-6">
              <Magnetic>
                <TransitionLink
                  href={b.href}
                  aria-label={`${b.lead} screen`}
                  className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-blue text-white transition-colors duration-300 hover:bg-ink"
                >
                  <Arrow className="h-5 w-5" />
                </TransitionLink>
              </Magnetic>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
