import { useEffect, useState } from "react";

/** Tracks the phone breakpoint (≤600px) reactively. Shared so the home page
 *  (list-only / no roadmap) and the code panel (compact rendering) agree on
 *  what "mobile" means. */
export function useIsMobile(maxWidth = 600): boolean {
  const query = `(max-width: ${maxWidth}px)`;
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return isMobile;
}
