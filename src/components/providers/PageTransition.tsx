"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";

import { Monogram } from "@/components/Monogram";
import { appState } from "@/lib/app-state";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { getLenis } from "./SmoothScroll";

type Navigate = (href: string, label?: string) => void;

const TransitionContext = createContext<Navigate>(() => {});
export const useTransitionNavigate = () => useContext(TransitionContext);

function scrollToHash(hash: string, immediate = false) {
  const el = document.getElementById(hash.replace("#", ""));
  if (!el) return;
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(el, { offset: 0, immediate, duration: 1.6 });
  else el.scrollIntoView({ behavior: immediate ? "auto" : "smooth" });
}

const curve = (edge: number, bulge: number, top: boolean) =>
  top
    ? `M0 0 L100 0 L100 ${edge} Q50 ${bulge} 0 ${edge} Z`
    : `M0 100 L100 100 L100 ${edge} Q50 ${bulge} 0 ${edge} Z`;

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const overlay = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const label = useRef<HTMLDivElement>(null);
  const pending = useRef<{ hash?: string } | null>(null);
  const busy = useRef(false);

  const navigate = useCallback<Navigate>(
    (href, text) => {
      const url = new URL(href, window.location.href);
      const samePage = url.pathname === window.location.pathname;
      appState.set({ menuOpen: false });

      if (samePage) {
        if (url.hash) scrollToHash(url.hash);
        else getLenis()?.scrollTo(0, { duration: 1.6 });
        return;
      }
      if (busy.current) return;

      if (prefersReducedMotion() || !overlay.current || !path.current) {
        pending.current = { hash: url.hash };
        router.push(url.pathname + url.hash, { scroll: false });
        return;
      }

      busy.current = true;
      pending.current = { hash: url.hash };
      const p = path.current;
      const state = { edge: 100, bulge: 100 };
      if (label.current) label.current.querySelector("[data-label]")!.textContent = text ?? "";
      getLenis()?.stop();

      gsap
        .timeline()
        .set(overlay.current, { autoAlpha: 1 })
        .to(state, {
          edge: 0,
          bulge: 0,
          duration: 0.9,
          ease: "inOut",
          onUpdate: () => p.setAttribute("d", curve(state.edge, state.bulge - 18 * Math.sin(Math.PI * (1 - state.edge / 100)), false)),
        })
        .fromTo(
          label.current,
          { yPercent: 40, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.6 },
          "-=0.45",
        )
        .add(() => router.push(url.pathname + url.hash, { scroll: false }));
    },
    [router],
  );

  // reveal once the new route has rendered
  useEffect(() => {
    if (!busy.current || !overlay.current || !path.current) {
      if (pending.current?.hash) {
        const h = pending.current.hash;
        setTimeout(() => scrollToHash(h, true), 60);
      }
      pending.current = null;
      return;
    }
    const p = path.current;
    const lenis = getLenis();
    lenis?.scrollTo(0, { immediate: true, force: true });
    const hash = pending.current?.hash;
    const state = { edge: 100, bulge: 100 };

    const tl = gsap
      .timeline({ delay: 0.25 })
      .add(() => {
        if (hash) scrollToHash(hash, true);
        lenis?.start();
      })
      .to(label.current, { yPercent: -30, autoAlpha: 0, duration: 0.45, ease: "power2.in" })
      .to(
        state,
        {
          edge: 0,
          bulge: 0,
          duration: 0.95,
          ease: "inOut",
          onStart: () => p.setAttribute("d", curve(100, 100, true)),
          onUpdate: () => p.setAttribute("d", curve(state.edge, state.bulge + 18 * Math.sin(Math.PI * (state.edge / 100)), true)),
        },
        "-=0.2",
      )
      .set(overlay.current, { autoAlpha: 0 })
      .add(() => {
        busy.current = false;
        pending.current = null;
        p.setAttribute("d", curve(100, 100, false));
      });
    return () => {
      tl.kill();
    };
  }, [pathname]);

  return (
    <TransitionContext.Provider value={navigate}>
      {children}
      <div ref={overlay} className="pointer-events-none fixed inset-0 z-[80] invisible" aria-hidden>
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path ref={path} d={curve(100, 100, false)} fill="var(--night)" />
        </svg>
        <div ref={label} className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-cream">
          <Monogram className="h-12 w-12 text-blue-soft" />
          <div data-label className="display wide text-center text-[clamp(40px,8vw,130px)]" />
        </div>
      </div>
    </TransitionContext.Provider>
  );
}

type TransitionLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  label?: string;
  children: ReactNode;
};

export function TransitionLink({ href, label, onClick, children, ...rest }: TransitionLinkProps) {
  const navigate = useTransitionNavigate();
  const external = /^(https?:|mailto:|tel:)/.test(href);

  if (external) {
    const isMail = href.startsWith("mailto:");
    return (
      <a href={href} target={isMail ? undefined : "_blank"} rel={isMail ? undefined : "noopener noreferrer"} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    navigate(href, label);
  };

  return (
    <Link href={href} scroll={false} onClick={handle} {...rest}>
      {children}
    </Link>
  );
}
