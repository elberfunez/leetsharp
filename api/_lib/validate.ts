/** Server-side validation of contributor input. Catalog proposals need only a
 *  valid LeetCode/NeetCode URL; the admin fills in the rest during review. */
import { HttpError } from "./auth";

export interface CatalogInput {
  leetcodeUrl: string;
}

const URL_RE = /^https?:\/\/(www\.)?(leetcode\.com|neetcode\.io)\/problems\/[a-z0-9-]+/i;

export function parseCatalogInput(body: unknown): CatalogInput {
  if (!body || typeof body !== "object") throw new HttpError(400, "Missing request body");
  const b = body as Record<string, unknown>;

  const leetcodeUrl = String(b.leetcodeUrl ?? "").trim();
  if (!URL_RE.test(leetcodeUrl)) {
    throw new HttpError(400, "Provide a valid LeetCode or NeetCode problem URL");
  }

  return { leetcodeUrl };
}
