/** Frontend-facing shapes for the contribution API responses. These mirror the
 *  Drizzle rows in `db/schema.ts` (timestamps arrive as ISO strings over JSON). */

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface CatalogEntry {
  id: number;
  number: number;
  title: string;
  slug: string;
  leetcodeUrl: string;
  category: string;
  difficulty: Difficulty;
  status: "pending" | "approved";
  submittedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Fields a contributor fills in to propose a new unsolved problem. */
export interface CatalogInput {
  number: number;
  title: string;
  slug: string;
  leetcodeUrl: string;
  category: string;
  difficulty: Difficulty;
}

/** title → kebab-case slug suggestion (LeetCode-style). */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
