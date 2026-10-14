"use client";

import { useRef, type ReactNode } from "react";

import butterfly1 from "@/assets/img/lens-butterfly-1.jpg";
import butterfly2 from "@/assets/img/lens-butterfly-2.jpg";
import butterfly3 from "@/assets/img/lens-butterfly-3.jpg";
import field from "@/assets/img/lens-field.jpg";
import macaw1 from "@/assets/img/lens-macaw-1.jpg";
import macaw2 from "@/assets/img/lens-macaw-2.jpg";
import macaw3 from "@/assets/img/lens-macaw-3.jpg";
import { Aperture, AimTrainer, PianoKeys } from "@/components/hobbies";
import { LensFan, type LensShot } from "@/components/LensFan";
import { TopoCanvas } from "@/components/TopoCanvas";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

const SHOTS: LensShot[] = [
  { src: butterfly2, alt: "A blue butterfly resting on bright green leaves" },
  { src: macaw1, alt: "A blue-and-gold macaw preening its wing feathers" },
  { src: field, alt: "Sunset over a green field with a blue-roofed hut" },
  { src: macaw2, alt: "Close-up of a macaw's eye and spiky green-blue crest" },
  { src: butterfly1, alt: "A blue butterfly among pink and red ixora flowers" },
  { src: macaw3, alt: "A macaw's crest against a warm orange background" },
  { src: butterfly3, alt: "A blue butterfly taking off from a leaf, background in soft focus" },
];

const HOBBIES: { n: string; title: string; meta: string; body: string; visual: ReactNode }[] = [
  {
    n: "01",
    title: "Gamer",
    meta: "Valorant · PC",
    body: "Valorant on PC is how I switch off. Try the aim trainer: it keeps score.",
    visual: <AimTrainer />,
  },
  {
    n: "02",
    title: "Keys",
    meta: "Piano",
    body: "I play the piano. Click a key to turn the sound on, then hover or use your keyboard (A to ;) to play along.",
    visual: <PianoKeys />,
  },
  {
    n: "03",
    title: "Lens",
    meta: "Sony α6100",
    body: "Mostly wildlife and colour. Move across the lens to stop the aperture down.",
    visual: <Aperture />,
  },
];

export function OffScreen() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-sheet]",
        { clipPath: "inset(0% 5% 0% 5% round 64px 64px 0px 0px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 20%", scrub: true },
        },
      );
      const head = gsap.timeline({ scrollTrigger: { trigger: "[data-off-title]", start: "top 80%", once: true } });
      head
        .from("[data-off-title] [data-rise]", { yPercent: 110, duration: 1.2, stagger: 0.08 })
        .fromTo("[data-off-scrawl]", { clipPath: "inset(-20% 100% -20% 0%)" }, { clipPath: "inset(-20% 0% -20% 0%)", duration: 1.1, ease: "power2.inOut" }, 0.4);

      gsap.from("[data-hobby]", {
        y: 80,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 1.2,
        scrollTrigger: { trigger: "[data-hobbies]", start: "top 80%", once: true },
      });
      gsap.from("[data-lens-head] > *", {
        y: 40,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 1.1,
        scrollTrigger: { trigger: "[data-lens-head]", start: "top 85%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="off-screen" data-theme="light" className="relative z-10 bg-night">
      <div data-sheet className="relative overflow-hidden bg-cream pb-[14vh] pt-[16vh] text-ink">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <TopoCanvas className="h-full w-full" color={[0.055, 0.055, 0.07, 0.14]} density={5.5} seed={21.4} />
        </div>

        <div className="relative mx-auto max-w-[1600px] px-[var(--gutter)]">
          <div className="mb-[10vh] flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="label mb-6 text-ink/50">(05) — Off screen</p>
              <h2 data-off-title className="relative inline-block">
                <span className="block overflow-hidden">
                  <span data-rise className="serif-i block text-[clamp(64px,8vw,140px)] leading-[0.9]">
                    Off
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <span data-rise className="display block text-[clamp(72px,11vw,190px)]">
                    Screen
                  </span>
                </span>
                <span
                  data-off-scrawl
                  aria-hidden
                  className="script pointer-events-none absolute -right-[0.4em] top-[0.05em] -rotate-[10deg] text-[clamp(90px,10vw,180px)] text-blue"
                >
                  life
                </span>
              </h2>
            </div>
            <p className="max-w-[380px] text-[17px] leading-[1.5] text-ink/70 md:text-right">
              When the laptop closes: a few rounds of Valorant, the piano, or a camera pointed at something with feathers.
            </p>
          </div>

          <div data-hobbies className="grid gap-5 md:grid-cols-3 md:gap-6">
            {HOBBIES.map((h) => (
              <article key={h.n} data-hobby className="flex flex-col overflow-hidden rounded-[18px] border border-ink/10 bg-paper shadow-[0_30px_60px_-40px_rgba(14,14,17,0.5)]">
                <div className="relative aspect-[4/3] w-full overflow-hidden">{h.visual}</div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <div className="flex items-baseline justify-between">
                    <h3 className="display narrow text-[44px] leading-[0.85]">{h.title}</h3>
                    <span className="label text-ink/45">{h.n}</span>
                  </div>
                  <p className="label text-blue">{h.meta}</p>
                  <p className="text-[15px] leading-[1.5] text-ink/70">{h.body}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-[18vh]">
            <div data-lens-head className="mb-10 flex flex-col items-center gap-3 text-center">
              <span className="label text-ink/50">Shot on a Sony α6100</span>
              <h3 className="font-serif text-[clamp(44px,5.4vw,96px)] leading-[0.95] tracking-[-0.02em]">
                Through my <span className="italic text-blue">lens</span>
              </h3>
              <p className="max-w-[420px] text-[15px] leading-[1.5] text-ink/60">Drag the fan, or click the front frame to see it full size.</p>
            </div>
            <LensFan shots={SHOTS} />
          </div>
        </div>
      </div>
    </section>
  );
}
