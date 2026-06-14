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
  const matches = (title: string) =>
    title.toLowerCase().includes(q);

  const categories = [...new Set(problems.map((p) => p.category))];

  return (
    <div>
      <div className="home-links">
        <a
          href="https://github.com/elberfunez/leetsharp"
          target="_blank"
          rel="noreferrer"
          className="home-link"
        >
          <Star size={14} strokeWidth={2} /> Star
        </a>
        <a
          href="https://github.com/elberfunez"
          target="_blank"
          rel="noreferrer"
          className="home-link"
        >
          <GitBranch size={14} strokeWidth={2} /> Follow
        </a>
        <a
          href="https://github.com/elberfunez/leetsharp/blob/main/CONTRIBUTING.md"
          target="_blank"
          rel="noreferrer"
          className="home-link"
        >
          <GitFork size={14} strokeWidth={2} /> Contribute
        </a>
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
            const items = problems.filter((p) => p.category === category && matches(p.title));
            if (items.length === 0) return null;
            return (
              <div className="category-group" key={category}>
                <div className="category-title">{category}</div>
                <div className="problem-list">
                  {items.map((p) => (
                    <Link className="problem-card" to={`/problems/${p.slug}`} key={p.slug}>
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
          {q && problems.every((p) => !matches(p.title)) && (
            <p className="search-empty">No problems match "{query}".</p>
          )}
        </>
      )}

      {openCategory && (
        <CategoryPanel category={openCategory} onClose={() => setOpenCategory(null)} />
      )}
    </div>
  );
}
