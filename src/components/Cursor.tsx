"use client";

import { useEffect, useRef } from "react";

import { gsap, isTouch } from "@/lib/gsap";

/**
 * Dot + trailing ring. Elements opt in with data-cursor="view|drag|open|play|hide"
 * and an optional data-cursor-label to override the text.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isTouch()) return;
    const html = document.documentElement;
    html.classList.add("has-cursor");

    const d = dot.current!;
    const r = ring.current!;
    const t = text.current!;
    gsap.set([d, r], { xPercent: -50, yPercent: -50, x: -100, y: -100 });

    const dx = gsap.quickTo(d, "x", { duration: 0.08, ease: "power3" });
    const dy = gsap.quickTo(d, "y", { duration: 0.08, ease: "power3" });
    const rx = gsap.quickTo(r, "x", { duration: 0.45, ease: "power3" });
    const ry = gsap.quickTo(r, "y", { duration: 0.45, ease: "power3" });

    let mode = "";
    let shown = false;

    const setMode = (next: string, label: string) => {
      if (next === mode && t.textContent === label) return;
      mode = next;
      t.textContent = label;
      if (next === "hide") {
        gsap.to([d, r], { scale: 0, duration: 0.3 });
        return;
      }
      if (next) {
        gsap.to(r, { width: Math.max(84, label.length * 9 + 36), height: 84, backgroundColor: "#3346ff", borderColor: "#3346ff", duration: 0.45, ease: "expo" });
        gsap.to(t, { autoAlpha: 1, scale: 1, duration: 0.35, delay: 0.05 });
        gsap.to(d, { scale: 0, duration: 0.25 });
      } else {
        gsap.to(r, { width: 38, height: 38, backgroundColor: "rgba(51,70,255,0)", borderColor: "currentColor", scale: 1, duration: 0.45, ease: "expo" });
        gsap.to(t, { autoAlpha: 0, scale: 0.6, duration: 0.2 });
        gsap.to(d, { scale: 1, duration: 0.25 });
      }
    };

    const labels: Record<string, string> = { view: "View", drag: "Drag", open: "Open ↗", play: "Play", read: "Read" };

    let overLink = false;
    const setLink = (on: boolean) => {
      if (on === overLink) return;
      overLink = on;
      gsap.to(r, { scale: on ? 0.55 : 1, duration: 0.35, ease: "expo", overwrite: "auto" });
    };

    const onMove = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.set([d, r], { x: e.clientX, y: e.clientY });
        gsap.to([d, r], { autoAlpha: 1, duration: 0.3 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      const target = (e.target as Element | null)?.closest<HTMLElement>("[data-cursor], a, button");
      const kind = target?.dataset.cursor;
      if (kind) {
        setLink(false);
        setMode(kind, target!.dataset.cursorLabel ?? labels[kind] ?? kind);
      } else {
        setMode("", "");
        setLink(!!target);
      }
    };

    const onDown = () => gsap.to(r, { scale: overLink ? 0.4 : 0.8, duration: 0.15 });
    const onUp = () => gsap.to(r, { scale: overLink ? 0.55 : 1, duration: 0.3 });
    const onLeave = () => {
      shown = false;
      gsap.to([d, r], { autoAlpha: 0, duration: 0.3 });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);
    return () => {
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[110] hidden [@media(hover:hover)_and_(pointer:fine)]:block">
      <div
        ref={ring}
        className="invisible fixed left-0 top-0 flex h-[38px] w-[38px] items-center justify-center rounded-full border text-[var(--cursor)] [border-color:currentColor]"
      >
        <span ref={text} className="invisible scale-60 font-mono text-[11px] uppercase tracking-[0.14em] text-white" />
      </div>
      <div ref={dot} className="invisible fixed left-0 top-0 h-[6px] w-[6px] rounded-full bg-[var(--cursor)]" />
    </div>
  );
}
