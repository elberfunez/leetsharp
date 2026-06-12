import { useEffect, useRef, useState } from "react";
import { highlightCSharp } from "../lib/highlighter";

interface Props {
  code: string;
  activeLines: number[];
}

/** Syntax-highlighted C# source with the current step's lines spotlighted. */
export function CodePanel({ code, activeLines }: Props) {
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
      el.classList.toggle("line-active", activeLines.includes(lineNumber));
    });
    const first = container.querySelector(".line-active");
    first?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeLines, html]);

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
