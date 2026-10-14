"use client";

import { useEffect, useRef } from "react";

import { Emblem } from "@/components/emblems";
import { TransitionLink } from "@/components/providers/PageTransition";
import type { Project } from "@/data/projects";
import { gsap, isTouch } from "@/lib/gsap";

/** A foil-framed trading card. Tilts toward the pointer and catches a holographic sheen. */
export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const card = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = card.current;
    if (!el || isTouch()) return;
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      ry((px - 0.5) * 18);
      rx((0.5 - py) * 14);
      el.style.setProperty("--mx", `${px * 100}%`);
      el.style.setProperty("--my", `${py * 100}%`);
      el.style.setProperty("--angle", `${110 + px * 60}deg`);
    };
    const leave = () => {
      rx(0);
      ry(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <TransitionLink
      href={`/work/${project.slug}`}
      label={project.name}
      data-cursor="view"
      className="group block w-[min(70vw,300px)] [perspective:1000px] md:w-[clamp(250px,21vw,340px)]"
    >
      <div ref={card} className="foil aspect-[5/7] will-change-transform">
        <div className="foil__inner flex flex-col">
          <div className="flex items-center justify-between px-4 pt-4">
            <span className="label text-cream/60">{String(index + 1).padStart(2, "0")}</span>
            <span className="label text-cream/60">{project.year}</span>
          </div>
          <div className="relative mx-auto mt-1 aspect-square w-[80%] transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.06]">
            <Emblem kind={project.emblem} />
          </div>
          <div className="mt-auto border-t border-cream/10 px-4 pb-4 pt-3">
            <h3 className="display narrow text-[clamp(30px,2.6vw,42px)] leading-[0.86] text-cream">{project.name}</h3>
            <p className="mt-2 line-clamp-2 text-[12.5px] leading-[1.35] text-cream/60">{project.tagline}</p>
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-col items-center gap-1 text-center">
        <span className="label text-[11.5px] text-cream">{project.stat.value}</span>
        <span className="label text-[10px] text-muted-night">{project.stat.label}</span>
      </div>
    </TransitionLink>
  );
}
