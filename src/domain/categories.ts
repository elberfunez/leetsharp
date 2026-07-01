/**
 * The canonical NeetCode roadmap categories, in roadmap order. Single source of
 * truth shared by the frontend (problem grouping, the roadmap graph, the
 * "Propose a problem" dropdown) and the API (validating catalog submissions),
 * so a category is never a free-text typo.
 */
export const CATEGORIES = [
  "Arrays & Hashing",
  "Two Pointers",
  "Stack",
  "Binary Search",
  "Sliding Window",
  "Linked List",
  "Trees",
  "Tries",
  "Heap / Priority Queue",
  "Backtracking",
  "Graphs",
  "Advanced Graphs",
  "1-D Dynamic Programming",
  "2-D Dynamic Programming",
  "Greedy",
  "Intervals",
  "Math & Geometry",
  "Bit Manipulation",
] as const;

export type Category = (typeof CATEGORIES)[number];

export function isCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value);
}
