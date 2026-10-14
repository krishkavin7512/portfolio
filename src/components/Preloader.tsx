"use client";

import { useRef } from "react";

import { MONOGRAM_PATHS } from "@/components/Monogram";
import { drawSignature, SIGNATURE_VIEWBOX, SignaturePaths } from "@/components/Signature";
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
  const timeout = new Promise<void>((resolve) => setTimeout(resolve, 2400));
  return Promise.race([all, timeout]);
}

/**
 * Monogram + counter → the signature writes itself in the middle of the screen →
 * it rushes toward the camera and out of frame as the curtain lifts on the site.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      getLenis()?.stop();
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
      const sigPaths = gsap.utils.toArray<SVGPathElement>("[data-sig] path", el);
      const progress = { v: 0 };
      let ready = false;
      waitForAssets().then(() => (ready = true));

      gsap.set(strokes, { drawSVG: "0%" });
      gsap.set(sigPaths, { drawSVG: "0%" });
      gsap.set("[data-line]", { scaleX: 0 });

      const intro = gsap.timeline();
      intro
        .from("[data-fade]", { autoAlpha: 0, y: 12, stagger: 0.08, duration: 0.8 })
        .to(strokes, { drawSVG: "100%", duration: 0.6, stagger: 0.12, ease: "power2.inOut" }, 0.1);

      // count to 90 on a clock, the last stretch waits for real assets
      const counter = gsap.to(progress, {
        v: 90,
        duration: 1.3,
        ease: "power2.inOut",
        onUpdate: render,
        onComplete: () => {
          const finishCount = () =>
            gsap.to(progress, { v: 100, duration: 0.35, ease: "power2.out", onUpdate: render, onComplete: signOff });
          if (ready) finishCount();
          else waitForAssets().then(finishCount);
        },
      });

      function render() {
        if (count.current) count.current.textContent = String(Math.round(progress.v)).padStart(3, "0");
        gsap.set("[data-line]", { scaleX: progress.v / 100 });
      }

      function signOff() {
        const state = { edge: 100, bulge: 100 };
        gsap
          .timeline()
          // clear the stage
          .to("[data-mono], [data-fade]", { autoAlpha: 0, y: -16, duration: 0.45, stagger: 0.03, ease: "power2.in" })
          .set("[data-sig]", { autoAlpha: 1 })
          // sign
          .add(drawSignature(sigPaths, 1.5), "-=0.05")
          .to({}, { duration: 0.25 })
          // and fling it past the camera
          .to("[data-sig]", { scale: 9, rotate: -8, duration: 1.05, ease: "power3.in" })
          .to("[data-sig]", { autoAlpha: 0, filter: "blur(6px)", duration: 0.35, ease: "power1.in" }, "-=0.35")
          .add(finish, "-=0.35")
          .to(
            state,
            {
              edge: 0,
              bulge: 0,
              duration: 1.1,
              ease: "inOut",
              onUpdate: () =>
                path.current?.setAttribute("d", curve(state.edge, state.bulge + 22 * Math.sin(Math.PI * (state.edge / 100)))),
            },
            "-=0.45",
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
    <div ref={root} className="fixed inset-0 z-[100] overflow-hidden text-cream" aria-hidden>
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

      {/* the signature that signs off the loader */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <svg
          data-sig
          viewBox={SIGNATURE_VIEWBOX}
          className="invisible w-[min(78vw,640px)] text-cream will-change-transform"
          fill="none"
          stroke="currentColor"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transformOrigin: "52% 58%" }}
        >
          <SignaturePaths />
        </svg>
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
