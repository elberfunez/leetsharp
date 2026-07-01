import { useEffect, useState, useCallback } from "react";
import { Link, Navigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import type { SubmissionRecord, SubmissionStatus } from "../domain/submission";
import { useCurrentUserCtx } from "../lib/currentUser";
import { useAuthedFetch } from "../lib/api";

const clerkEnabled = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

const STATUS_LABEL: Record<SubmissionStatus, string> = {
  draft: "Draft",
  pending: "In review",
  changes_requested: "Changes requested",
  approved: "Approved",
  rejected: "Rejected",
  published: "Published",
};

function MySubmissionsInner() {
  const { user, loading } = useCurrentUserCtx();
  const authedFetch = useAuthedFetch();
  const [rows, setRows] = useState<SubmissionRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!user) return;
    authedFetch("/api/submissions")
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((d) => setRows(d.submissions as SubmissionRecord[]))
      .catch(() => setError("Couldn't load your submissions."));
  }, [authedFetch, user]);

  useEffect(() => {
    load();
  }, [load]);

  const deleteDraft = async (id: number) => {
    if (!confirm("Delete this draft? This can't be undone.")) return;
    const res = await authedFetch(`/api/submissions?id=${id}`, { method: "DELETE" });
    if (res.ok) load();
  };

  if (loading) return <div className="unsolved-page"><p className="search-empty">Loading…</p></div>;
  if (!user) return <Navigate to="/" replace />;

  return (
    <div className="unsolved-page">
      <header className="unsolved-header">
        <div>
          <h1>My submissions</h1>
          <p className="unsolved-sub">Drafts and submitted solutions, with their review status.</p>
        </div>
        <Link className="propose-open-btn" to="/unsolved">
          Find a problem to solve
        </Link>
      </header>

      {error && <p className="search-empty">{error}</p>}
      {rows && rows.length === 0 && <p className="search-empty">Nothing yet — pick a problem from the Unsolved board.</p>}

      <div className="unsolved-list">
        {(rows ?? []).map((s) => {
          const editable = s.status === "draft" || s.status === "changes_requested" || s.status === "rejected";
          return (
            <div className="unsolved-card" key={s.id}>
              {s.number != null && <span className="unsolved-num">#{s.number}</span>}
              <span className="unsolved-card-title">{s.title || s.slug || "(untitled draft)"}</span>
              <span className={`subm-status subm-status-${s.status}`}>{STATUS_LABEL[s.status]}</span>
              {s.adminNote && <span className="subm-note">“{s.adminNote}”</span>}
              {s.publishedPrUrl && (
                <a className="unsolved-lc" href={s.publishedPrUrl} target="_blank" rel="noreferrer">
                  PR ↗
                </a>
              )}
              {editable && (
                <>
                  <Link className="unsolved-solve" to={`/contribute/new?id=${s.id}`}>
                    {s.status === "draft" ? "Continue" : "Revise"}
                  </Link>
                  {s.status === "draft" && (
                    <button
                      className="admin-reject"
                      onClick={() => deleteDraft(s.id)}
                      aria-label="Delete draft"
                    >
                      <Trash2 size={14} strokeWidth={2} />
                    </button>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** A contributor's own drafts/submissions and their statuses. */
export function MySubmissionsPage() {
  if (!clerkEnabled) return <Navigate to="/" replace />;
  return <MySubmissionsInner />;
}
