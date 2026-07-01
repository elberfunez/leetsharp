import { useEffect, useState, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { Check, Trash2, MessageSquare, Rocket } from "lucide-react";
import type { CatalogEntry } from "../domain/contributions";
import type { SubmissionRecord } from "../domain/submission";
import { useCurrentUserCtx } from "../lib/currentUser";
import { useAuthedFetch } from "../lib/api";
import { CodePanel } from "../components/CodePanel";

const clerkEnabled = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

type AdminSubmission = SubmissionRecord & { authorLogin: string | null };

interface QueueData {
  catalog: CatalogEntry[];
  submissions: AdminSubmission[];
}

function AdminReviewInner() {
  const { user, loading } = useCurrentUserCtx();
  const authedFetch = useAuthedFetch();
  const [queue, setQueue] = useState<QueueData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isAdmin = user?.role === "admin";

  const load = useCallback(() => {
    if (!isAdmin) return;
    setError(null);
    authedFetch("/api/admin/queue")
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((d) => setQueue(d as QueueData))
      .catch(() => setError("Failed to load the review queue."));
  }, [authedFetch, isAdmin]);

  useEffect(() => {
    load();
  }, [load]);

  const actOnCatalog = async (id: number, action: "approve" | "reject") => {
    let metadata = {};
    if (action === "approve") {
      const titleInput = window.prompt("Title:");
      if (titleInput === null) return;
      const numberInput = window.prompt("LeetCode number:");
      if (numberInput === null) return;
      const categoryInput = window.prompt("Category (e.g. Arrays & Hashing):");
      if (categoryInput === null) return;
      const difficultyInput = window.prompt("Difficulty (Easy/Medium/Hard):");
      if (difficultyInput === null) return;
      metadata = { title: titleInput, number: Number(numberInput), category: categoryInput, difficulty: difficultyInput };
    }
    const res = await authedFetch("/api/admin/catalog", {
      method: "POST",
      body: JSON.stringify({ id, action, ...metadata }),
    });
    if (res.ok) load();
  };

  const actOnSubmission = async (
    id: number,
    status: "approved" | "changes_requested" | "rejected" | "published"
  ) => {
    let note: string | undefined;
    let prUrl: string | undefined;
    if (status === "changes_requested" || status === "rejected") {
      const msg = window.prompt(
        status === "rejected"
          ? "Reason for rejecting (sent to the contributor):"
          : "What changes are needed? (sent to the contributor)"
      );
      if (msg === null) return; // cancelled
      note = msg;
    }
    if (status === "published") {
      prUrl = window.prompt("Link to the published PR/commit (optional):") ?? "";
    }
    const res = await authedFetch("/api/admin/submissions", {
      method: "POST",
      body: JSON.stringify({ id, status, note, prUrl }),
    });
    if (res.ok) load();
  };

  if (loading) {
    return (
      <div className="admin-page">
        <p className="search-empty">Loading…</p>
      </div>
    );
  }
  if (!isAdmin) return <Navigate to="/" replace />;

  const pendingCatalog = queue?.catalog ?? [];
  const pendingSubmissions = queue?.submissions ?? [];

  return (
    <div className="admin-page">
      <header className="unsolved-header">
        <div>
          <h1>Review queue</h1>
          <p className="unsolved-sub">Approve community proposals and solution submissions.</p>
        </div>
      </header>

      {error && <p className="search-empty">{error}</p>}

      {/* Proposed catalog problems */}
      <section className="cat-section">
        <div className="cat-section-head">
          <h2>Proposed problems</h2>
          <span className="cat-section-count">{pendingCatalog.length} pending</span>
        </div>
        {pendingCatalog.length === 0 ? (
          <p className="search-empty">No proposals waiting.</p>
        ) : (
          <div className="unsolved-list">
            {pendingCatalog.map((e) => (
              <div className="unsolved-card" key={e.id}>
                <span className="unsolved-num">#{e.number}</span>
                <span className="unsolved-card-title">{e.title}</span>
                <span className={`chip chip-${e.difficulty.toLowerCase()}`}>{e.difficulty}</span>
                <span className="admin-cat-tag">{e.category}</span>
                <a className="unsolved-lc" href={e.leetcodeUrl} target="_blank" rel="noreferrer">
                  LeetCode ↗
                </a>
                <button className="admin-approve" onClick={() => actOnCatalog(e.id, "approve")}>
                  <Check size={15} strokeWidth={2} /> Approve
                </button>
                <button className="admin-reject" onClick={() => actOnCatalog(e.id, "reject")}>
                  <Trash2 size={15} strokeWidth={2} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Submitted solutions */}
      <section className="cat-section">
        <div className="cat-section-head">
          <h2>Submitted solutions</h2>
          <span className="cat-section-count">{pendingSubmissions.length} pending</span>
        </div>
        {pendingSubmissions.length === 0 ? (
          <p className="search-empty">No submissions waiting.</p>
        ) : (
          <div className="admin-sub-list">
            {pendingSubmissions.map((s) => (
              <div className="admin-sub" key={s.id}>
                <div className="admin-sub-head">
                  {s.number != null && <span className="unsolved-num">#{s.number}</span>}
                  <span className="unsolved-card-title">{s.title || s.slug}</span>
                  {s.difficulty && <span className={`chip chip-${s.difficulty.toLowerCase()}`}>{s.difficulty}</span>}
                  {s.category && <span className="admin-cat-tag">{s.category}</span>}
                  <span className="admin-sub-author">
                    by @{s.authorLogin ?? "unknown"}
                  </span>
                  <a className="unsolved-lc" href={s.leetcodeUrl} target="_blank" rel="noreferrer">
                    Problem ↗
                  </a>
                </div>

                {s.description && <p className="admin-sub-desc">{s.description}</p>}

                <CodePanel code={s.code} activeLines={[]} stepIndex={0} />

                <div className="admin-sub-actions">
                  <button className="admin-approve" onClick={() => actOnSubmission(s.id, "approved")}>
                    <Check size={15} strokeWidth={2} /> Accept
                  </button>
                  <button className="admin-secondary" onClick={() => actOnSubmission(s.id, "changes_requested")}>
                    <MessageSquare size={14} strokeWidth={2} /> Request changes
                  </button>
                  <button className="admin-publish" onClick={() => actOnSubmission(s.id, "published")}>
                    <Rocket size={14} strokeWidth={2} /> Mark published
                  </button>
                  <button className="admin-reject" onClick={() => actOnSubmission(s.id, "rejected")}>
                    <Trash2 size={15} strokeWidth={2} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/** Admin-only review dashboard. */
export function AdminReviewPage() {
  if (!clerkEnabled) return <Navigate to="/" replace />;
  return <AdminReviewInner />;
}
