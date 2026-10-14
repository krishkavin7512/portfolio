"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

let lenisSingleton: Lenis | null = null;
export const getLenis = () => lenisSingleton;

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const reduced = prefersReducedMotion();
    const instance = new Lenis({
      duration: reduced ? 0 : 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !reduced,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      anchors: false,
    });
    lenisSingleton = instance;
    if (process.env.NODE_ENV !== "production") Object.assign(window, { __lenis: instance });
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the instance only exists on the client
    setLenis(instance);
    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      lenisSingleton = null;
    };
  }, []);

  // section themes drive the header, cursor and grain colours
  useEffect(() => {
    const triggers: ScrollTrigger[] = [];
    const setup = () => {
      document.querySelectorAll<HTMLElement>("[data-theme]").forEach((el) => {
        if (el === document.documentElement) return;
        triggers.push(
          ScrollTrigger.create({
            trigger: el,
            start: "top 36px",
            end: "bottom 36px",
            onToggle: (self) => {
              if (self.isActive) document.documentElement.dataset.theme = el.dataset.theme;
            },
          }),
        );
      });
    };
    // children (and their pins) have already mounted by the time this parent effect runs
    setup();
    return () => triggers.forEach((t) => t.kill());
  }, [pathname]);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    lenis?.scrollTo(0, { immediate: true, force: true });
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname, lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
