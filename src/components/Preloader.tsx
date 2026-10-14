"use client";

import { useRef } from "react";

import { MONOGRAM_PATHS } from "@/components/Monogram";
import { appState } from "@/lib/app-state";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { getLenis } from "./providers/SmoothScroll";

const curve = (edge: number, bulge: number) => `M0 0 L100 0 L100 ${edge} Q50 ${bulge} 0 ${edge} Z`;

function waitForAssets(): Promise<void> {
  const fonts = document.fonts?.ready ?? Promise.resolve();
  const imgs = Array.from(document.querySelectorAll<HTMLImageElement>("img[data-preload]")).map((img) =>
    img.complete ? Promise.resolve() : img.decode().catch(() => undefined),
  );
  const all = Promise.all([fonts, ...imgs]).then(() => undefined);
  // never hold the visitor hostage to a slow image
  const timeout = new Promise<void>((resolve) => setTimeout(resolve, 2600));
  return Promise.race([all, timeout]);
}

export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const lenis = getLenis();
      lenis?.stop();
      document.documentElement.classList.add("is-loading");

      const finish = () => {
        document.documentElement.classList.remove("is-loading");
        getLenis()?.start();
        appState.set({ loaded: true });
      };

      if (prefersReducedMotion()) {
        gsap.to(el, { autoAlpha: 0, duration: 0.4, delay: 0.2, onComplete: finish });
        return;
      }

      const strokes = gsap.utils.toArray<SVGPathElement>("[data-mono] path", el);
      const progress = { v: 0 };
      let ready = false;
      waitForAssets().then(() => (ready = true));

      gsap.set(strokes, { drawSVG: "0%" });
      gsap.set("[data-line]", { scaleX: 0 });

      const intro = gsap.timeline();
      intro
        .from("[data-fade]", { autoAlpha: 0, y: 12, stagger: 0.08, duration: 0.8 })
        .to(strokes, { drawSVG: "100%", duration: 0.7, stagger: 0.14, ease: "power2.inOut" }, 0.1);

      // count to 90 on a clock, the last stretch waits for real assets
      const counter = gsap.to(progress, {
        v: 90,
        duration: 1.6,
        ease: "power2.inOut",
        onUpdate: render,
        onComplete: () => {
          const finishCount = () =>
            gsap.to(progress, { v: 100, duration: 0.45, ease: "power2.out", onUpdate: render, onComplete: exit });
          if (ready) finishCount();
          else waitForAssets().then(finishCount);
        },
      });

      function render() {
        const v = Math.round(progress.v);
        if (count.current) count.current.textContent = String(v).padStart(3, "0");
        gsap.set("[data-line]", { scaleX: progress.v / 100 });
      }

      function exit() {
        const state = { edge: 100, bulge: 100 };
        gsap
          .timeline()
          .to(strokes, { stroke: "var(--blue-soft)", duration: 0.3, stagger: 0.03 })
          .to("[data-fade], [data-mono]", { autoAlpha: 0, y: -20, duration: 0.5, stagger: 0.04, ease: "power2.in" }, "+=0.15")
          .add(finish, "-=0.1")
          .to(
            state,
            {
              edge: 0,
              bulge: 0,
              duration: 1.15,
              ease: "inOut",
              onUpdate: () =>
                path.current?.setAttribute("d", curve(state.edge, state.bulge + 22 * Math.sin(Math.PI * (state.edge / 100)))),
            },
            "-=0.35",
          )
          .set(el, { display: "none" });
      }

      return () => {
        intro.kill();
        counter.kill();
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="fixed inset-0 z-[100] text-cream" aria-hidden>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path ref={path} d={curve(100, 100)} fill="var(--night)" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <svg
          data-mono
          viewBox="0 0 64 64"
          className="h-20 w-20 md:h-24 md:w-24"
          fill="none"
          stroke="var(--cream)"
          strokeWidth={3.6}
          strokeLinejoin="miter"
        >
          {MONOGRAM_PATHS.map((d) => (
            <path key={d} d={d} />
          ))}
        </svg>
        <div data-fade className="mt-10 flex w-[min(220px,60vw)] flex-col items-center gap-3">
          <span ref={count} className="font-mono text-[13px] tracking-[0.3em] text-cream/80">
            000
          </span>
          <span className="relative block h-px w-full bg-cream/15">
            <span data-line className="absolute inset-0 origin-left bg-blue-soft" />
          </span>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex justify-between p-[var(--gutter)]">
        <span data-fade className="label text-cream/55">
          Kavin Krish — Portfolio
        </span>
        <span data-fade className="label text-cream/55">
          Chennai, IN
        </span>
      </div>
    </div>
  );
}
