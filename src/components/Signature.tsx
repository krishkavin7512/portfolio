"use client";

import { useRef } from "react";

import { signature } from "@/data/signature";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { whenLoaded } from "@/lib/app-state";

type Props = {
  className?: string;
  strokeWidth?: number;
  /** draw when scrolled into view instead of after the preloader */
  onScroll?: boolean;
  delay?: number;
  duration?: number;
};

/** Kavin's real signature, drawn stroke by stroke in pen order. */
export function Signature({ className, strokeWidth = 3.4, onScroll = false, delay = 0, duration = 2.1 }: Props) {
  const root = useRef<SVGSVGElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const paths = gsap.utils.toArray<SVGPathElement>("path", root.current);
      gsap.set(paths, { drawSVG: "0%" });
      const total = signature.paths.reduce((s, p) => s + p.length, 0);
      const tl = gsap.timeline({ paused: true });
      const start = contextSafe!(() => gsap.delayedCall(delay, () => tl.play()));
      paths.forEach((p, i) => {
        const share = signature.paths[i].length / total;
        tl.to(p, { drawSVG: "100%", duration: Math.max(0.12, duration * share), ease: "power1.inOut" }, i ? ">-0.02" : 0);
      });

      if (onScroll) {
        ScrollTrigger.create({ trigger: root.current, start: "top 85%", once: true, onEnter: start });
        return;
      }
      return whenLoaded(start);
    },
    { scope: root },
  );

  const [, , w, h] = signature.viewBox;
  return (
    <svg
      ref={root}
      viewBox={`-8 -8 ${w + 16} ${h + 16}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role="img"
      aria-label="Kavin's signature"
    >
      {signature.paths.map((p) => (
        <path key={p.d.slice(0, 24)} d={p.d} />
      ))}
    </svg>
  );
}
