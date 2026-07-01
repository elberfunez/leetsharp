/**
 * Shared shapes + validation for solution submissions. A contributor provides
 * the problem URL and their C# solution (plus an optional description); the
 * admin does the steps/animation/approach by hand during build-out. Kept tiny
 * on purpose — this is a hand-off, not an authoring tool.
 */

export type Difficulty = "Easy" | "Medium" | "Hard";

/** What a contributor edits/submits. */
export interface SubmissionDraft {
  id?: number;
  slug: string;
  leetcodeUrl: string;
  code: string;
  description: string;
}

export type SubmissionStatus =
  | "draft"
  | "pending"
  | "changes_requested"
  | "approved"
  | "rejected"
  | "published";

/** A persisted submission as returned by the API (timestamps are ISO strings).
 *  title/number/category/difficulty are optional metadata (from the catalog
 *  entry when solved from the board, else filled in by the admin). */
export interface SubmissionRecord extends SubmissionDraft {
  id: number;
  title: string | null;
  number: number | null;
  category: string | null;
  difficulty: Difficulty | null;
  status: SubmissionStatus;
  adminNote: string | null;
  publishedPrUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export function emptyDraft(seed: Partial<SubmissionDraft> = {}): SubmissionDraft {
  return { slug: "", leetcodeUrl: "", code: "", description: "", ...seed };
}

/** Extract the problem slug from a LeetCode or NeetCode problem URL. */
export function slugFromUrl(url: string): string {
  const m = url.match(/(?:leetcode\.com|neetcode\.io)\/problems\/([a-z0-9-]+)/i);
  return m ? m[1].toLowerCase() : "";
}

const URL_RE = /^https?:\/\/(www\.)?(leetcode\.com|neetcode\.io)\/problems\/[a-z0-9-]+/i;

/** For a draft save nothing is required; for submit, a valid URL + code. */
export function validateSubmission(
  d: Partial<SubmissionDraft>,
  opts: { forSubmit: boolean }
): string[] {
  if (!opts.forSubmit) return [];
  const errors: string[] = [];
  const url = d.leetcodeUrl?.trim() ?? "";
  if (!URL_RE.test(url)) errors.push("Provide a valid LeetCode or NeetCode problem URL");
  else if (!slugFromUrl(url)) errors.push("Couldn't read the problem slug from that URL");
  if (!d.code?.trim()) errors.push("Paste your C# solution");
  return errors;
}
