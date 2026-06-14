import { Link } from "react-router-dom";
import { FileText, X } from "lucide-react";
import { problems } from "../problems";

interface Props {
  category: string;
  onClose: () => void;
}

/** Slide-over panel listing a category's problems — opened from a roadmap node. */
export function CategoryPanel({ category, onClose }: Props) {
  const items = problems.filter((p) => p.category === category);

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="category-panel" onClick={(e) => e.stopPropagation()}>
        <header className="category-panel-header">
          <button className="panel-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
          <h2>{category}</h2>
          <div className="panel-count">
            {items.length} / {items.length}
          </div>
          <div className="panel-progress">
            <div className="panel-progress-fill" style={{ width: "100%" }} />
          </div>
        </header>

        <div className="panel-table">
          <div className="panel-row panel-row-head">
            <span>Star</span>
            <span>Problem</span>
            <span>Difficulty</span>
            <span>Solution</span>
          </div>
          {items.map((p) => (
            <div className="panel-row" key={p.slug}>
              <span className="panel-star">★</span>
              <Link className="panel-problem" to={`/problems/${p.slug}`} onClick={onClose}>
                {p.title}
              </Link>
              <span className={`difficulty difficulty-${p.difficulty.toLowerCase()}`}>
                {p.difficulty}
              </span>
              <Link className="panel-solution" to={`/problems/${p.slug}`} onClick={onClose} aria-label="View solution">
                <FileText size={16} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
