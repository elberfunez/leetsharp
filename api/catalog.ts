import { desc, eq } from "drizzle-orm";
import { db, catalogEntries } from "../db";
import { withErrors } from "./_lib/http";
import { requireUser, HttpError } from "./_lib/auth";
import { parseCatalogInput } from "./_lib/validate";

function slugFromUrl(url: string): string {
  const m = url.match(/(?:leetcode\.com|neetcode\.io)\/problems\/([a-z0-9-]+)/i);
  return m ? m[1].toLowerCase() : "";
}

/**
 * GET  /api/catalog — public; approved unsolved-problem entries for /unsolved.
 * POST /api/catalog — authenticated; propose a new entry with just the URL.
 *   The slug is derived from the URL. The admin fills in title/number/category/
 *   difficulty during review before approving.
 */
export default withErrors(async (req, res) => {
  if (req.method === "GET") {
    const rows = await db
      .select()
      .from(catalogEntries)
      .where(eq(catalogEntries.status, "approved"))
      .orderBy(desc(catalogEntries.createdAt));
    res.status(200).json({ entries: rows });
    return;
  }

  if (req.method === "POST") {
    const user = await requireUser(req);
    const input = parseCatalogInput(req.body);
    const slug = slugFromUrl(input.leetcodeUrl);
    if (!slug) throw new HttpError(400, "Couldn't extract a problem slug from that URL");

    const dup = await db
      .select({ id: catalogEntries.id })
      .from(catalogEntries)
      .where(eq(catalogEntries.slug, slug))
      .limit(1);
    if (dup.length) throw new HttpError(409, "That problem is already in the catalog");

    const [entry] = await db
      .insert(catalogEntries)
      .values({ slug, leetcodeUrl: input.leetcodeUrl, submittedBy: user.id, status: "pending" })
      .returning();
    res.status(201).json({ entry });
    return;
  }

  throw new HttpError(405, "Method not allowed");
});
