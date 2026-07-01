import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import { Plus, ArrowRight } from "lucide-react";
import { CATEGORIES } from "../domain/categories";
import type { CatalogEntry } from "../domain/contributions";
import { useCurrentUserCtx } from "../lib/currentUser";
import { ProposeProblemModal } from "../components/ProposeProblemModal";

const clerkEnabled = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

/** Outer gate: only mount Clerk-hook-using inner bar when auth is configured. */
function ProposeBar({ onCreated }: { onCreated: () => void }) {
  if (!clerkEnabled) return null;
  return <ProposeBarInner onCreated={onCreated} />;
}

function ProposeBarInner({ onCreated }: { onCreated: () => void }) {
  const { user } = useCurrentUserCtx();
  const clerk = useClerk();
  const [open, setOpen] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  return (
    <div className="propose-bar">
      <button
        className="propose-open-btn"
        onClick={() => (user ? setOpen(true) : clerk.openSignIn())}
      >
        <Plus size={15} strokeWidth={2} /> Propose a problem
      </button>
      {flash && <span className="propose-flash">{flash}</span>}
      {open && user && (
        <ProposeProblemModal
          isAdmin={user.role === "admin"}
          onClose={() => setOpen(false)}
          onCreated={(_entry, autoApproved) => {
            setOpen(false);
            setFlash(autoApproved ? "Added to the catalog ✓" : "Submitted for review — thanks!");
            onCreated();
            setTimeout(() => setFlash(null), 4000);
          }}
        />
      )}
    </div>
  );
}

/** The "Unsolved" board: approved catalog entries grouped by category, each a
 *  jumping-off point to contribute a solution. */
export function UnsolvedPage() {
  const [entries, setEntries] = useState<CatalogEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setError(null);
    fetch("/api/catalog")
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((d) => setEntries(d.entries as CatalogEntry[]))
      .catch(() => setError("Couldn't load the catalog. Is the API running (vercel dev)?"));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const byCategory = (cat: string) => (entries ?? []).filter((e) => e.category === cat);
  const activeCategories = CATEGORIES.filter((c) => byCategory(c).length > 0);

  return (
    <div className="unsolved-page">
      <header className="unsolved-header">
        <div>
          <h1>Unsolved</h1>
          <p className="unsolved-sub">
            Problems the community wants next. Pick one, solve it in C#, and contribute a
            visual walkthrough.
          </p>
        </div>
        <ProposeBar onCreated={load} />
      </header>

      {error && <p className="search-empty">{error}</p>}
      {entries && entries.length === 0 && !error && (
        <p className="search-empty">Nothing in the catalog yet — propose the first one!</p>
      )}

      <div className="cat-sections">
        {activeCategories.map((cat) => {
          const items = byCategory(cat);
          return (
            <section className="cat-section" key={cat}>
              <div className="cat-section-head">
                <h2>{cat}</h2>
                <span className="cat-section-count">{items.length} unsolved</span>
              </div>
              <div className="unsolved-list">
                {items.map((e) => (
                  <div className="unsolved-card" key={e.id}>
                    <span className="unsolved-num">#{e.number}</span>
                    <span className="unsolved-card-title">{e.title}</span>
                    <span className={`chip chip-${e.difficulty.toLowerCase()}`}>{e.difficulty}</span>
                    <a
                      className="unsolved-lc"
                      href={e.leetcodeUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      LeetCode ↗
                    </a>
                    <Link className="unsolved-solve" to={`/contribute/new?slug=${e.slug}`}>
                      Solve this <ArrowRight size={14} strokeWidth={2} />
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
