"use client";

import { useRef, useState } from "react";

import { LocalTime } from "@/components/LocalTime";
import { Magnetic } from "@/components/Magnetic";
import { Marquee } from "@/components/Marquee";
import { Monogram } from "@/components/Monogram";
import { TransitionLink } from "@/components/providers/PageTransition";
import { getLenis } from "@/components/providers/SmoothScroll";
import { ResumeButton } from "@/components/ResumeButton";
import { Signature } from "@/components/Signature";
import { TopoCanvas } from "@/components/TopoCanvas";
import { site } from "@/data/site";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

const BAND = ["Machine learning", "Full-stack", "Computer vision", "Mobile", "Open to internships · 2027"];

export function Footer() {
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useGSAP(
    () => {
      const split = new SplitText("[data-signoff-line]", { type: "chars", charsClass: "inline-block" });
      gsap.from(split.chars, {
        yPercent: 110,
        duration: 1.2,
        stagger: 0.025,
        ease: "expo",
        scrollTrigger: { trigger: "[data-signoff]", start: "top 80%", once: true },
      });
      gsap.from("[data-foot-fade]", {
        y: 24,
        autoAlpha: 0,
        stagger: 0.06,
        duration: 1,
        scrollTrigger: { trigger: "[data-signoff]", start: "top 70%", once: true },
      });
      return () => split.revert();
    },
    { scope: root },
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  return (
    <footer ref={root} id="contact" data-theme="dark" className="relative overflow-hidden bg-night pt-6 text-cream">
      {/* oversized band */}
      <div className="border-y border-cream/10 py-5">
        <Marquee speed={60}>
          {BAND.map((w) => (
            <span key={w} className="flex items-center">
              <span className="display narrow px-8 text-[clamp(44px,6vw,96px)] text-cream/90">{w}</span>
              <Monogram className="h-8 w-8 text-blue-soft" strokeWidth={5} />
            </span>
          ))}
        </Marquee>
      </div>

      <div className="px-[var(--gutter)] pb-[var(--gutter)] pt-24">
        <div className="relative rounded-[clamp(20px,2.4vw,36px)] bg-night-2">
          {/* the notch */}
          <svg className="absolute -top-[39px] left-1/2 h-10 w-[300px] -translate-x-1/2" viewBox="0 0 300 40" aria-hidden>
            <path d="M0 40 C 48 40 56 0 104 0 L 196 0 C 244 0 252 40 300 40 Z" fill="var(--night-2)" />
          </svg>
          <div className="absolute -top-[22px] left-1/2 -translate-x-1/2">
            <Monogram className="h-8 w-8 text-cream" strokeWidth={4.6} />
          </div>

          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] opacity-50">
            <TopoCanvas className="h-full w-full" color={[0.49, 0.53, 1, 0.22]} density={6} seed={42.2} />
          </div>

          <div data-signoff className="relative flex flex-col items-center px-[var(--gutter)] pb-14 pt-[clamp(70px,10vw,140px)] text-center">
            <div className="mb-4 w-[min(56vw,300px)] text-blue-soft">
              <Signature onScroll strokeWidth={6} duration={1.8} />
            </div>
            <h2 className="display wide text-[clamp(52px,10.5vw,190px)] leading-[0.84]">
              <span className="block overflow-hidden">
                <span data-signoff-line className="block">
                  Let&apos;s build
                </span>
              </span>
              <span className="block overflow-hidden">
                <span data-signoff-line className="serif-i block text-blue-soft [font-variation-settings:normal]">
                  something
                </span>
              </span>
              <span className="block overflow-hidden">
                <span data-signoff-line className="block">
                  real.
                </span>
              </span>
            </h2>

            <div data-foot-fade className="mt-12 flex flex-col items-center gap-5">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={`mailto:${site.email}`}
                  className="font-serif text-[clamp(22px,2.6vw,40px)] italic underline decoration-cream/25 decoration-1 underline-offset-[10px] transition-colors hover:text-blue-soft hover:decoration-blue-soft"
                >
                  {site.email}
                </a>
                <Magnetic>
                  <button
                    type="button"
                    onClick={copy}
                    className="label rounded-full border border-cream/25 px-4 py-2 transition-colors hover:border-cream hover:bg-cream hover:text-ink"
                    aria-live="polite"
                  >
                    {copied ? "Copied ✓" : "Copy"}
                  </button>
                </Magnetic>
              </div>
              <div className="flex items-center gap-3">
                <ResumeButton />
                <span className="inline-flex items-center gap-2.5 rounded-full border border-cream/15 px-4 py-[13px]">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-soft opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-soft" />
                  </span>
                  <span className="label text-cream/75">{site.status}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="relative grid gap-10 border-t border-cream/10 px-[clamp(20px,3vw,48px)] py-10 md:grid-cols-3">
            <nav data-foot-fade aria-label="Footer">
              <p className="label mb-4 text-cream/40">Pages</p>
              <ul className="flex flex-col gap-1.5">
                {site.nav.map((n) => (
                  <li key={n.href}>
                    <TransitionLink href={n.href} className="display text-[26px] leading-[1.05] transition-colors hover:text-blue-soft">
                      {n.label}
                    </TransitionLink>
                  </li>
                ))}
              </ul>
            </nav>
            <div data-foot-fade className="flex flex-col gap-2 md:items-center md:text-center">
              <p className="label mb-2 text-cream/40">Based in</p>
              <p className="font-serif text-[30px] italic leading-none">
                {site.city}, {site.country}
              </p>
              <p className="label text-cream/55">
                Local time <LocalTime />
              </p>
            </div>
            <div data-foot-fade className="md:text-right">
              <p className="label mb-4 text-cream/40">Elsewhere</p>
              <ul className="flex flex-col gap-1.5 md:items-end">
                {site.socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target={s.href.startsWith("mailto") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className="display text-[26px] leading-[1.05] transition-colors hover:text-blue-soft"
                    >
                      {s.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 pt-6 md:flex-row">
          <span className="label text-cream/40">© 2026 {site.fullName}</span>
          <span className="label text-cream/40">Built with Next.js, GSAP & Lenis</span>
          <button
            type="button"
            onClick={() => getLenis()?.scrollTo(0, { duration: 2.2 })}
            className="label text-cream/60 transition-colors hover:text-blue-soft"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
