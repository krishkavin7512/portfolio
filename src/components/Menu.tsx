"use client";

import { useEffect, useRef } from "react";

import { TransitionLink } from "@/components/providers/PageTransition";
import { getLenis } from "@/components/providers/SmoothScroll";
import { site } from "@/data/site";
import { appState, useAppState } from "@/lib/app-state";
import { gsap } from "@/lib/gsap";
import { LocalTime } from "./LocalTime";

const curve = (edge: number, bulge: number) => `M0 0 L100 0 L100 ${edge} Q50 ${bulge} 0 ${edge} Z`;

export function Menu() {
  const open = useAppState((s) => s.menuOpen);
  const root = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const el = root.current!;
    const state = { edge: 0, bulge: 0 };
    const draw = () => path.current?.setAttribute("d", curve(state.edge, state.bulge));
    const links = el.querySelectorAll("[data-m-link]");
    const fades = el.querySelectorAll("[data-m-fade]");

    tl.current = gsap
      .timeline({ paused: true })
      .set(el, { visibility: "visible" })
      .fromTo(
        state,
        { edge: 0, bulge: 0 },
        {
          edge: 100,
          bulge: 100,
          duration: 0.9,
          ease: "inOut",
          onUpdate: () => {
            const b = state.edge + 26 * Math.sin((Math.PI * state.edge) / 100);
            path.current?.setAttribute("d", curve(state.edge, b));
          },
        },
      )
      .fromTo(links, { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.06 }, 0.35)
      .fromTo(fades, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.05 }, 0.5);
    draw();
    return () => {
      tl.current?.kill();
    };
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (open) {
      html.classList.add("menu-open");
      getLenis()?.stop();
      tl.current?.timeScale(1).play();
    } else {
      html.classList.remove("menu-open");
      getLenis()?.start();
      tl.current?.timeScale(1.6).reverse();
    }
  }, [open]);

  return (
    <div
      ref={root}
      id="site-menu"
      className="invisible fixed inset-0 z-[55] text-cream"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!open}
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <path ref={path} fill="var(--night)" />
      </svg>

      <div className="relative flex h-full flex-col justify-between px-[var(--gutter)] pb-[var(--gutter)] pt-[calc(var(--header-h)+6vh)] md:flex-row md:items-end">
        <nav aria-label="Primary">
          <ul className="flex flex-col">
            {site.nav.map((item, i) => (
              <li key={item.href} className="overflow-hidden">
                <TransitionLink
                  href={item.href}
                  data-m-link
                  tabIndex={open ? 0 : -1}
                  onClick={() => appState.set({ menuOpen: false })}
                  className="group flex items-center gap-4 py-1"
                >
                  <span className="label w-8 text-cream/40">0{i + 1}</span>
                  <span className="display text-[clamp(48px,9.5vw,148px)] transition-[font-variation-settings,color] duration-500 ease-[var(--ease-out)] [font-variation-settings:'wdth'_100] group-hover:text-blue-soft group-hover:[font-variation-settings:'wdth'_125]">
                    {item.label}
                  </span>
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-8 md:max-w-[340px] md:items-end md:text-right">
          <div data-m-fade className="flex flex-col gap-2 md:items-end">
            <span className="label text-cream/45">Say hello</span>
            <a href={`mailto:${site.email}`} tabIndex={open ? 0 : -1} className="font-serif text-[clamp(22px,2.2vw,30px)] italic hover:text-blue-soft">
              {site.email}
            </a>
          </div>
          <div data-m-fade className="flex gap-5">
            {site.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                tabIndex={open ? 0 : -1}
                className="label text-cream/70 transition-colors hover:text-blue-soft"
              >
                {s.label}
              </a>
            ))}
          </div>
          <div data-m-fade className="flex items-center gap-3 md:justify-end">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-soft opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-soft" />
            </span>
            <span className="label text-cream/70">{site.status}</span>
          </div>
          <div data-m-fade className="label text-cream/40">
            {site.city}, IN · <LocalTime />
          </div>
        </div>
      </div>
    </div>
  );
}
