import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import { site } from "@/data/site";

export const alt = `${site.name}, ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const [mona, serif, mono, portrait] = await Promise.all([
  readFile(join(process.cwd(), "assets", "fonts", "MonaSans-WideExtraBold.ttf")),
  readFile(join(process.cwd(), "assets", "fonts", "InstrumentSerif-Italic.ttf")),
  readFile(join(process.cwd(), "assets", "fonts", "GeistMono-Medium.ttf")),
  readFile(join(process.cwd(), "assets", "og-portrait.png")),
]);
const portraitSrc = `data:image/png;base64,${portrait.toString("base64")}`;

const monogram = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="#0e0e11" stroke-width="4.6"><path d="M10 56V8"/><path d="M10 37L34 8V56"/><path d="M19.6 25.4L29.5 56"/><path d="M34 37L58 8"/><path d="M43.6 25.4L57 56"/></svg>`,
)}`;

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#eeeae1", position: "relative", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={portraitSrc} alt="" width={560} height={528} style={{ position: "absolute", right: -40, bottom: 0 }} />
        <div style={{ display: "flex", flexDirection: "column", padding: "56px 64px", height: "100%", justifyContent: "space-between" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={monogram} alt="" width={56} height={56} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "Mona", fontSize: 150, lineHeight: 0.82, letterSpacing: -5, color: "#0e0e11" }}>KAVIN</div>
            <div style={{ fontFamily: "Mona", fontSize: 150, lineHeight: 0.82, letterSpacing: -5, color: "#0e0e11" }}>KRISH</div>
            <div style={{ fontFamily: "Serif", fontSize: 40, color: "#3346ff", marginTop: 26 }}>Machine learning & full-stack engineer</div>
          </div>
          <div style={{ display: "flex", gap: 28, fontFamily: "Mono", fontSize: 18, letterSpacing: 3, color: "rgba(14,14,17,0.6)" }}>
            <span>SRM IST · CHENNAI</span>
            <span style={{ color: "#3346ff" }}>● OPEN TO INTERNSHIPS · 2027</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Mona", data: mona, style: "normal", weight: 800 },
        { name: "Serif", data: serif, style: "italic", weight: 400 },
        { name: "Mono", data: mono, style: "normal", weight: 500 },
      ],
    },
  );
}
