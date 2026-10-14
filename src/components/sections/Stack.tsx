"use client";

import { useRef, useState } from "react";

import { Marquee } from "@/components/Marquee";
import { allTools, stack, type Tool } from "@/data/stack";
import { gsap, useGSAP } from "@/lib/gsap";

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
        plates.forEach((p, i) => {
          if (i > 0) gsap.set(p, { yPercent: 55, rotate: TILTS[i] + 10, scale: 0.86, autoAlpha: 0, filter: "blur(14px)" });
          else gsap.set(p, { rotate: TILTS[0] });
        });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut", duration: 1 },
          scrollTrigger: {
            trigger: "[data-stack-pin]",
            start: "top top",
            end: () => `+=${window.innerHeight * 0.8 * (plates.length - 1) + window.innerHeight * 0.4}`,
            pin: true,
            scrub: 0.8,
            onUpdate: (self) => {
              const i = Math.min(plates.length - 1, Math.round(self.progress * (plates.length - 1) * 1.08));
              setActive((prev) => (prev === i ? prev : i));
            },
          },
        });

        plates.forEach((p, i) => {
          if (i === plates.length - 1) return;
          const next = plates[i + 1];
          tl.to(p, { yPercent: -45, rotate: TILTS[i] - 14, scale: 1.12, autoAlpha: 0, filter: "blur(16px)" }, i)
            .to(next, { yPercent: 0, rotate: TILTS[i + 1], scale: 1, autoAlpha: 1, filter: "blur(0px)" }, i + 0.08);
        });
        tl.to({}, { duration: 0.35 });
        tl.to("[data-stack-word]", { xPercent: -14, ease: "none", duration: tl.duration() }, 0);
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
        <div className="pointer-events-none absolute inset-x-0 top-[18svh] select-none overflow-hidden" aria-hidden>
          <div data-stack-word className="display dot-type dot-type--blue whitespace-nowrap text-center text-[clamp(140px,26vw,460px)] leading-[0.8] [font-variation-settings:'wdth'_125]">
            Stack Stack
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
