import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search, List, LayoutGrid, Play,
  Star, GitBranch, GitFork,
} from "lucide-react";
import type { Problem } from "../domain/types";
import { problems } from "../problems";
import { tagsFor } from "../problems/tags";
import { RoadmapView } from "../components/RoadmapView";
import { CategoryPanel } from "../components/CategoryPanel";

type View = "grid" | "list" | "map";
type Diff = "All" | "Easy" | "Medium" | "Hard";

const isView = (v: string | null): v is View => v === "grid" || v === "list" || v === "map";

export function HomePage() {
  const [searchParams] = useSearchParams();
  const [view, setView] = useState<View>(() => {
    const fromUrl = searchParams.get("view");
    if (isView(fromUrl)) return fromUrl;
    const saved = localStorage.getItem("leetsharp-view");
    // Only list/grid persist; map (roadmap) is reached only via the topbar link.
    return saved === "list" || saved === "grid" ? saved : "grid";
  });
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<Diff>("All");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  useEffect(() => {
    if (view === "list" || view === "grid") {
      localStorage.setItem("leetsharp-view", view);
    }
  }, [view]);

  // Syncs view with URL: ?view=map → roadmap; no param → restore saved grid/list.
  useEffect(() => {
    const v = searchParams.get("view");
    if (v === "map") {
      setView("map");
    } else if (!v) {
      // Navigating back to Problems (no query param) — restore last grid/list choice.
      const saved = localStorage.getItem("leetsharp-view");
      setView(saved === "list" ? "list" : "grid");
    }
  }, [searchParams]);

  const q = query.trim().toLowerCase();
  const categories = [...new Set(problems.map((p) => p.category))];

  const matches = (p: Problem) =>
    p.title.toLowerCase().includes(q) &&
    (difficulty === "All" || p.difficulty === difficulty) &&
    (selectedCategory === null || p.category === selectedCategory);

  const visibleCategories = selectedCategory ? [selectedCategory] : categories;
  const anyMatch = problems.some(matches);

  const Card = ({ p }: { p: Problem }) => (
    <Link className="glass-card" to={`/problems/${p.slug}`}>
      <div className="glass-card-top">
        <span className={`chip chip-${p.difficulty.toLowerCase()}`}>{p.difficulty}</span>
      </div>
      <h3 className="glass-card-title">{p.title}</h3>
      <div className="glass-card-bottom">
        <span className="glass-card-tags">{tagsFor(p.slug).join(" · ")}</span>
        <Play size={15} className="glass-card-play" />
      </div>
    </Link>
  );

  const Row = ({ p }: { p: Problem }) => (
    <Link className="problem-card" to={`/problems/${p.slug}`}>
      <span className="problem-title">{p.title}</span>
      <span className="problem-tags">{tagsFor(p.slug).join(" · ")}</span>
      <span className={`chip chip-${p.difficulty.toLowerCase()}`}>{p.difficulty}</span>
    </Link>
  );

  return (
    <div className="home-layout">
      <aside className="home-sidebar">
        <nav className="sidebar-nav">
          <button
            className={`sidebar-link${selectedCategory === null ? " sidebar-active" : ""}`}
            onClick={() => setSelectedCategory(null)}
          >
            <span className="sidebar-link-label">
              <LayoutGrid size={15} strokeWidth={2} /> All Problems
            </span>
            <span className="sidebar-count">{problems.length}</span>
          </button>
          {categories.map((cat) => {
            const total = problems.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                className={`sidebar-link${selectedCategory === cat ? " sidebar-active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                <span className="sidebar-link-label">{cat}</span>
                <span className="sidebar-count">{total}</span>
              </button>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <a href="https://github.com/elberfunez/leetsharp" target="_blank" rel="noreferrer" className="home-link">
            <Star size={14} strokeWidth={2} /> Star
          </a>
          <a href="https://github.com/elberfunez" target="_blank" rel="noreferrer" className="home-link">
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
      </aside>

      <div className="home-main">
        <header className="dash-header">
          <div>
            <p className="dash-subtitle">LeetCode problems, solved in C# — with step-by-step visual walkthroughs.</p>
          </div>
          {view !== "map" && (
            <div className="view-toggle">
              <button
                className={`view-toggle-btn${view === "list" ? " view-toggle-active" : ""}`}
                onClick={() => setView("list")}
              >
                <List size={15} strokeWidth={2} /> List
              </button>
              <button
                className={`view-toggle-btn${view === "grid" ? " view-toggle-active" : ""}`}
                onClick={() => setView("grid")}
              >
                <LayoutGrid size={15} strokeWidth={2} /> Grid
              </button>
            </div>
          )}
        </header>

        {view !== "map" && (
          <div className="dash-controls">
            <div className="search-box">
              <Search size={16} strokeWidth={2} className="search-icon" />
              <input
                className="search-input"
                type="text"
                placeholder="Search problems..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <select
              className="diff-select"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Diff)}
            >
              <option value="All">All difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        )}

        {view === "map" ? (
          <RoadmapView onSelect={setOpenCategory} />
        ) : (
          <div className="cat-sections">
            {visibleCategories.map((cat) => {
              const items = problems.filter((p) => p.category === cat && matches(p));
              if (items.length === 0) return null;
              const total = problems.filter((p) => p.category === cat).length;
              return (
                <section className="cat-section" key={cat}>
                  <div className="cat-section-head">
                    <h2>{cat}</h2>
                    <span className="cat-section-count">{total} problems</span>
                  </div>
                  {view === "grid" ? (
                    <div className="card-grid">
                      {items.map((p) => (
                        <Card key={p.slug} p={p} />
                      ))}
                    </div>
                  ) : (
                    <div className="problem-list">
                      {items.map((p) => (
                        <Row key={p.slug} p={p} />
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
            {!anyMatch && <p className="search-empty">No problems match your filters.</p>}
          </div>
        )}
      </div>

      {openCategory && (
        <CategoryPanel category={openCategory} onClose={() => setOpenCategory(null)} />
      )}
    </div>
  );
}
