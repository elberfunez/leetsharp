import { problems } from "../problems";
import type { Author } from "../domain/types";

export interface Contributor {
  author: Author;
  count: number;
}

/**
 * Per-author published-problem counts, derived from the static `problems` data
 * at build time (no DB needed — published problems live in git). A problem
 * credits its `author` plus any per-solution authors; each is counted once.
 */
export function getContributors(): Contributor[] {
  const byHandle = new Map<string, Contributor>();
  for (const p of problems) {
    const authors = new Set<Author>([p.author, ...p.solutions.flatMap((s) => (s.author ? [s.author] : []))]);
    for (const author of authors) {
      const existing = byHandle.get(author.handle);
      if (existing) existing.count += 1;
      else byHandle.set(author.handle, { author, count: 1 });
    }
  }
  return [...byHandle.values()].sort((a, b) => b.count - a.count);
}
