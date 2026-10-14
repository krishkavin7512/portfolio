import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const monogram = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="#eeeae1" stroke-width="4.6"><path d="M10 56V8"/><path d="M10 37L34 8V56"/><path d="M19.6 25.4L29.5 56"/><path d="M34 37L58 8"/><path d="M43.6 25.4L57 56"/></svg>`,
)}`;

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#3346ff" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={monogram} alt="" width={112} height={112} />
      </div>
    ),
    size,
  );
}
