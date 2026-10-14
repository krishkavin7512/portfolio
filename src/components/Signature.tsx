"use client";

import { useRef } from "react";

import { signature } from "@/data/signature";
import { whenLoaded } from "@/lib/app-state";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/** Timeline that draws the given signature strokes in pen order, each taking its share of `duration`. */
export function drawSignature(paths: SVGPathElement[], duration: number) {
  gsap.set(paths, { drawSVG: "0%" });
  const total = signature.paths.reduce((s, p) => s + p.length, 0);
  const tl = gsap.timeline();
  paths.forEach((p, i) => {
    const share = signature.paths[i].length / total;
    tl.to(p, { drawSVG: "100%", duration: Math.max(0.14, duration * share), ease: "power1.inOut" }, i ? ">-0.02" : 0);
  });
  return tl;
}

export function SignaturePaths() {
  return (
    <>
      {signature.paths.map((p) => (
        <path key={p.d.slice(0, 24)} d={p.d} />
      ))}
    </>
  );
}

const [, , VW, VH] = signature.viewBox;
export const SIGNATURE_VIEWBOX = `-10 -10 ${VW + 20} ${VH + 20}`;

type Props = {
  className?: string;
  strokeWidth?: number;
  /** draw when scrolled into view instead of after the preloader */
  onScroll?: boolean;
  delay?: number;
  duration?: number;
  /** where the drawing sits when the box is wider or taller than the signature */
  align?: "center" | "left";
};

/** Kavin's real signature, drawn stroke by stroke in pen order. */
export function Signature({ className, strokeWidth = 3.4, onScroll = false, delay = 0, duration = 2.1, align = "center" }: Props) {
  const root = useRef<SVGSVGElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const paths = gsap.utils.toArray<SVGPathElement>("path", root.current);
      gsap.set(paths, { drawSVG: "0%" });
      const start = contextSafe!(() => gsap.delayedCall(delay, () => drawSignature(paths, duration)));
      if (onScroll) {
        ScrollTrigger.create({ trigger: root.current, start: "top 85%", once: true, onEnter: start });
        return;
      }
      return whenLoaded(start);
    },
    { scope: root },
  );

  return (
    <svg
      ref={root}
      viewBox={SIGNATURE_VIEWBOX}
      preserveAspectRatio={align === "left" ? "xMinYMid meet" : "xMidYMid meet"}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role="img"
      aria-label="Kavin's signature"
    >
      <SignaturePaths />
    </svg>
  );
}
