"use client";

import Image, { type StaticImageData } from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { getLenis } from "@/components/providers/SmoothScroll";
import { Draggable, gsap, prefersReducedMotion } from "@/lib/gsap";

export type LensShot = { src: StaticImageData; alt: string };

const SPREAD = 9; // degrees between neighbouring cards

/** Photos fanned on an arc. Drag (or use the arrows) to turn the fan; click the front card to open it. */
export function LensFan({ shots }: { shots: LensShot[] }) {
  const stage = useRef<HTMLDivElement>(null);
  const proxy = useRef<HTMLDivElement>(null);
  const pos = useRef({ value: Math.floor(shots.length / 2) });
  const [current, setCurrent] = useState(Math.floor(shots.length / 2));
  const [open, setOpen] = useState<number | null>(null);

  const layout = useCallback(() => {
    const cards = stage.current?.querySelectorAll<HTMLElement>("[data-fan-card]");
    cards?.forEach((card, i) => {
      const off = i - pos.current.value;
      const abs = Math.abs(off);
      gsap.set(card, {
        rotate: off * SPREAD,
        scale: 1 - Math.min(abs, 4) * 0.045,
        zIndex: 100 - Math.round(abs * 10),
        filter: `brightness(${1 - Math.min(abs, 4) * 0.1})`,
      });
    });
  }, []);

  const goTo = useCallback(
    (i: number) => {
      const target = gsap.utils.clamp(0, shots.length - 1, i);
      setCurrent(target);
      gsap.to(pos.current, { value: target, duration: prefersReducedMotion() ? 0 : 0.9, ease: "expo", onUpdate: layout });
    },
    [layout, shots.length],
  );

  useEffect(() => {
    layout();
    if (!proxy.current || !stage.current) return;
    let startValue = 0;
    const [drag] = Draggable.create(proxy.current, {
      type: "x",
      trigger: stage.current,
      inertia: true,
      allowContextMenu: true,
      dragClickables: true,
      minimumMovement: 6,
      onClick(e: PointerEvent) {
        const card = (e.target as Element | null)?.closest<HTMLElement>("[data-fan-card]");
        if (!card) return;
        const i = Number(card.dataset.index);
        if (i === Math.round(pos.current.value)) setOpen(i);
        else goTo(i);
      },
      onPress() {
        startValue = pos.current.value;
        gsap.killTweensOf(pos.current);
      },
      onDrag() {
        pos.current.value = gsap.utils.clamp(-0.4, shots.length - 0.6, startValue - this.x / 160);
        layout();
      },
      onThrowUpdate() {
        pos.current.value = gsap.utils.clamp(-0.4, shots.length - 0.6, startValue - this.x / 160);
        layout();
      },
      onRelease() {
        // settle on the nearest card once the throw ends
        gsap.delayedCall(0.05, () => {
          if (!this.isThrowing) goTo(Math.round(pos.current.value));
        });
      },
      onThrowComplete() {
        goTo(Math.round(pos.current.value));
      },
      snap: { x: (v: number) => Math.round(v / 160) * 160 },
    });
    return () => {
      drag.kill();
    };
  }, [goTo, layout, shots.length]);

  // lightbox keys + scroll lock
  useEffect(() => {
    if (open === null) return;
    getLenis()?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((o) => (o === null ? o : (o + 1) % shots.length));
      if (e.key === "ArrowLeft") setOpen((o) => (o === null ? o : (o - 1 + shots.length) % shots.length));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      getLenis()?.start();
    };
  }, [open, shots.length]);

  return (
    <div className="relative">
      <div
        ref={stage}
        data-cursor="drag"
        className="relative mx-auto h-[min(92vw,600px)] w-full touch-pan-y select-none md:h-[600px]"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") goTo(current + 1);
          if (e.key === "ArrowLeft") goTo(current - 1);
        }}
      >
        {shots.map((s, i) => (
          <button
            key={s.alt}
            type="button"
            data-fan-card
            data-index={i}
            aria-label={i === current ? `Open photo: ${s.alt}` : `Show photo: ${s.alt}`}
            // pointer clicks are handled by Draggable; this covers Enter / Space
            onClick={(e) => e.detail === 0 && (i === current ? setOpen(i) : goTo(i))}
            className="absolute bottom-[28%] left-1/2 -ml-[min(19vw,150px)] w-[min(38vw,300px)] origin-[50%_220%] overflow-hidden rounded-[18px] bg-ink shadow-[0_30px_60px_-25px_rgba(14,14,17,0.55)] outline-offset-4 md:-ml-[150px] md:w-[300px]"
            style={{ aspectRatio: "3 / 4" }}
          >
            <Image src={s.src} alt={s.alt} placeholder="blur" fill sizes="300px" quality={80} className="pointer-events-none object-cover" draggable={false} />
          </button>
        ))}
        <div ref={proxy} className="invisible absolute" aria-hidden />
      </div>

      <div className="relative z-[120] mt-2 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => goTo(current - 1)}
          aria-label="Previous photo"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/25 transition-colors hover:bg-ink hover:text-cream disabled:opacity-30"
          disabled={current === 0}
        >
          ←
        </button>
        <span className="label w-20 text-center text-ink/60">
          {String(current + 1).padStart(2, "0")} / {String(shots.length).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={() => goTo(current + 1)}
          aria-label="Next photo"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/25 transition-colors hover:bg-ink hover:text-cream disabled:opacity-30"
          disabled={current === shots.length - 1}
        >
          →
        </button>
      </div>

      {open !== null && <Lightbox shots={shots} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />}
    </div>
  );
}

function Lightbox({ shots, index, onClose, onIndex }: { shots: LensShot[]; index: number; onClose: () => void; onIndex: (i: number) => void }) {
  const root = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(root.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 });
    root.current?.querySelector<HTMLButtonElement>("[data-close]")?.focus();
  }, []);

  useEffect(() => {
    gsap.fromTo(img.current, { autoAlpha: 0, scale: 0.96, filter: "blur(8px)" }, { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 0.6, ease: "expo" });
  }, [index]);

  const shot = shots[index];
  // portalled to <body>: the fan lives inside a clipped, stacked section that would trap a fixed overlay
  return createPortal(
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      className="fixed inset-0 z-[105] flex items-center justify-center bg-night/95 p-[var(--gutter)] text-cream backdrop-blur-sm"
      onClick={onClose}
    >
      <div ref={img} className="relative h-[82svh] w-[92vw]" onClick={(e) => e.stopPropagation()}>
        <Image key={index} src={shot.src} alt={shot.alt} fill sizes="92vw" quality={90} className="object-contain" />
      </div>
      <button data-close type="button" onClick={onClose} className="label absolute right-[var(--gutter)] top-[var(--gutter)] rounded-full border border-cream/30 px-4 py-2 hover:bg-cream hover:text-ink">
        Close ✕
      </button>
      <div className="absolute inset-x-0 bottom-[var(--gutter)] flex items-center justify-center gap-6" onClick={(e) => e.stopPropagation()}>
        <button type="button" aria-label="Previous photo" onClick={() => onIndex((index - 1 + shots.length) % shots.length)} className="label hover:text-blue-soft">
          ← Prev
        </button>
        <span className="label text-cream/50">
          {String(index + 1).padStart(2, "0")} / {String(shots.length).padStart(2, "0")} · Sony α6100
        </span>
        <button type="button" aria-label="Next photo" onClick={() => onIndex((index + 1) % shots.length)} className="label hover:text-blue-soft">
          Next →
        </button>
      </div>
    </div>,
    document.body,
  );
}
