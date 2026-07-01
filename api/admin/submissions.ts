import { eq } from "drizzle-orm";
import { db, submissions } from "../../db";
import { withErrors } from "../_lib/http";
import { requireAdmin, HttpError } from "../_lib/auth";

const ALLOWED = ["approved", "changes_requested", "rejected", "published"] as const;
type TargetStatus = (typeof ALLOWED)[number];

/**
 * POST /api/admin/submissions — admin-only. Move a submission through review.
 * Body: { id, status, note?, prUrl? }.
 *   approved           → accepted; the admin will build it out
 *   changes_requested  → back to the contributor with a note
 *   rejected           → declined with a note
 *   published          → built & live; prUrl links to the PR/commit
 */
export default withErrors(async (req, res) => {
  await requireAdmin(req);
  if (req.method !== "POST") throw new HttpError(405, "Method not allowed");

  const { id, status, note, prUrl } = (req.body ?? {}) as {
    id?: number;
    status?: string;
    note?: string;
    prUrl?: string;
  };
  if (!id || !status || !ALLOWED.includes(status as TargetStatus)) {
    throw new HttpError(400, `id and a valid status (${ALLOWED.join(", ")}) are required`);
  }

  const set: Record<string, unknown> = {
    status: status as TargetStatus,
    adminNote: note?.trim() || null,
    updatedAt: new Date(),
  };
  if (status === "published") set.publishedPrUrl = prUrl?.trim() || null;

  const [row] = await db.update(submissions).set(set).where(eq(submissions.id, id)).returning();
  if (!row) throw new HttpError(404, "Submission not found");
  res.status(200).json({ submission: row });
});
