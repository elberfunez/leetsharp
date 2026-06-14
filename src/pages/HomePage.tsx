import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, GitBranch, GitFork, Search, List, Map } from "lucide-react";
import { problems } from "../problems";
import { RoadmapView } from "../components/RoadmapView";
import { CategoryPanel } from "../components/CategoryPanel";

type View = "list" | "map";

/** Problem index — list view (grouped + searchable) or roadmap (map) view. */
export function HomePage() {
  const [view, setView] = useState<View>(() => {
    const saved = localStorage.getItem("leetsharp-view");
    return (saved as View) || "list";
  });
  const [query, setQuery] = useState("");
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("leetsharp-view", view);
  }, [view]);

  const q = query.trim().toLowerCase();
  const matches = (title: string, number: number) =>
    title.toLowerCase().includes(q) || String(number).includes(q);

  const categories = [...new Set(problems.map((p) => p.category))];

  return (
    <div>
      <div className="home-hero">
        <h2>Why LeetSharp?</h2>
        <p>
          You've been grinding LeetCode in C#, but every solution guide assumes you speak Python or JavaScript.
          The visualizations skip your language. The explanations gloss over C#-specific gotchas like
          {" "}<code>TryGetValue</code> vs{" "}<code>ContainsKey</code>, or why <code>queue.Count</code> matters.
        </p>
        <p>
          <strong>LeetSharp is different.</strong> Every solution here is solved in C#, traced through your actual
          code, and explained the way a C# dev thinks. Watch pointers glide, arrays flip, linked lists reverse — step
          by step. Built by <strong>Elber Funez</strong>, a C# dev tired of settling.
        </p>
        <div className="home-buttons">
          <a
            href="https://github.com/elberfunez/leetsharp"
            target="_blank"
            rel="noreferrer"
            className="home-button home-button-primary"
          >
            <Star size={15} strokeWidth={2} /> Star on GitHub
          </a>
          <a
            href="https://github.com/elberfunez"
            target="_blank"
            rel="noreferrer"
            className="home-button home-button-secondary"
          >
            <GitBranch size={15} strokeWidth={2} /> Follow @elberfunez
          </a>
          <a
            href="https://github.com/elberfunez/leetsharp/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noreferrer"
            className="home-button home-button-secondary"
          >
            <GitFork size={15} strokeWidth={2} /> Contribute
          </a>
        </div>
      </div>

      <div className="home-controls">
        <div className="view-toggle">
          <button
            className={`view-toggle-btn${view === "list" ? " view-toggle-active" : ""}`}
            onClick={() => setView("list")}
          >
            <List size={15} strokeWidth={2} /> List
          </button>
          <button
            className={`view-toggle-btn${view === "map" ? " view-toggle-active" : ""}`}
            onClick={() => setView("map")}
          >
            <Map size={15} strokeWidth={2} /> Map
          </button>
        </div>

        {view === "list" && (
          <div className="search-box">
            <Search size={16} strokeWidth={2} className="search-icon" />
            <input
              className="search-input"
              type="text"
              placeholder="Search problems by name or number…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        )}
      </div>

      {view === "map" ? (
        <RoadmapView onSelect={setOpenCategory} />
      ) : (
        <>
          {categories.map((category) => {
            const items = problems.filter((p) => p.category === category && matches(p.title, p.number));
            if (items.length === 0) return null;
            return (
              <div className="category-group" key={category}>
                <div className="category-title">{category}</div>
                <div className="problem-list">
                  {items.map((p) => (
                    <Link className="problem-card" to={`/problems/${p.slug}`} key={p.slug}>
                      <span className="problem-number">{p.number}</span>
                      <span className="problem-title">{p.title}</span>
                      <span className={`difficulty difficulty-${p.difficulty.toLowerCase()}`}>
                        {p.difficulty}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
          {q && problems.every((p) => !matches(p.title, p.number)) && (
            <p className="search-empty">No problems match “{query}”.</p>
          )}
        </>
      )}

      {openCategory && (
        <CategoryPanel category={openCategory} onClose={() => setOpenCategory(null)} />
      )}
    </div>
  );
}
