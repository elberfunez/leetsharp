import { useEffect, useRef, useState } from "react";
import { highlightCSharp } from "../lib/highlighter";

interface Props {
  code: string;
  activeLines: number[];
  stepIndex: number;
}

/** Syntax-highlighted C# source with the current step's lines spotlighted. */
export function CodePanel({ code, activeLines, stepIndex }: Props) {
  const [html, setHtml] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    highlightCSharp(code).then((result) => {
      if (!cancelled) setHtml(result);
    });
    return () => {
      cancelled = true;
    };
  }, [code]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !html) return;
    const lines = container.querySelectorAll<HTMLElement>(".line");
    lines.forEach((el) => {
      const lineNumber = Number(el.dataset.line);
      const isActive = activeLines.includes(lineNumber);
      el.classList.toggle("line-active", isActive);
      if (isActive) {
        // Force the pulse animation to restart even if this line was already active.
        el.classList.remove("line-pulse");
        void el.offsetWidth; // reflow
        el.classList.add("line-pulse");
      } else {
        el.classList.remove("line-pulse");
      }
    });
    const first = container.querySelector(".line-active");
    first?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex, html]);

  return (
    <div className="code-panel" ref={containerRef}>
      {html ? (
        <div dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <div className="code-loading">Loading…</div>
      )}
    </div>
  );
}
