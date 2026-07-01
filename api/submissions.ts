import { desc, eq } from "drizzle-orm";
import { db, submissions, catalogEntries } from "../db/index.js";
import { withErrors } from "./_lib/http.js";
import { requireUser, HttpError } from "./_lib/auth.js";
import { validateSubmission, slugFromUrl, type SubmissionDraft } from "../src/domain/submission.js";

function coerceDraft(body: Record<string, any>): SubmissionDraft {
  const leetcodeUrl = String(body.leetcodeUrl ?? "").trim();
  return {
    leetcodeUrl,
    slug: slugFromUrl(leetcodeUrl),
    code: String(body.code ?? ""),
    description: String(body.description ?? "").trim(),
  };
}

/**
 * /api/submissions — a contributor's own solution hand-offs.
 *   GET        → list mine (newest first)
 *   GET ?id=N  → one (owner or admin)
 *   POST       → create/update; { submit: true } moves draft → pending
 *   DELETE ?id=N → delete a draft (owner only; drafts only)
 */
export default withErrors(async (req, res) => {
  const user = await requireUser(req);

  if (req.method === "DELETE") {
    const idParam = req.query.id;
    if (!idParam) throw new HttpError(400, "id is required");
    const id = Number(idParam);
    const [row] = await db.select().from(submissions).where(eq(submissions.id, id)).limit(1);
    if (!row) throw new HttpError(404, "Submission not found");
    if (row.authorUserId !== user.id) throw new HttpError(403, "Forbidden");
    if (row.status !== "draft") throw new HttpError(409, "Only drafts can be deleted");
    await db.delete(submissions).where(eq(submissions.id, id));
    res.status(204).send("");
    return;
  }

  if (req.method === "GET") {
    const idParam = req.query.id;
    if (idParam) {
      const id = Number(idParam);
      const [row] = await db.select().from(submissions).where(eq(submissions.id, id)).limit(1);
      if (!row) throw new HttpError(404, "Submission not found");
      if (row.authorUserId !== user.id && user.role !== "admin") throw new HttpError(403, "Forbidden");
      res.status(200).json({ submission: row });
      return;
    }
    const rows = await db
      .select()
      .from(submissions)
      .where(eq(submissions.authorUserId, user.id))
      .orderBy(desc(submissions.updatedAt));
    res.status(200).json({ submissions: rows });
    return;
  }

  if (req.method === "POST") {
    const body = (req.body ?? {}) as Record<string, any>;
    const forSubmit = body.submit === true;
    const draft = coerceDraft(body);

    const errors = validateSubmission(draft, { forSubmit });
    if (errors.length) throw new HttpError(400, errors.join("; "));

    // Enrich with catalog metadata if this slug is a known unsolved problem.
    const [catalog] = draft.slug
      ? await db.select().from(catalogEntries).where(eq(catalogEntries.slug, draft.slug)).limit(1)
      : [];

    const values = {
      slug: draft.slug,
      leetcodeUrl: draft.leetcodeUrl,
      code: draft.code,
      description: draft.description || null,
      title: catalog?.title ?? null,
      number: catalog?.number ?? null,
      category: catalog?.category ?? null,
      difficulty: catalog?.difficulty ?? null,
      authorUserId: user.id,
      status: (forSubmit ? "pending" : "draft") as "pending" | "draft",
      updatedAt: new Date(),
    };

    if (body.id) {
      const id = Number(body.id);
      const [existing] = await db.select().from(submissions).where(eq(submissions.id, id)).limit(1);
      if (!existing) throw new HttpError(404, "Submission not found");
      if (existing.authorUserId !== user.id) throw new HttpError(403, "Forbidden");
      if (existing.status === "approved" || existing.status === "published") {
        throw new HttpError(409, "This submission has already been published");
      }
      const [row] = await db.update(submissions).set(values).where(eq(submissions.id, id)).returning();
      res.status(200).json({ submission: row });
      return;
    }

    const [row] = await db.insert(submissions).values(values).returning();
    res.status(201).json({ submission: row });
    return;
  }

  throw new HttpError(405, "Method not allowed");
});
