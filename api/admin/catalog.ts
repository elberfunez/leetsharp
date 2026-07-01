import { eq } from "drizzle-orm";
import { db, catalogEntries } from "../../db";
import { withErrors } from "../_lib/http";
import { requireAdmin, HttpError } from "../_lib/auth";

/**
 * POST /api/admin/catalog — admin-only. Body: { id, action: "approve" | "reject", ...metadata }
 * Approve: flips to "approved" (visible on /unsolved) and optionally fills in title/number/
 *   category/difficulty from the request body.
 * Reject: deletes the entry (rejections are low-stakes, no need to retain).
 */
export default withErrors(async (req, res) => {
  await requireAdmin(req);
  if (req.method !== "POST") throw new HttpError(405, "Method not allowed");

  const { id, action, title, number, category, difficulty } = (req.body ?? {}) as Record<string, unknown>;
  if (!id || (action !== "approve" && action !== "reject")) {
    throw new HttpError(400, "id and action ('approve' | 'reject') are required");
  }

  if (action === "approve") {
    const updates: Record<string, unknown> = { status: "approved", updatedAt: new Date() };
    if (title) updates.title = String(title).trim();
    if (number) updates.number = Number(number);
    if (category) updates.category = String(category);
    if (difficulty && ["Easy", "Medium", "Hard"].includes(String(difficulty))) {
      updates.difficulty = String(difficulty);
    }
    const [entry] = await db
      .update(catalogEntries)
      .set(updates)
      .where(eq(catalogEntries.id, Number(id)))
      .returning();
    if (!entry) throw new HttpError(404, "Catalog entry not found");
    res.status(200).json({ entry });
    return;
  }

  const [deleted] = await db.delete(catalogEntries).where(eq(catalogEntries.id, Number(id))).returning();
  if (!deleted) throw new HttpError(404, "Catalog entry not found");
  res.status(200).json({ deleted: deleted.id });
});
