import { useCallback, useEffect, useState } from "react";

const KEY = "leetsharp-completed";

/** Tracks which problems the user has marked complete, persisted to localStorage. */
export function useCompleted() {
  const [done, setDone] = useState<Set<string>>(() => {
    try {
      return new Set<string>(JSON.parse(localStorage.getItem(KEY) || "[]"));
    } catch {
      return new Set<string>();
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify([...done]));
  }, [done]);

  const toggle = useCallback((slug: string) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }, []);

  return { done, toggle };
}
