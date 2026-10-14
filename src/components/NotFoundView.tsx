"use client";

import { useRef } from "react";

import { Magnetic } from "@/components/Magnetic";
import { TransitionLink } from "@/components/providers/PageTransition";
import { TopoCanvas } from "@/components/TopoCanvas";
import { whenLoaded } from "@/lib/app-state";
import { gsap, useGSAP } from "@/lib/gsap";

export function NotFoundView() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      gsap.set("[data-nf]", { autoAlpha: 0, y: 40 });
      return whenLoaded(contextSafe!(() => gsap.to("[data-nf]", { autoAlpha: 1, y: 0, stagger: 0.08, duration: 1.2, delay: 0.3 })));
    },
    { scope: root },
  );

  return (
    <main ref={root} id="main" data-theme="light" className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-cream px-[var(--gutter)] text-center text-ink">
      <div className="absolute inset-0">
        <TopoCanvas className="h-full w-full" color={[0.055, 0.055, 0.07, 0.24]} density={9} seed={404} />
      </div>
      <p data-nf className="label relative mb-6 text-ink/50">
        Error 404
      </p>
      <h1 data-nf className="display wide relative text-[clamp(110px,24vw,420px)] leading-[0.8]">
        Lost
      </h1>
      <p data-nf className="relative mt-4 font-serif text-[clamp(26px,3vw,44px)] italic">
        This page is off the map.
      </p>
      <div data-nf className="relative mt-10">
        <Magnetic>
          <TransitionLink href="/" label="Home" className="label inline-flex h-12 items-center rounded-full bg-blue px-6 text-white transition-colors hover:bg-ink">
            Take me home ↗
          </TransitionLink>
        </Magnetic>
      </div>
    </main>
  );
}
