import type { SVGProps } from "react";

/** KK monogram: the first K's arm runs straight into the second K's stem. */
export const MONOGRAM_PATHS = [
  "M10 56V8",
  "M10 37L34 8V56",
  "M19.6 25.4L29.5 56",
  "M34 37L58 8",
  "M43.6 25.4L57 56",
];

export function Monogram({ strokeWidth = 4.6, ...props }: SVGProps<SVGSVGElement> & { strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="miter" aria-hidden {...props}>
      {MONOGRAM_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
