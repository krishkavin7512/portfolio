"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef } from "react";

import boat from "@/assets/img/boat-selfie.jpg";
import childhood from "@/assets/img/childhood.jpg";
import friends from "@/assets/img/friends.jpg";
import hackathon from "@/assets/img/hackathon.jpg";
import mirror from "@/assets/img/mirror.jpg";
import night from "@/assets/img/night-profile.jpg";
import { site } from "@/data/site";
import { gsap, prefersReducedMotion, SplitText, useGSAP } from "@/lib/gsap";

type Shot = {
  src: StaticImageData;
  alt: string;
  speed: number;
  className: string;
  rotate: number;
};

// positions keep the centre column clear for the statement
const SHOTS: Shot[] = [
  { src: childhood, alt: "Kavin as a kid, crouching on rocks by the sea", speed: 1.35, rotate: -3, className: "left-[4vw] top-[4%] w-[30vw] md:left-[5vw] md:w-[15vw]" },
  { src: night, alt: "Kavin at night, looking up and away from the camera", speed: 0.75, rotate: 2, className: "right-[4vw] top-[14%] w-[40vw] md:right-[5vw] md:w-[23vw]" },
  { src: friends, alt: "Kavin with six friends in suits, all striking a pose", speed: 1.15, rotate: -1.5, className: "left-[3vw] top-[44%] w-[44vw] md:left-[4vw] md:w-[24vw]" },
  { src: boat, alt: "Night selfie on a boat deck, in sunglasses", speed: 1.4, rotate: 2.5, className: "right-[3vw] top-[56%] w-[40vw] md:right-[3vw] md:w-[21vw]" },
  { src: mirror, alt: "Mirror selfie in a brown shirt and sunglasses", speed: 0.85, rotate: -2, className: "left-[5vw] top-[80%] w-[30vw] md:left-[8vw] md:top-[78%] md:w-[13vw]" },
  { src: hackathon, alt: "Kavin deep in code at a hackathon, mechanical keyboard plugged in", speed: 1.2, rotate: 3, className: "right-[5vw] top-[84%] w-[32vw] md:right-[9vw] md:top-[80%] md:w-[14vw]" },
];

const STATEMENT: { text: string; em?: boolean }[] = [
  { text: "I build" },
  { text: "intelligent software", em: true },
  { text: "end to end, from the model that makes the call to the interface that" },
  { text: "explains it.", em: true },
];

export function Intro() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const split = new SplitText("[data-statement]", { type: "words", wordsClass: "inline-block" });
      gsap.fromTo(
        split.words,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.12,
          scrollTrigger: { trigger: "[data-collage]", start: "top 55%", end: "55% center", scrub: true },
        },
      );

      gsap.utils.toArray<HTMLElement>("[data-shot]").forEach((el) => {
        const speed = Number(el.dataset.speed);
        const travel = (speed - 1) * 520;
        gsap.fromTo(
          el,
          { y: travel },
          {
            y: -travel,
            ease: "none",
            scrollTrigger: { trigger: "[data-collage]", start: "top bottom", end: "bottom top", scrub: true },
          },
        );
        const inner = el.querySelector("[data-shot-inner]");
        gsap.fromTo(
          inner,
          { clipPath: "inset(100% 0% 0% 0%)", scale: 1.25 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            duration: 1.4,
            ease: "expo",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          },
        );
      });

      gsap.from("[data-about] > *", {
        y: 40,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 1.2,
        scrollTrigger: { trigger: "[data-about]", start: "top 80%", once: true },
      });

      return () => split.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" data-theme="light" className="relative overflow-x-clip bg-cream text-ink">
      <div data-collage className="relative h-[230svh]">
        {SHOTS.map((s, i) => (
          <figure
            key={s.alt}
            data-shot
            data-speed={s.speed}
            className={`absolute z-10 ${s.className}`}
            style={{ rotate: `${s.rotate}deg` }}
          >
            <div data-shot-inner className="group relative overflow-hidden rounded-[6px] bg-ink/10 shadow-[0_30px_60px_-30px_rgba(14,14,17,0.45)]">
              <Image
                src={s.src}
                alt={s.alt}
                placeholder="blur"
                sizes="(min-width: 768px) 24vw, 44vw"
                quality={80}
                className="h-auto w-full grayscale-[0.7] sepia-[0.18] transition-[filter,transform] duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04] group-hover:grayscale-0 group-hover:sepia-0"
              />
            </div>
            <figcaption className="label mt-2 text-ink/40">0{i + 1}</figcaption>
          </figure>
        ))}

        <div className="sticky top-0 flex h-[100svh] items-center justify-center px-[var(--gutter)]">
          <div className="relative z-20 max-w-[min(1100px,90vw)] rounded-[22px] bg-cream/75 px-5 py-7 text-center backdrop-blur-md md:max-w-[41vw] md:rounded-none md:bg-transparent md:p-0 md:backdrop-blur-none">
            <p className="label mb-8 text-ink/50">(01) — About</p>
            <p
              data-statement
              className="font-serif text-[clamp(32px,3.9vw,72px)] leading-[1.02] tracking-[-0.02em] text-ink"
            >
              {STATEMENT.map((part, i) => (
                <span key={i} className={part.em ? "italic text-blue" : undefined}>
                  {part.text}{" "}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>

      <div
        data-about
        className="relative z-20 mx-auto grid max-w-[1400px] gap-10 px-[var(--gutter)] pb-[6vh] md:grid-cols-12 md:gap-6"
      >
        <p className="label text-ink/50 md:col-span-3">Who&apos;s behind this</p>
        <div className="flex flex-col gap-6 text-[clamp(19px,1.55vw,26px)] leading-[1.35] tracking-[-0.01em] md:col-span-6">
          {site.about.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 self-start md:col-span-3 md:grid-cols-1">
          {[
            ["Based in", `${site.city}, ${site.country}`],
            ["Studying", `B.Tech CSE · ${site.schoolShort}`],
            ["Class of", "2028"],
            ["Focus", "Applied ML · Full-stack · Mobile"],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col gap-1 border-t border-ink/15 pt-3">
              <dt className="label text-ink/45">{k}</dt>
              <dd className="text-[15px] font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
