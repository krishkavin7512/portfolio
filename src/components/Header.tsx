"use client";

import { useEffect, useRef } from "react";

import { Monogram } from "@/components/Monogram";
import { TransitionLink } from "@/components/providers/PageTransition";
import { appState, useAppState, whenLoaded } from "@/lib/app-state";
import { gsap, useGSAP } from "@/lib/gsap";
import { Magnetic } from "./Magnetic";
import { Menu } from "./Menu";
import { ResumeButton } from "./ResumeButton";

export function Header() {
  const root = useRef<HTMLElement>(null);
  const open = useAppState((s) => s.menuOpen);

  useGSAP(
    (_, contextSafe) => {
      gsap.set("[data-h]", { autoAlpha: 0, y: -16 });
      return whenLoaded(contextSafe!(() => gsap.to("[data-h]", { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08, delay: 0.55 })));
    },
    { scope: root },
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && appState.set({ menuOpen: false });
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        ref={root}
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex items-start justify-between px-[var(--gutter)] pt-[calc(var(--gutter)*0.8)] text-[var(--hfg)] transition-colors duration-500"
      >
        <TransitionLink
          href="/"
          label="Home"
          data-h
          className="pointer-events-auto leading-[0.86]"
          aria-label="Kavin Krish, home"
        >
          <span className="block font-serif text-[22px] tracking-[-0.01em] md:text-[26px]">Kavin</span>
          <span className="display wide block text-[20px] md:text-[24px]">Krish</span>
        </TransitionLink>

        <TransitionLink
          href="/"
          label="Home"
          data-h
          className="pointer-events-auto absolute left-1/2 top-[calc(var(--gutter)*0.8)] hidden -translate-x-1/2 md:block"
          aria-label="Home"
        >
          <Monogram className="h-9 w-9 transition-transform duration-700 ease-[var(--ease-out)] hover:rotate-[360deg]" strokeWidth={4.2} />
        </TransitionLink>

        <div className="pointer-events-auto flex items-center gap-3">
          <div data-h className="hidden sm:block">
            <ResumeButton />
          </div>
          <div data-h>
            <Magnetic>
              <button
                type="button"
                onClick={() => appState.set({ menuOpen: !open })}
                aria-expanded={open}
                aria-controls="site-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                className="group relative flex h-11 w-11 items-center justify-center rounded-[12px] border border-current/40 transition-colors duration-300 hover:border-current"
              >
                <span
                  className={`absolute h-[1.5px] w-[18px] bg-current transition-transform duration-500 ease-[var(--ease-out)] ${open ? "rotate-45" : "-translate-y-[4px] translate-x-[3px] scale-x-[0.55] group-hover:translate-x-0 group-hover:scale-x-100"}`}
                />
                <span
                  className={`absolute h-[1.5px] w-[18px] bg-current transition-transform duration-500 ease-[var(--ease-out)] ${open ? "-rotate-45" : "translate-y-[4px]"}`}
                />
              </button>
            </Magnetic>
          </div>
        </div>
      </header>
      <Menu />
    </>
  );
}
