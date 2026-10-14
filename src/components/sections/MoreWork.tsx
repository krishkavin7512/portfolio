"use client";

import { useEffect, useRef, useState } from "react";

import { Preview } from "@/components/emblems";
import { archive } from "@/data/projects";
import { gsap, isTouch, useGSAP } from "@/lib/gsap";

export function MoreWork() {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  useGSAP(
    () => {
      gsap.from("[data-row]", {
        yPercent: 40,
        autoAlpha: 0,
        stagger: 0.07,
        duration: 1.1,
        scrollTrigger: { trigger: "[data-rows]", start: "top 80%", once: true },
      });
      gsap.from("[data-more-title] > span > span", {
        yPercent: 110,
        stagger: 0.08,
        duration: 1.2,
        scrollTrigger: { trigger: "[data-more-title]", start: "top 85%", once: true },
      });
    },
    { scope: root },
  );

  // preview card follows the pointer, leaning into the direction of travel
  useEffect(() => {
    const el = preview.current;
    if (!el || isTouch()) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.55, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.55, ease: "power3" });
    const rTo = gsap.quickTo(el, "rotate", { duration: 0.6, ease: "power3" });
    let last = 0;
    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      rTo(gsap.utils.clamp(-12, 12, (e.clientX - last) * 0.6));
      last = e.clientX;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useEffect(() => {
    if (!preview.current) return;
    gsap.to(preview.current, { autoAlpha: hover === null ? 0 : 1, scale: hover === null ? 0.7 : 1, duration: 0.45, ease: "expo" });
  }, [hover]);

  return (
    <section ref={root} data-theme="dark" className="relative bg-night pb-[18vh] pt-[14vh] text-cream">
      <div className="mx-auto max-w-[1600px] px-[var(--gutter)]">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 data-more-title className="display text-[clamp(56px,9vw,150px)] [font-variation-settings:'wdth'_110]">
            <span className="block overflow-hidden">
              <span className="block">More</span>
            </span>
            <span className="block overflow-hidden">
              <span className="serif-i block text-blue-soft [font-variation-settings:normal]">work</span>
            </span>
          </h2>
          <p className="max-w-[360px] text-[15px] leading-[1.5] text-cream/60 md:text-right">
            Smaller builds, team projects and the ones made for friends and family.
          </p>
        </div>

        <ul data-rows className="border-t border-cream/15" onPointerLeave={() => setHover(null)}>
          {archive.map((p, i) => {
            const Tag = p.href ? "a" : "div";
            return (
              <li key={p.name} data-row className="border-b border-cream/15">
                <Tag
                  {...(p.href ? { href: p.href, target: "_blank", rel: "noopener noreferrer", "data-cursor": "open" } : {})}
                  onPointerEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-x-5 gap-y-2 overflow-hidden py-6 md:grid-cols-[60px_minmax(0,1.1fr)_minmax(0,1.2fr)_minmax(0,0.8fr)_70px] md:py-8"
                >
                  <span aria-hidden className="absolute inset-0 origin-bottom scale-y-0 bg-blue transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-y-100" />
                  <span className="label relative text-cream/45 group-hover:text-white/80">0{i + 1}</span>
                  <span className="display narrow relative text-[clamp(30px,3.4vw,54px)] leading-[0.9] transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-3">
                    {p.name}
                  </span>
                  <span className="relative col-span-3 text-[14px] leading-[1.45] text-cream/60 group-hover:text-white/85 md:col-span-1">
                    {p.summary}
                  </span>
                  <span className="relative col-span-3 flex flex-wrap gap-1.5 md:col-span-1">
                    {p.tags.map((t) => (
                      <span key={t} className="label rounded-full border border-cream/20 px-2.5 py-1 text-[9.5px] text-cream/70 group-hover:border-white/40 group-hover:text-white">
                        {t}
                      </span>
                    ))}
                  </span>
                  <span className="label relative row-start-1 justify-self-end text-cream/50 group-hover:text-white md:row-auto">
                    {p.note ?? p.year}
                    {p.href ? " ↗" : ""}
                  </span>
                </Tag>
              </li>
            );
          })}
        </ul>
      </div>

      <div
        ref={preview}
        aria-hidden
        className="pointer-events-none invisible fixed left-0 top-0 z-40 hidden h-[200px] w-[300px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[10px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] [@media(hover:hover)]:block"
      >
        <div className="transition-transform duration-500 ease-[var(--ease-out)]" style={{ transform: `translateY(${-(hover ?? 0) * 200}px)` }}>
          {archive.map((p) => (
            <div key={p.name} className="h-[200px] w-[300px]">
              <Preview kind={p.preview} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
