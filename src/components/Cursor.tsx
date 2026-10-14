"use client";

import { useEffect, useRef } from "react";

import { gsap, isTouch } from "@/lib/gsap";

const LABELS: Record<string, string> = { view: "View", drag: "Drag", open: "Open ↗", read: "Read" };

/**
 * The system cursor stays as-is (no trailing follower, so nothing ever feels laggy).
 * Over elements marked data-cursor="view|drag|open", a small label rides right beside it.
 */
export function Cursor() {
  const tag = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isTouch()) return;
    const el = tag.current!;
    const t = text.current!;
    let shown = "";

    const onMove = (e: PointerEvent) => {
      // position is set directly every event: zero easing, zero lag
      el.style.transform = `translate3d(${e.clientX + 16}px, ${e.clientY + 18}px, 0)`;
      const target = (e.target as Element | null)?.closest<HTMLElement>("[data-cursor]");
      const kind = target?.dataset.cursor;
      const label = kind && kind !== "hide" ? (target!.dataset.cursorLabel ?? LABELS[kind] ?? kind) : "";
      if (label === shown) return;
      shown = label;
      if (label) {
        t.textContent = label;
        gsap.to(el, { autoAlpha: 1, scale: 1, duration: 0.25, ease: "expo", overwrite: true });
      } else {
        gsap.to(el, { autoAlpha: 0, scale: 0.6, duration: 0.18, ease: "power2.in", overwrite: true });
      }
    };
    const onLeave = () => {
      shown = "";
      gsap.to(el, { autoAlpha: 0, duration: 0.15, overwrite: true });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={tag}
      aria-hidden
      className="pointer-events-none invisible fixed left-0 top-0 z-[110] hidden [@media(hover:hover)_and_(pointer:fine)]:block"
    >
      <span
        ref={text}
        className="block origin-top-left whitespace-nowrap rounded-full bg-blue px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white shadow-[0_8px_24px_-8px_rgba(51,70,255,0.8)]"
      />
    </div>
  );
}
