"use client";

import { useLayoutEffect, useRef } from "react";

/**
 * A single line of display type scaled so it exactly fills its container's width,
 * so giant background words never end in a cut-off letter.
 */
export function FitWord({ text, className = "", fill = 1 }: { text: string; className?: string; fill?: number }) {
  const box = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const b = box.current;
    const w = word.current;
    if (!b || !w) return;
    const fit = () => {
      w.style.fontSize = "100px";
      const measured = w.getBoundingClientRect().width;
      if (!measured) return;
      w.style.fontSize = `${(100 * b.clientWidth * fill) / measured}px`;
    };
    fit();
    document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(b);
    return () => ro.disconnect();
  }, [fill, text]);

  return (
    <div ref={box} className="w-full text-center">
      <span ref={word} className={`inline-block whitespace-nowrap ${className}`}>
        {text}
      </span>
    </div>
  );
}
