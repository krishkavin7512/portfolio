"use client";

import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(
    ScrollTrigger,
    SplitText,
    DrawSVGPlugin,
    CustomEase,
    Draggable,
    InertiaPlugin,
    ScrambleTextPlugin,
    useGSAP,
  );
  CustomEase.create("expo", "0.22, 1, 0.36, 1");
  CustomEase.create("inOut", "0.76, 0, 0.24, 1");
  CustomEase.create("snap", "0.85, 0, 0.15, 1");
  gsap.defaults({ ease: "expo", duration: 1 });
  ScrollTrigger.config({ ignoreMobileResize: true });
  if (process.env.NODE_ENV !== "production") {
    // test hooks: drive the clock and scroll by hand when the tab can't render frames
    const tick = async (n = 40, ms = 30) => {
      for (let i = 0; i < n; i++) {
        gsap.ticker.tick();
        await new Promise((r) => setTimeout(r, ms));
      }
    };
    const go = async (y: number, n = 45) => {
      const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o: object) => void } }).__lenis;
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo(0, y);
      ScrollTrigger.update();
      await tick(n);
      return [Math.round(window.scrollY), document.documentElement.scrollHeight];
    };
    Object.assign(window, { gsap, ScrollTrigger, __tick: tick, __go: go });
  }
}

export { gsap, ScrollTrigger, SplitText, Draggable, useGSAP };

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isTouch = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: none), (pointer: coarse)").matches;
