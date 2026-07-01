import { getContributors } from "../lib/contributors";

/** Credits everyone whose solutions are published, by problem count. Derived
 *  from static problem data, so it grows automatically as submissions ship. */
export function Contributors() {
  const contributors = getContributors();
  if (contributors.length === 0) return null;
  return (
    <div className="contributors">
      <span className="contributors-head">Contributors</span>
      <ul className="contributors-list">
        {contributors.map(({ author, count }) => (
          <li key={author.handle}>
            <a href={author.githubUrl} target="_blank" rel="noreferrer" className="contributor">
              <img
                className="contributor-avatar"
                src={`https://github.com/${author.handle}.png?size=40`}
                alt=""
                loading="lazy"
              />
              <span className="contributor-handle">@{author.handle}</span>
              <span className="contributor-count">{count}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
