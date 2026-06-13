import { Link } from "react-router-dom";
import { Star, GitBranch, GitFork } from "lucide-react";
import { problems } from "../problems";

/** Problem index, grouped by NeetCode category. */
export function HomePage() {
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

      <p className="home-intro">
        Step through real C# solutions line by line and watch the data structures change.
        Every problem here was solved by hand — the visualizations trace the actual code.
      </p>
      {categories.map((category) => (
        <div className="category-group" key={category}>
          <div className="category-title">{category}</div>
          <div className="problem-list">
            {problems
              .filter((p) => p.category === category)
              .map((p) => (
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
      ))}
    </div>
  );
}
