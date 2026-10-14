"use client";

import { useRef, useState } from "react";

import { FitWord } from "@/components/FitWord";
import { Marquee } from "@/components/Marquee";
import { allTools, stack, type Tool } from "@/data/stack";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

function ToolIcon({ tool, className = "h-7 w-7" }: { tool: Tool; className?: string }) {
  if (!tool.path) {
    return (
      <span className={`flex items-center justify-center rounded-[6px] border border-current font-mono text-[10px] font-bold ${className}`}>
        {tool.name.slice(0, 2).toUpperCase()}
      </span>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d={tool.path} />
    </svg>
  );
}

const TILTS = [-4, 3, -2.5, 4, -3.5];

export function Stack() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const plates = gsap.utils.toArray<HTMLElement>("[data-plate]");
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // each plate is either gone (flung up), current, or waiting below
        const states = (i: number, current: number) =>
          i < current
            ? { yPercent: -48, rotate: TILTS[i] - 14, scale: 1.12, autoAlpha: 0, filter: "blur(16px)" }
            : i === current
              ? { yPercent: 0, rotate: TILTS[i], scale: 1, autoAlpha: 1, filter: "blur(0px)" }
              : { yPercent: 55, rotate: TILTS[i] + 10, scale: 0.86, autoAlpha: 0, filter: "blur(14px)" };

        plates.forEach((p, i) => gsap.set(p, states(i, 0)));
        let current = 0;

        // Scroll only decides which plate is current; the swap itself always plays to the end,
        // so stopping mid-scroll never leaves a plate half-blurred.
        const show = (next: number) => {
          if (next === current) return;
          const forward = next > current;
          current = next;
          setActive(next);
          plates.forEach((p, i) => {
            gsap.to(p, {
              ...states(i, next),
              duration: i === next ? 0.85 : 0.6,
              delay: i === next && forward ? 0.08 : 0,
              ease: i === next ? "expo" : "power3.in",
              overwrite: true,
            });
          });
        };

        ScrollTrigger.create({
          trigger: "[data-stack-pin]",
          start: "top top",
          end: () => `+=${window.innerHeight * 0.65 * plates.length}`,
          pin: true,
          onUpdate: (self) => show(Math.min(plates.length - 1, Math.floor(self.progress * plates.length))),
        });

        gsap.fromTo(
          "[data-stack-word]",
          { xPercent: 1.5 },
          {
            xPercent: -1.5,
            ease: "none",
            scrollTrigger: { trigger: "[data-stack-pin]", start: "top top", end: () => `+=${window.innerHeight * 0.65 * plates.length}`, scrub: true },
          },
        );
      });

      gsap.from("[data-stack-head] > *", {
        y: 30,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 1.1,
        scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="stack" data-theme="dark" className="relative bg-night text-cream">
      <div data-stack-pin className="relative flex min-h-[100svh] flex-col overflow-hidden motion-safe:h-[100svh]">
        <div className="pointer-events-none absolute inset-x-[var(--gutter)] top-[20svh] select-none" aria-hidden>
          <div data-stack-word>
            <FitWord text="Stack" fill={0.96} className="display dot-type dot-type--blue leading-[0.8] [font-variation-settings:'wdth'_125]" />
          </div>
        </div>

        <div data-stack-head className="relative z-10 mt-[calc(var(--header-h)+1vh)] flex items-start justify-between px-[var(--gutter)]">
          <span className="label text-cream/50">(03) — Stack</span>
          <span className="label hidden text-cream/50 md:block">Tools I reach for</span>
        </div>

        <div className="relative z-10 grid flex-1 grid-cols-1 items-center gap-8 px-[var(--gutter)] md:grid-cols-12">
          {/* index */}
          <div className="order-2 flex gap-5 md:order-1 md:col-span-3 md:self-end md:pb-[14svh]">
            <div className="flex flex-col gap-2 pt-1" aria-hidden>
              {stack.map((s, i) => (
                <span
                  key={s.key}
                  className={`block w-[3px] rounded-full transition-all duration-500 ease-[var(--ease-out)] ${i === active ? "h-8 bg-cream" : "h-[6px] bg-cream/30"}`}
                />
              ))}
            </div>
            <div className="relative min-h-[150px] flex-1">
              {stack.map((s, i) => (
                <div
                  key={s.key}
                  className={`absolute inset-0 transition-all duration-500 ease-[var(--ease-out)] ${i === active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}
                  aria-hidden={i !== active}
                >
                  <h3 className="text-[20px] font-semibold tracking-[-0.01em]">{s.title}</h3>
                  <p className="mt-2 max-w-[260px] text-[14px] leading-[1.5] text-cream/60">{s.blurb}</p>
                </div>
              ))}
            </div>
          </div>

          {/* plates */}
          <div className="relative order-1 mx-auto aspect-[4/4.6] w-[min(78vw,430px)] md:order-2 md:col-span-6 md:w-[min(32vw,460px)]">
            {stack.map((s, i) => (
              <figure
                key={s.key}
                data-plate
                className="absolute inset-0 flex flex-col rounded-[6px] bg-cream p-[clamp(10px,1vw,16px)] pb-0 text-ink shadow-[0_50px_100px_-30px_rgba(0,0,0,0.85)] motion-reduce:relative motion-reduce:mb-6"
                style={{ zIndex: stack.length - i }}
              >
                <div className="grid flex-1 grid-cols-3 content-center gap-x-2 gap-y-6 rounded-[3px] bg-night-2 px-3 py-6 text-cream">
                  {s.tools.map((t) => (
                    <div key={t.name} className="flex flex-col items-center gap-2.5 text-center">
                      <ToolIcon tool={t} className="h-[clamp(24px,2.4vw,36px)] w-[clamp(24px,2.4vw,36px)]" />
                      <span className="label text-[9.5px] leading-tight text-cream/70">{t.name}</span>
                    </div>
                  ))}
                </div>
                <figcaption className="flex items-baseline justify-between py-[clamp(10px,1.2vw,18px)]">
                  <span className="serif-i text-[clamp(22px,2vw,32px)]">{s.title}</span>
                  <span className="label text-ink/50">0{i + 1}/0{stack.length}</span>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="order-3 hidden md:col-span-3 md:block" />
        </div>

        <div className="relative z-10 border-t border-cream/10 py-6">
          <Marquee speed={36}>
            {allTools.map((t) => (
              <span key={t.name} className="mx-7 flex items-center gap-3 text-cream/45">
                <ToolIcon tool={t} className="h-6 w-6" />
                <span className="font-mono text-[12px] uppercase tracking-[0.14em]">{t.name}</span>
              </span>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
