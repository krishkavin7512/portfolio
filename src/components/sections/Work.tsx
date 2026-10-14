"use client";

import { useRef } from "react";

import { FitWord } from "@/components/FitWord";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/data/projects";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

export function Work() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current!;

      // diagonal wipe as the night section arrives
      if (!prefersReducedMotion()) {
        gsap.fromTo(
          section,
          { clipPath: "polygon(0% 24%, 100% 0%, 100% 100%, 0% 100%)" },
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            ease: "none",
            scrollTrigger: { trigger: section, start: "top bottom", end: "top top", scrub: true },
          },
        );
      }

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const track = section.querySelector<HTMLElement>("[data-track]")!;
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

        const range = { trigger: "[data-pin]", start: "top top", end: () => `+=${distance() * 1.1}`, invalidateOnRefresh: true };
        const move = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: { ...range, pin: true, scrub: 1 },
        });
        gsap
          .timeline({ defaults: { ease: "none" }, scrollTrigger: { ...range, scrub: 1 } })
          .to("[data-ruler]", { x: () => -distance() * 0.55 }, 0)
          .fromTo("[data-bigword]", { xPercent: 1.5 }, { xPercent: -1.5 }, 0)
          .to("[data-progress]", { scaleX: 1 }, 0);

        // cards settle from a tilt as they travel in from the right
        gsap.utils.toArray<HTMLElement>("[data-card]").forEach((card, i) => {
          gsap.fromTo(
            card,
            { rotate: i % 2 ? 8 : -8, yPercent: i % 2 ? 14 : -10 },
            {
              rotate: i % 2 ? -1.5 : 1.5,
              yPercent: i % 2 ? 5 : -5,
              ease: "none",
              scrollTrigger: { trigger: card, containerAnimation: move, start: "left right", end: "center 55%", scrub: true },
            },
          );
        });
      });

      gsap.from("[data-work-head] > *", {
        y: 30,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 1.1,
        scrollTrigger: { trigger: section, start: "top 60%", once: true },
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="work" data-theme="dark" className="relative z-10 -mt-[22svh] bg-night text-cream">
      <div data-pin className="relative flex min-h-[100svh] flex-col overflow-hidden motion-safe:h-[100svh]">
        {/* giant textured word */}
        <div className="pointer-events-none absolute inset-x-[var(--gutter)] top-[calc(var(--header-h)+3vh)] select-none" aria-hidden>
          <div data-bigword>
            <FitWord text="Selected Work" fill={0.96} className="display narrow dot-type dot-type--blue leading-[0.8]" />
          </div>
        </div>

        <div data-work-head className="relative z-10 mt-[calc(var(--header-h)+1vh)] flex items-start justify-between px-[var(--gutter)]">
          <span className="label text-cream/50">(02) — Selected work</span>
          <span className="label hidden text-cream/50 md:block">{projects.length} projects · keep scrolling</span>
        </div>

        <div className="relative z-10 flex flex-1 items-center py-10">
          <div
            data-track
            className="flex items-center gap-[clamp(40px,6vw,110px)] pl-[var(--gutter)] pr-[12vw] will-change-transform motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:pr-[var(--gutter)]"
          >
            <div className="flex w-[min(78vw,400px)] shrink-0 flex-col gap-6 md:w-[27vw]">
              <h2 className="font-serif text-[clamp(32px,3.1vw,54px)] leading-[1.02] tracking-[-0.02em]">
                Six projects, <span className="italic text-blue-soft">one rule:</span> the model has to ship.
              </h2>
              <p className="max-w-[340px] text-[15px] leading-[1.5] text-cream/60">
                Sign language read in real time, risk scores you can act on, insurance that pays out on its own. Each card opens the full story.
              </p>
            </div>
            {projects.map((p, i) => (
              <div key={p.slug} data-card className="shrink-0">
                <ProjectCard project={p} index={i} />
              </div>
            ))}
          </div>
        </div>

        {/* ruler */}
        <div className="pointer-events-none relative z-0 h-[15svh] min-h-[90px] overflow-hidden" aria-hidden>
          <div data-ruler className="absolute bottom-0 left-0 flex items-end will-change-transform">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="relative w-[32vw] shrink-0">
                <span className="display narrow absolute bottom-[34px] left-0 -translate-x-1/2 text-[clamp(48px,6vw,96px)] text-cream/[0.08]">
                  {String(i * 10).padStart(2, "0")}
                </span>
                <div className="flex h-[26px] items-end justify-between">
                  {Array.from({ length: 10 }).map((__, j) => (
                    <span key={j} className={`block w-px ${j === 0 ? "h-[26px] bg-cream/40" : j === 5 ? "h-[16px] bg-cream/20" : "h-[9px] bg-cream/20"}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="absolute inset-x-[var(--gutter)] bottom-0 h-px bg-cream/10">
            <div data-progress className="h-full origin-left scale-x-0 bg-blue-soft" />
          </div>
        </div>
      </div>
    </section>
  );
}
