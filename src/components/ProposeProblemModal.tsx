import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import type { CatalogEntry } from "../domain/contributions";
import { useAuthedFetch } from "../lib/api";

interface Props {
  isAdmin: boolean;
  onClose: () => void;
  onCreated: (entry: CatalogEntry, autoApproved: boolean) => void;
}

/** Form to propose a new unsolved problem. Admins' entries are auto-approved;
 *  others' go to the review queue. Rendered only when signed in. */
export function ProposeProblemModal({ isAdmin, onClose, onCreated }: Props) {
  const authedFetch = useAuthedFetch();
  const [leetcodeUrl, setLeetcodeUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await authedFetch("/api/catalog", {
        method: "POST",
        body: JSON.stringify({ leetcodeUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to submit");
      onCreated(data.entry as CatalogEntry, isAdmin);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="panel-overlay propose-overlay" onClick={onClose}>
      <form className="propose-modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <button type="button" className="panel-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
        <h2 className="propose-title">Propose a problem</h2>
        <p className="propose-sub">
          {isAdmin
            ? "As an admin, this is added to the catalog immediately."
            : "Submitted for admin review. Once approved it appears on the Unsolved board."}
        </p>

        <label className="propose-field">
          <span>LeetCode or NeetCode URL</span>
          <input
            type="url"
            value={leetcodeUrl}
            onChange={(e) => setLeetcodeUrl(e.target.value)}
            placeholder="https://leetcode.com/problems/two-sum/"
            required
          />
        </label>

        {error && <p className="propose-error">{error}</p>}

        <div className="propose-actions">
          <button type="button" className="propose-cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="propose-submit" disabled={submitting}>
            {submitting ? "Submitting…" : isAdmin ? "Add to catalog" : "Submit for review"}
          </button>
        </div>
      </form>
    </div>
  );
}
