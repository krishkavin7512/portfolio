"use client";

import Image from "next/image";
import { useRef } from "react";

import { Emblem } from "@/components/emblems";
import { Magnetic } from "@/components/Magnetic";
import { TransitionLink } from "@/components/providers/PageTransition";
import { TopoCanvas } from "@/components/TopoCanvas";
import { projects } from "@/data/projects";
import { whenLoaded } from "@/lib/app-state";
import { gsap, prefersReducedMotion, SplitText, useGSAP } from "@/lib/gsap";

function countable(value: string) {
  const m = value.match(/^([^\d]*)([\d,.]+)(.*)$/);
  if (!m) return null;
  const n = Number(m[2].replace(/,/g, ""));
  if (Number.isNaN(n)) return null;
  const decimals = m[2].includes(".") ? m[2].split(".")[1].length : 0;
  return { prefix: m[1], n, suffix: m[3], decimals, comma: m[2].includes(",") };
}

export function CaseStudy({ slug }: { slug: string }) {
  const root = useRef<HTMLDivElement>(null);
  const index = projects.findIndex((p) => p.slug === slug);
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];

  useGSAP(
    (_, contextSafe) => {
      if (prefersReducedMotion()) return;
      const split = new SplitText("[data-cs-title]", { type: "chars", charsClass: "inline-block" });
      gsap.set(split.chars, { yPercent: 110 });
      gsap.set("[data-cs-fade]", { autoAlpha: 0, y: 24 });
      gsap.set("[data-cs-visual]", { autoAlpha: 0, y: 80, scale: 0.94 });

      const unsub = whenLoaded(
        contextSafe!(() => {
          gsap
            .timeline({ delay: 0.35 })
            .to(split.chars, { yPercent: 0, duration: 1.2, stagger: 0.03 })
            .to("[data-cs-fade]", { autoAlpha: 1, y: 0, duration: 1, stagger: 0.06 }, 0.35)
            .to("[data-cs-visual]", { autoAlpha: 1, y: 0, scale: 1, duration: 1.5 }, 0.45);
        }),
      );

      gsap.to("[data-cs-visual-inner]", {
        yPercent: -10,
        ease: "none",
        scrollTrigger: { trigger: "[data-cs-visual]", start: "top bottom", end: "bottom top", scrub: true },
      });

      // count the stats up when they arrive
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const c = countable(el.dataset.count!);
        if (!c) return;
        const obj = { v: 0 };
        gsap.to(obj, {
          v: c.n,
          duration: 1.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          onUpdate: () => {
            const num = c.comma
              ? Math.round(obj.v).toLocaleString("en-US")
              : obj.v.toFixed(c.decimals);
            el.textContent = `${c.prefix}${num}${c.suffix}`;
          },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, { y: 50, autoAlpha: 0, duration: 1.1, scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>("[data-shot]").forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(12% 8% 12% 8% round 24px)" },
          { clipPath: "inset(0% 0% 0% 0% round 14px)", ease: "none", scrollTrigger: { trigger: el, start: "top 95%", end: "top 45%", scrub: true } },
        );
      });

      return () => {
        unsub();
        split.revert();
      };
    },
    { scope: root, dependencies: [slug] },
  );

  if (!project) return null;
  const cover = project.shots[0];

  return (
    <div ref={root}>
      {/* ── hero ── */}
      <section data-theme="dark" className="relative overflow-hidden bg-night pb-[10vh] pt-[calc(var(--header-h)+8vh)] text-cream">
        <div className="pointer-events-none absolute inset-0 opacity-50">
          <TopoCanvas className="h-full w-full" color={[0.49, 0.53, 1, 0.16]} density={6} seed={index * 9.7 + 3} />
        </div>
        <div className="relative mx-auto max-w-[1600px] px-[var(--gutter)]">
          <div data-cs-fade className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <TransitionLink href="/#work" label="Work" className="label text-cream/60 transition-colors hover:text-blue-soft">
              ← All work
            </TransitionLink>
            <span className="label text-cream/40">
              Case study {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </span>
            <span className="label text-blue-soft">{project.context}</span>
          </div>

          <h1 data-cs-title className="display narrow -mt-[0.16em] overflow-hidden pb-[0.05em] pt-[0.16em] text-[clamp(72px,15vw,280px)] leading-[0.8]">
            {project.name}
          </h1>
          <p data-cs-fade className="mt-6 max-w-[900px] font-serif text-[clamp(26px,3vw,48px)] italic leading-[1.05] text-cream/90">
            {project.tagline}
          </p>

          <dl data-cs-fade className="mt-14 grid grid-cols-2 gap-6 border-t border-cream/15 pt-6 md:grid-cols-5">
            <div className="flex flex-col gap-1.5">
              <dt className="label text-cream/40">Year</dt>
              <dd className="text-[15px]">{project.year}</dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <dt className="label text-cream/40">Role</dt>
              <dd className="text-[15px]">{project.role}</dd>
            </div>
            {project.team !== "—" && (
              <div className="flex flex-col gap-1.5">
                <dt className="label text-cream/40">Team</dt>
                <dd className="text-[15px]">{project.team}</dd>
              </div>
            )}
            <div className="col-span-2 flex flex-col gap-1.5">
              <dt className="label text-cream/40">Stack</dt>
              <dd className="flex flex-wrap gap-1.5">
                {project.stack.map((s) => (
                  <span key={s} className="label rounded-full border border-cream/20 px-2.5 py-1 text-[10px] text-cream/80">
                    {s}
                  </span>
                ))}
              </dd>
            </div>
          </dl>

          <div data-cs-fade className="mt-8 flex flex-wrap gap-3">
            {project.links.map((l, i) => (
              <Magnetic key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`label inline-flex h-11 items-center gap-2 rounded-full px-5 transition-colors ${
                    i === 0 ? "bg-blue text-white hover:bg-cream hover:text-ink" : "border border-cream/30 hover:bg-cream hover:text-ink"
                  }`}
                >
                  {l.label} ↗
                </a>
              </Magnetic>
            ))}
          </div>

          <div data-cs-visual className="mt-[10vh]">
            {cover ? (
              <div className="overflow-hidden rounded-[16px] border border-cream/10 bg-night-2 shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9)]">
                <div className="flex items-center gap-2 border-b border-cream/10 px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-cream/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-cream/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-cream/20" />
                  <span className="label ml-3 text-cream/40">{project.name}</span>
                </div>
                <div className="relative aspect-[16/10] overflow-hidden">
                  <div data-cs-visual-inner className="absolute inset-x-0 -top-[6%] h-[112%]">
                    <Image src={cover.src} alt={`${project.name}: ${cover.caption}`} fill priority placeholder="blur" sizes="(min-width: 1600px) 1560px, 96vw" quality={90} className="object-cover object-top" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative flex justify-center overflow-hidden rounded-[16px] border border-cream/10 bg-[radial-gradient(120%_90%_at_50%_0%,#1b2140_0%,#0b0d16_65%)] py-[8vh]">
                <div data-cs-visual-inner className="foil is-active w-[min(70vw,380px)]">
                  <div className="foil__inner flex aspect-square items-center justify-center p-8">
                    <Emblem kind={project.emblem} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── numbers ── */}
      <section data-theme="dark" className="border-y border-cream/10 bg-night text-cream">
        <div className="mx-auto grid max-w-[1600px] grid-cols-2 md:grid-cols-4">
          {project.stats.map((s, i) => (
            <div key={s.label} data-reveal className={`flex flex-col gap-3 px-[var(--gutter)] py-12 ${i ? "md:border-l md:border-cream/10" : ""} ${i % 2 ? "border-l border-cream/10 md:border-l" : ""}`}>
              <span data-count={s.value} className="display wide text-[clamp(40px,5vw,84px)] leading-none text-cream">
                {s.value}
              </span>
              <span className="label text-cream/50">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── story ── */}
      <section data-theme="light" className="bg-cream py-[16vh] text-ink">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-[14vh] px-[var(--gutter)]">
          <Block label="01 — The problem">
            <p data-reveal className="font-serif text-[clamp(28px,3.2vw,52px)] leading-[1.08] tracking-[-0.015em]">
              {project.summary}
            </p>
            {project.problem.map((p) => (
              <p key={p} data-reveal className="max-w-[760px] text-[18px] leading-[1.6] text-ink/75">
                {p}
              </p>
            ))}
          </Block>

          <Block label="02 — What it does">
            <div className="grid gap-4 sm:grid-cols-2">
              {project.features.map((f, i) => (
                <div key={f.title} data-reveal className="flex flex-col gap-3 rounded-[16px] border border-ink/10 bg-paper p-7">
                  <span className="label text-blue">0{i + 1}</span>
                  <h3 className="text-[22px] font-semibold tracking-[-0.015em]">{f.title}</h3>
                  <p className="text-[15.5px] leading-[1.55] text-ink/70">{f.body}</p>
                </div>
              ))}
            </div>
          </Block>

          <Block label="03 — How it works">
            <ol className="flex flex-col">
              {project.how.map((h, i) => (
                <li key={h} data-reveal className="grid grid-cols-[48px_1fr] gap-4 border-t border-ink/12 py-6">
                  <span className="display narrow text-[32px] leading-none text-blue">{i + 1}</span>
                  <p className="text-[17px] leading-[1.6] text-ink/80">{h}</p>
                </li>
              ))}
            </ol>
          </Block>

          {project.contribution && (
            <Block label="04 — My part">
              <ul className="flex flex-col gap-3">
                {project.contribution.map((c) => (
                  <li key={c} data-reveal className="flex gap-4 text-[18px] leading-[1.55]">
                    <span className="mt-[11px] h-2 w-2 shrink-0 rounded-full bg-blue" />
                    {c}
                  </li>
                ))}
              </ul>
            </Block>
          )}

          {project.results && (
            <Block label={project.contribution ? "05 — Results" : "04 — Results"}>
              <ul className="flex flex-col gap-3">
                {project.results.map((r) => (
                  <li key={r} data-reveal className="flex gap-4 text-[18px] leading-[1.55]">
                    <span className="mt-[11px] h-2 w-2 shrink-0 rounded-full bg-blue" />
                    {r}
                  </li>
                ))}
              </ul>
            </Block>
          )}

          {project.wideShot && (
            <figure data-reveal className="flex flex-col gap-3">
              <div data-shot className="overflow-hidden rounded-[14px] border border-ink/10 bg-white p-4">
                <Image src={project.wideShot.src} alt={project.wideShot.caption} placeholder="blur" sizes="96vw" quality={90} className="h-auto w-full" />
              </div>
              <figcaption className="label text-ink/50">{project.wideShot.caption}</figcaption>
            </figure>
          )}
        </div>
      </section>

      {/* ── gallery ── */}
      {project.shots.length > 1 && (
        <section data-theme="dark" className="bg-night py-[14vh] text-cream">
          <div className="mx-auto max-w-[1600px] px-[var(--gutter)]">
            <div className="mb-12 flex items-end justify-between">
              <h2 className="display narrow text-[clamp(56px,8vw,140px)] leading-[0.85]">
                In <span className="serif-i text-blue-soft [font-variation-settings:normal]">pictures</span>
              </h2>
              <span className="label text-cream/50">{project.shots.length - 1} screens</span>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {project.shots.slice(1).map((s, i) => (
                <figure key={s.caption} className={`flex flex-col gap-3 ${i % 3 === 2 ? "md:col-span-2" : ""}`}>
                  <div data-shot className="relative aspect-[16/10] overflow-hidden rounded-[14px] border border-cream/10 bg-night-2">
                    <Image src={s.src} alt={`${project.name}: ${s.caption}`} fill placeholder="blur" sizes={i % 3 === 2 ? "96vw" : "(min-width: 768px) 48vw, 96vw"} quality={85} className="object-cover object-top" />
                  </div>
                  <figcaption className="label text-cream/50">
                    {String(i + 2).padStart(2, "0")} · {s.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── next ── */}
      <section data-theme="dark" className="relative overflow-hidden border-t border-cream/10 bg-night text-cream">
        <TransitionLink href={`/work/${next.slug}`} label={next.name} data-cursor="view" data-cursor-label="Next" className="group relative block px-[var(--gutter)] py-[14vh]">
          <span aria-hidden className="absolute inset-0 origin-bottom scale-y-0 bg-blue transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-y-100" />
          <div className="relative mx-auto flex max-w-[1600px] flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div>
              <span className="label text-cream/60 group-hover:text-white/80">Next project</span>
              <p className="display narrow mt-4 text-[clamp(64px,12vw,220px)] leading-[0.8] transition-transform duration-700 ease-[var(--ease-out)] group-hover:translate-x-4">
                {next.name}
              </p>
              <p className="mt-5 max-w-[520px] text-[16px] text-cream/60 group-hover:text-white/85">{next.tagline}</p>
            </div>
            <div className="w-[160px] shrink-0 opacity-70 transition-[opacity,transform] duration-700 ease-[var(--ease-out)] group-hover:rotate-6 group-hover:scale-110 group-hover:opacity-100 md:w-[220px]">
              <Emblem kind={next.emblem} />
            </div>
          </div>
        </TransitionLink>
      </section>
    </div>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-8 md:grid-cols-12">
      <div className="md:col-span-3">
        <p className="label text-ink/50 md:sticky md:top-[calc(var(--header-h)+4vh)]">{label}</p>
      </div>
      <div className="flex flex-col gap-6 md:col-span-9">{children}</div>
    </div>
  );
}
