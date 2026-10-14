# Kavin Krish — Portfolio

Personal site of **Kavin Krish Vijay**: machine learning & full-stack engineer, B.Tech CSE at SRM IST (2024–2028), Chennai.

**Live:** https://kavin-dev-portfolio.vercel.app

## What's inside

- **Loader**: KK monogram and counter, then the signature writes itself and flies past the camera as the curtain lifts.
- **Hero**: cut-out portrait over a live WebGL contour map that bends toward the cursor, a giant variable-width name, and a hand-traced signature that draws itself stroke by stroke.
- **Intro**: a statement that fills in word by word while photos drift past at different scroll speeds.
- **Selected work**: a pinned section where foil "trading cards" slide sideways, tilt in 3D and catch a holographic sheen. Each card has its own animated emblem.
- **Stack**: polaroid plates that swap with a motion blur as you scroll, plus a logo marquee that speeds up and reverses with the scroll.
- **Off screen**: a playable aim trainer (Valorant), a playable piano with a synthesised tone (mouse or keys A to ;), and a camera aperture that stops down as you move. Then a draggable fan of photos shot on a Sony α6100.
- **Timeline**: a sticky year counter with rolling digits.
- **Case studies** for six projects at `/work/[slug]`, with curtain page transitions.

## Stack

Next.js 16 (App Router, fully static) · TypeScript · Tailwind CSS 4 · GSAP 3 (ScrollTrigger, SplitText, DrawSVG, Draggable, Inertia) · Lenis · raw WebGL · `simple-icons`.

## Develop

```bash
pnpm install
pnpm dev
```

## Editing content

| What | Where |
|---|---|
| Name, role, links, status, résumé | `src/data/site.ts` |
| Projects and case studies | `src/data/projects.ts` |
| Tech stack | `src/data/stack.ts` |
| Timeline | `src/data/timeline.ts` |
| Photos | `src/assets/img/` |

To add the résumé, put the PDF at `public/resume.pdf` and set `resume: "/resume.pdf"` in `src/data/site.ts`. The button switches from "coming soon" to a download.
