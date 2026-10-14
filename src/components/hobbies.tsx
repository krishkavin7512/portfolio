"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as RPointerEvent } from "react";

import { gsap, prefersReducedMotion } from "@/lib/gsap";

/* ───────────────────────── aim trainer (Valorant) ───────────────────────── */

type Target = { id: number; x: number; y: number; born: number };

export function AimTrainer() {
  const box = useRef<HTMLDivElement>(null);
  const cross = useRef<HTMLDivElement>(null);
  const [target, setTarget] = useState<Target | null>(null);
  const [hits, setHits] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [armed, setArmed] = useState(false);
  const idRef = useRef(0);

  const spawn = useCallback(() => {
    idRef.current += 1;
    setTarget({ id: idRef.current, x: 12 + Math.random() * 76, y: 16 + Math.random() * 62, born: performance.now() });
  }, []);

  const start = () => {
    setArmed(true);
    setHits(0);
    setTimes([]);
    spawn();
  };

  const hit = (e: RPointerEvent) => {
    e.stopPropagation();
    if (!target) return;
    const t = performance.now() - target.born;
    setHits((h) => h + 1);
    setTimes((ts) => [...ts.slice(-9), t]);
    const burst = document.createElement("span");
    burst.className = "pointer-events-none absolute h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#ff4655]";
    burst.style.left = `${target.x}%`;
    burst.style.top = `${target.y}%`;
    box.current?.appendChild(burst);
    gsap.fromTo(burst, { scale: 0.3, opacity: 1 }, { scale: 1.6, opacity: 0, duration: 0.5, ease: "power2.out", onComplete: () => burst.remove() });
    spawn();
  };

  useEffect(() => {
    const el = box.current;
    const c = cross.current;
    if (!el || !c) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      gsap.set(c, { x: e.clientX - r.left, y: e.clientY - r.top, autoAlpha: 1 });
    };
    const leave = () => gsap.set(c, { autoAlpha: 0 });
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  const avg = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : null;

  return (
    <div
      ref={box}
      data-cursor="hide"
      onPointerDown={() => !armed && start()}
      className="relative h-full w-full touch-manipulation select-none overflow-hidden bg-[#0f1923]"
      style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
    >
      {!armed && (
        <button type="button" onClick={start} className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[#ece8e1]">
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#ff4655]">Aim trainer</span>
          <span className="display narrow text-[44px]">Click to start</span>
        </button>
      )}
      {armed && target && (
        <button
          key={target.id}
          type="button"
          aria-label="Target"
          onPointerDown={hit}
          className="absolute h-11 w-11 -translate-x-1/2 -translate-y-1/2 animate-[target-in_0.25s_var(--ease-out)] rounded-full"
          style={{ left: `${target.x}%`, top: `${target.y}%` }}
        >
          <span className="absolute inset-0 rounded-full border-2 border-[#ff4655]" />
          <span className="absolute inset-[9px] rounded-full bg-[#ff4655]" />
          <span className="absolute inset-[17px] rounded-full bg-[#ece8e1]" />
        </button>
      )}
      <div className="pointer-events-none absolute inset-x-3 bottom-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-[#ece8e1]/70">
        <span>Hits {String(hits).padStart(2, "0")}</span>
        <span>{avg ? `Avg ${avg} ms` : "Valorant · PC"}</span>
      </div>
      <div ref={cross} className="pointer-events-none invisible absolute left-0 top-0" aria-hidden>
        <span className="absolute -left-[9px] top-[-1px] h-[2px] w-[6px] bg-[#00ffb3]" />
        <span className="absolute left-[3px] top-[-1px] h-[2px] w-[6px] bg-[#00ffb3]" />
        <span className="absolute -top-[9px] left-[-1px] h-[6px] w-[2px] bg-[#00ffb3]" />
        <span className="absolute left-[-1px] top-[3px] h-[6px] w-[2px] bg-[#00ffb3]" />
      </div>
    </div>
  );
}

/* ───────────────────────── piano ───────────────────────── */

const WHITES = ["C", "D", "E", "F", "G", "A", "B"];
const HAS_SHARP = new Set(["C", "D", "F", "G", "A"]);
// Für Elise, the opening phrase everyone tries first
const MOTIF = ["E5", "D#5", "E5", "D#5", "E5", "B4", "D5", "C5", "A4"];

export function PianoKeys() {
  const root = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState<string | null>(null);
  const [label, setLabel] = useState("Hover the keys");
  const hovering = useRef(false);

  const keys: { note: string; black: boolean; left: number }[] = [];
  let w = 0;
  for (const octave of [4, 5]) {
    for (const n of WHITES) {
      keys.push({ note: `${n}${octave}`, black: false, left: w });
      if (HAS_SHARP.has(n)) keys.push({ note: `${n}#${octave}`, black: true, left: w + 1 });
      w += 1;
    }
  }
  const whiteCount = w;

  const press = (note: string) => {
    setLit(note);
    setLabel(note.replace("#", "♯"));
    const el = root.current?.querySelector<HTMLElement>(`[data-note="${note}"] [data-bar]`);
    if (el) gsap.fromTo(el, { scaleY: 1, opacity: 1 }, { scaleY: 0, opacity: 0.2, duration: 1.4, ease: "power2.out" });
  };

  // play the motif visually while nobody is touching the keys
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let i = 0;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    if (root.current) io.observe(root.current);
    const id = setInterval(() => {
      if (!visible || hovering.current) return;
      if (i < MOTIF.length) press(MOTIF[i]);
      else if (i === MOTIF.length) {
        setLit(null);
        setLabel("Für Elise · bar 1");
      }
      i = (i + 1) % (MOTIF.length + 6);
    }, 300);
    return () => {
      clearInterval(id);
      io.disconnect();
    };
  }, []);

  return (
    <div
      ref={root}
      className="relative flex h-full w-full flex-col justify-end bg-[#14110f] px-4 pb-4 pt-12"
      onPointerEnter={() => (hovering.current = true)}
      onPointerLeave={() => {
        hovering.current = false;
        setLit(null);
      }}
    >
      <span className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.18em] text-cream/60">{label}</span>
      <div className="relative h-[62%] w-full" role="group" aria-label="Piano keys">
        {keys.map((k) => {
          const on = lit === k.note;
          const width = 100 / whiteCount;
          return (
            <div
              key={k.note}
              data-note={k.note}
              onPointerEnter={() => press(k.note)}
              className={`absolute top-0 rounded-b-[5px] transition-[transform,background-color] duration-150 ${
                k.black
                  ? `z-10 h-[60%] ${on ? "translate-y-[2px] bg-blue" : "bg-[#0b0b0d]"} shadow-[0_4px_8px_rgba(0,0,0,0.5)]`
                  : `h-full border-x border-black/20 ${on ? "translate-y-[3px] bg-[#c9ceff]" : "bg-[#f3efe7]"}`
              }`}
              style={{
                left: k.black ? `calc(${k.left * width}% - ${width * 0.3}%)` : `${k.left * width}%`,
                width: k.black ? `${width * 0.6}%` : `${width}%`,
              }}
            >
              <span data-bar className="pointer-events-none absolute bottom-full left-1/2 mb-1 block h-16 w-[3px] origin-bottom -translate-x-1/2 scale-y-0 rounded-full bg-blue-soft" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ───────────────────────── aperture (Sony α6100) ───────────────────────── */

const STOPS = [1.8, 2.8, 4, 5.6, 8, 11, 16];

function irisPaths(r: number, rot: number, R = 92, n = 7) {
  const V = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + rot;
    return [Math.cos(a) * r, Math.sin(a) * r] as [number, number];
  });
  // where the extension of edge i (beyond its far vertex) meets the outer circle
  const Q = V.map((v, i) => {
    const w = V[(i + 1) % n];
    const dx = w[0] - v[0];
    const dy = w[1] - v[1];
    const len = Math.hypot(dx, dy);
    const ux = dx / len;
    const uy = dy / len;
    const b = w[0] * ux + w[1] * uy;
    const c = w[0] * w[0] + w[1] * w[1] - R * R;
    const t = -b + Math.sqrt(b * b - c);
    return [w[0] + ux * t, w[1] + uy * t] as [number, number];
  });
  const f = (p: [number, number]) => `${(p[0] + 100).toFixed(2)} ${(p[1] + 100).toFixed(2)}`;
  return V.map((v, i) => {
    const w = V[(i + 1) % n];
    const qi = Q[i];
    const qPrev = Q[(i - 1 + n) % n];
    return `M${f(v)} L${f(w)} L${f(qi)} A${R} ${R} 0 0 0 ${f(qPrev)} Z`;
  });
}

export function Aperture() {
  const svg = useRef<SVGSVGElement>(null);
  const state = useRef({ open: 0.75 });
  const [stop, setStop] = useState(2.8);

  const render = useCallback(() => {
    const o = state.current.open;
    const r = 14 + o * 60;
    const paths = irisPaths(r, (1 - o) * 0.9);
    svg.current?.querySelectorAll<SVGPathElement>("[data-blade]").forEach((p, i) => p.setAttribute("d", paths[i]));
    const idx = Math.round((1 - o) * (STOPS.length - 1));
    setStop(STOPS[idx]);
  }, []);

  useEffect(() => {
    render();
    if (prefersReducedMotion()) return;
    const breathe = gsap.to(state.current, { open: 0.15, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1, onUpdate: render });
    return () => {
      breathe.kill();
    };
  }, [render]);

  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const o = 1 - (e.clientY - r.top) / r.height;
    gsap.killTweensOf(state.current);
    gsap.to(state.current, { open: gsap.utils.clamp(0, 1, o * 1.2 - 0.1), duration: 0.5, ease: "power3", onUpdate: render });
  };

  const onLeave = () => {
    if (prefersReducedMotion()) return;
    gsap.killTweensOf(state.current);
    gsap.to(state.current, { open: 0.15, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1, onUpdate: render });
  };

  const shutter = Math.round(4000 / (stop * stop));

  return (
    <div onPointerMove={onMove} onPointerLeave={onLeave} className="relative flex h-full w-full items-center justify-center bg-[#101114]">
      <svg ref={svg} viewBox="0 0 200 200" className="h-[78%] w-auto" aria-hidden>
        <circle cx="100" cy="100" r="99" fill="#1c1e24" />
        <circle cx="100" cy="100" r="95" fill="none" stroke="#3a3d47" strokeWidth="2" />
        <circle cx="100" cy="100" r="92" fill="url(#lensglass)" />
        <defs>
          <radialGradient id="lensglass" cx="40%" cy="35%" r="70%">
            <stop offset="0" stopColor="#5b6bff" stopOpacity="0.55" />
            <stop offset="0.5" stopColor="#1b25b5" stopOpacity="0.35" />
            <stop offset="1" stopColor="#07080c" />
          </radialGradient>
        </defs>
        {Array.from({ length: 7 }).map((_, i) => (
          <path key={i} data-blade fill={i % 2 ? "#23262e" : "#2a2d36"} stroke="#0a0b0e" strokeWidth="0.8" />
        ))}
        <circle cx="100" cy="100" r="92" fill="none" stroke="#0a0b0e" strokeWidth="2" />
      </svg>
      <div className="pointer-events-none absolute inset-x-3 bottom-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-cream/70">
        <span>f/{stop}</span>
        <span>1/{shutter}s · ISO 100</span>
      </div>
      <span className="pointer-events-none absolute left-3 top-3 font-mono text-[10px] uppercase tracking-[0.18em] text-cream/50">Move to stop down</span>
    </div>
  );
}
