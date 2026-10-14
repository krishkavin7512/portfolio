"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { getLenis } from "@/components/providers/SmoothScroll";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Endless horizontal loop. Drifts at `speed` px/s and borrows extra speed (and direction)
 * from the page scroll, so it surges when you scroll and reverses when you scroll back.
 */
export function Marquee({ children, speed = 40, className = "" }: { children: ReactNode; speed?: number; className?: string }) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el || prefersReducedMotion()) return;
    let x = 0;
    let dir = -1;
    let boost = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const tick = (_t: number, dt: number) => {
      if (!visible) return;
      const half = el.scrollWidth / 2;
      const v = getLenis()?.velocity ?? 0;
      if (Math.abs(v) > 0.5) dir = v > 0 ? -1 : 1;
      boost += (Math.min(Math.abs(v) * 28, 900) - boost) * 0.08;
      x += dir * (speed + boost) * (dt / 1000);
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      gsap.set(el, { x });
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
    };
  }, [speed]);

  return (
    <div className={`overflow-hidden ${className}`}>
      <div ref={track} className="marquee-track">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
