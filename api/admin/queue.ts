import { desc, eq } from "drizzle-orm";
import { db, catalogEntries, submissions, users } from "../../db/index.js";
import { withErrors } from "../_lib/http.js";
import { requireAdmin } from "../_lib/auth.js";

/** GET /api/admin/queue — admin-only; everything awaiting review. */
export default withErrors(async (req, res) => {
  await requireAdmin(req);

  const pendingCatalog = await db
    .select()
    .from(catalogEntries)
    .where(eq(catalogEntries.status, "pending"))
    .orderBy(desc(catalogEntries.createdAt));

  // Join the author's GitHub handle for display/credit.
  const submissionRows = await db
    .select({ submission: submissions, authorLogin: users.githubLogin })
    .from(submissions)
    .leftJoin(users, eq(submissions.authorUserId, users.id))
    .where(eq(submissions.status, "pending"))
    .orderBy(desc(submissions.createdAt));

  const pendingSubmissions = submissionRows.map((r) => ({
    ...r.submission,
    authorLogin: r.authorLogin,
  }));

  res.status(200).json({ catalog: pendingCatalog, submissions: pendingSubmissions });
});
