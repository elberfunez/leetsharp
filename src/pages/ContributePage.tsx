import { useState, useEffect, useRef, useCallback } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import {
  emptyDraft,
  validateSubmission,
  slugFromUrl,
  type SubmissionDraft,
  type SubmissionRecord,
} from "../domain/submission";
import { useAuthedFetch } from "../lib/api";
import { useCurrentUserCtx } from "../lib/currentUser";
import { CodePanel } from "../components/CodePanel";

const clerkEnabled = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

function toDraft(r: SubmissionRecord): SubmissionDraft {
  return { id: r.id, slug: r.slug, leetcodeUrl: r.leetcodeUrl, code: r.code, description: r.description ?? "" };
}

function ContributeInner() {
  const [params] = useSearchParams();
  const slug = params.get("slug");
  const idParam = params.get("id");
  const authedFetch = useAuthedFetch();
  const { user, loading: userLoading } = useCurrentUserCtx();

  const [draft, setDraft] = useState<SubmissionDraft>(() => emptyDraft());
  const [savedId, setSavedId] = useState<number | null>(idParam ? Number(idParam) : null);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  // Load an existing draft by id, or prefill the URL from the catalog slug.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (savedId) {
          const res = await authedFetch(`/api/submissions?id=${savedId}`);
          if (res.ok) {
            const d = await res.json();
            if (!cancelled) setDraft(toDraft(d.submission));
          }
        } else if (slug) {
          const res = await fetch("/api/catalog");
          if (res.ok) {
            const d = await res.json();
            const entry = d.entries.find((e: { slug: string }) => e.slug === slug);
            if (entry && !cancelled) {
              setDraft((prev) => ({ ...prev, slug: entry.slug, leetcodeUrl: entry.leetcodeUrl }));
            }
          }
        }
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = useCallback(
    async (submit: boolean): Promise<boolean> => {
      setSaving(true);
      try {
        const res = await authedFetch("/api/submissions", {
          method: "POST",
          body: JSON.stringify({ ...draft, id: savedId ?? undefined, submit }),
        });
        const d = await res.json();
        if (!res.ok) {
          setErrors(String(d.error ?? "Save failed").split("; "));
          return false;
        }
        setSavedId(d.submission.id);
        setSavedAt(new Date());
        setErrors([]);
        return true;
      } finally {
        setSaving(false);
      }
    },
    [draft, savedId, authedFetch]
  );

  // Debounced autosave once loaded.
  const draftSig = JSON.stringify(draft);
  const firstSig = useRef(true);
  useEffect(() => {
    if (!loaded || done) return;
    if (firstSig.current) {
      firstSig.current = false;
      return;
    }
    const t = setTimeout(() => void save(false), 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftSig, loaded]);

  const set = <K extends keyof SubmissionDraft>(k: K, v: SubmissionDraft[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const submit = async () => {
    // Keep slug in sync with whatever URL was typed.
    const withSlug = { ...draft, slug: slugFromUrl(draft.leetcodeUrl) || draft.slug };
    setDraft(withSlug);
    const ok = await save(true);
    if (ok) setDone(true);
  };

  if (clerkEnabled && !userLoading && !user) {
    return (
      <div className="unsolved-page">
        <p className="search-empty">Please sign in to contribute a solution.</p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="unsolved-page">
        <header className="unsolved-header">
          <div>
            <h1>Thanks! 🎉</h1>
            <p className="unsolved-sub">
              Your solution is in the review queue. Elber will build out the visual
              walkthrough and publish it — you'll be credited as the author.
            </p>
          </div>
        </header>
        <Link className="unsolved-solve" to="/my-submissions">
          View my submissions <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  const submitErrors = validateSubmission(draft, { forSubmit: true });

  return (
    <div className="contribute-page">
      <Link to="/unsolved" className="back-link">
        <ArrowLeft size={14} strokeWidth={2} /> Back to Unsolved
      </Link>

      <header className="contribute-head">
        <h1>Submit a solution</h1>
        <span className="wizard-save">
          {saving ? "Saving…" : savedAt ? `Draft saved ${savedAt.toLocaleTimeString()}` : ""}
        </span>
      </header>
      <p className="unsolved-sub contribute-intro">
        Just the problem link and your C# solution. Elber builds the step-by-step animation,
        complexity notes, and approach during review — a description is optional but helps.
      </p>

      {errors.length > 0 && (
        <div className="wizard-errors">
          {errors.map((e, i) => (
            <div key={i}>⚠ {e}</div>
          ))}
        </div>
      )}

      <div className="contribute-form">
        <label className="propose-field">
          <span>LeetCode or NeetCode problem URL</span>
          <input
            type="url"
            value={draft.leetcodeUrl}
            onChange={(e) => set("leetcodeUrl", e.target.value)}
            placeholder="https://leetcode.com/problems/min-stack/"
          />
          {draft.leetcodeUrl && (
            <span className="contribute-slug">
              {slugFromUrl(draft.leetcodeUrl) ? `slug: ${slugFromUrl(draft.leetcodeUrl)}` : "⚠ couldn't read a problem slug from that URL"}
            </span>
          )}
        </label>

        <div className="contribute-split">
          <label className="propose-field wizard-grow">
            <span>Your C# solution</span>
            <textarea
              className="wizard-textarea wizard-code"
              value={draft.code}
              onChange={(e) => set("code", e.target.value)}
              placeholder={"public class Solution {\n    public int[] TwoSum(int[] nums, int target) {\n        ...\n    }\n}"}
            />
          </label>
          <div className="wizard-preview">
            <span className="vis-label">Preview</span>
            {draft.code.trim() ? (
              <CodePanel code={draft.code} activeLines={[]} stepIndex={0} />
            ) : (
              <p className="builder-hint">Paste your C# to preview it highlighted.</p>
            )}
          </div>
        </div>

        <label className="propose-field">
          <span>Description / notes for the reviewer (optional)</span>
          <textarea
            rows={4}
            className="wizard-textarea contribute-desc"
            value={draft.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Anything worth knowing — the approach, edge cases, why this is idiomatic C#…"
          />
        </label>

        <button className="propose-submit contribute-submit" disabled={submitErrors.length > 0 || saving} onClick={submit}>
          <Check size={15} /> Submit for review
        </button>
        {submitErrors.length > 0 && (
          <span className="builder-hint">{submitErrors.join(" · ")}</span>
        )}
      </div>
    </div>
  );
}

/** Simple solution hand-off form (URL + C# + optional description). */
export function ContributePage() {
  if (!clerkEnabled) return <Navigate to="/" replace />;
  return <ContributeInner />;
}
