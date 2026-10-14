"use client";

import { useRef } from "react";

import { TransitionLink } from "@/components/providers/PageTransition";
import { timeline } from "@/data/timeline";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";

const DIGITS = "0123456789";

/** One rolling digit: a column of 0–9 that slides to the active number. */
function Wheel({ index }: { index: number }) {
  return (
    <span className="relative inline-block h-[0.8em] overflow-hidden align-top">
      <span data-wheel={index} className="flex flex-col leading-[0.8]">
        {DIGITS.split("").map((d) => (
          <span key={d} className="block h-[0.8em]">
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

export function Timeline() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const wheels = gsap.utils.toArray<HTMLElement>("[data-wheel]");
      const setYear = (year: string, instant = false) => {
        year.split("").forEach((d, i) => {
          gsap.to(wheels[i], { yPercent: -Number(d) * 10, duration: instant ? 0 : 0.9, ease: "expo", delay: instant ? 0 : i * 0.05 });
        });
      };
      setYear(timeline[0].year, true);

      gsap.utils.toArray<HTMLElement>("[data-year-group]").forEach((g) => {
        ScrollTrigger.create({
          trigger: g,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setYear(g.dataset.yearGroup!),
        });
      });

      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-spine]",
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: "[data-entries]", start: "top 60%", end: "bottom 60%", scrub: true } },
      );
      gsap.utils.toArray<HTMLElement>("[data-entry]").forEach((e) => {
        gsap.from(e, { x: 40, autoAlpha: 0, duration: 1, scrollTrigger: { trigger: e, start: "top 85%", once: true } });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="timeline" data-theme="dark" className="relative bg-night py-[18vh] text-cream">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-[var(--gutter)] md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-[calc(var(--header-h)+6vh)]">
            <p className="label mb-6 text-cream/50">(06) — Timeline</p>
            <div className="display wide whitespace-nowrap text-[clamp(84px,11.2vw,210px)] text-cream" aria-hidden>
              {[0, 1, 2, 3].map((i) => (
                <Wheel key={i} index={i} />
              ))}
            </div>
            <p className="mt-8 max-w-[360px] text-[16px] leading-[1.5] text-cream/60">
              Two years in, two to go. Everything I&apos;ve shipped since starting at SRM, and what&apos;s next.
            </p>
          </div>
        </div>

        <div data-entries className="relative md:col-span-7">
          <div className="absolute bottom-0 left-[7px] top-0 w-px bg-cream/10" aria-hidden>
            <div data-spine className="h-full w-full origin-top bg-blue-soft" />
          </div>
          <ol className="flex flex-col gap-16">
            {timeline.map((g) => (
              <li key={g.year} data-year-group={g.year} className="relative pl-12">
                <span className="absolute left-0 top-[6px] flex h-[15px] w-[15px] items-center justify-center rounded-full border border-blue-soft bg-night" aria-hidden>
                  <span className="h-[5px] w-[5px] rounded-full bg-blue-soft" />
                </span>
                <h3 className="label mb-6 text-blue-soft">{g.year}</h3>
                <ul className="flex flex-col gap-3">
                  {g.entries.map((e) => {
                    const inner = (
                      <>
                        <span className="label w-14 shrink-0 pt-1.5 text-cream/45">{e.when}</span>
                        <span className="flex flex-1 flex-col gap-1.5">
                          <span className="flex items-center gap-3 text-[clamp(20px,1.8vw,28px)] font-semibold tracking-[-0.015em]">
                            {e.title}
                            {e.upcoming && <span className="label rounded-full border border-blue-soft/60 px-2 py-0.5 text-[9px] text-blue-soft">Next</span>}
                          </span>
                          <span className="text-[15px] leading-[1.5] text-cream/60">{e.body}</span>
                        </span>
                        {e.href && (
                          <span aria-hidden className="pt-1.5 text-cream/40 transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-blue-soft">
                            ↗
                          </span>
                        )}
                      </>
                    );
                    const cls = `group flex gap-5 rounded-[14px] border px-5 py-5 transition-colors duration-300 ${
                      e.upcoming ? "border-dashed border-cream/20" : "border-cream/10 bg-night-2/60"
                    } ${e.href ? "hover:border-blue-soft/50 hover:bg-night-3" : ""}`;
                    return (
                      <li key={e.title} data-entry>
                        {e.href ? (
                          <TransitionLink href={e.href} label={e.title} className={cls}>
                            {inner}
                          </TransitionLink>
                        ) : (
                          <div className={cls}>{inner}</div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
