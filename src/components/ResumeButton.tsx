"use client";

import { useRef } from "react";

import { site } from "@/data/site";
import { gsap } from "@/lib/gsap";
import { Magnetic } from "./Magnetic";

/** Résumé pill. Until a PDF is supplied it shows a "coming soon" note instead of a dead link. */
export function ResumeButton({ className = "", tone = "accent" }: { className?: string; tone?: "accent" | "ghost" }) {
  const note = useRef<HTMLSpanElement>(null);
  const base =
    tone === "accent"
      ? "bg-blue text-white hover:bg-blue-deep"
      : "border border-current/30 hover:bg-[var(--hfg)] hover:text-[var(--hbg)]";
  const cls = `group relative inline-flex h-11 items-center gap-2 rounded-full px-5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-300 ${base} ${className}`;

  const icon = (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
      <path d="M8 2v9M4 7.5 8 11.5l4-4M3 14h10" />
    </svg>
  );

  if (site.resume) {
    return (
      <Magnetic>
        <a href={site.resume} download className={cls} data-cursor="open" data-cursor-label="PDF">
          {icon}
          Résumé
        </a>
      </Magnetic>
    );
  }

  const soon = () => {
    if (!note.current) return;
    gsap.killTweensOf(note.current);
    gsap
      .timeline()
      .fromTo(note.current, { autoAlpha: 0, y: -6 }, { autoAlpha: 1, y: 0, duration: 0.35 })
      .to(note.current, { autoAlpha: 0, y: -6, duration: 0.3, delay: 1.8 });
  };

  return (
    <Magnetic>
      <button type="button" onClick={soon} className={cls} aria-describedby="resume-soon">
        {icon}
        Résumé
        <span
          ref={note}
          id="resume-soon"
          role="status"
          className="invisible absolute left-1/2 top-[calc(100%+10px)] -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-[10px] text-cream"
        >
          Coming soon
        </span>
      </button>
    </Magnetic>
  );
}
