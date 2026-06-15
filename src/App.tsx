import { BrowserRouter, Link, Navigate, NavLink, Route, Routes, useParams, useSearchParams } from "react-router-dom";
import { Sun, Moon, ArrowLeft, Code2 } from "lucide-react";
import { getProblem } from "./problems";
import { HomePage } from "./pages/HomePage";
import { ProblemPage } from "./pages/ProblemPage";
import { useTheme } from "./hooks/useTheme";

function ProblemRoute() {
  const { slug } = useParams();
  const problem = slug ? getProblem(slug) : undefined;
  if (!problem) return <Navigate to="/" replace />;
  return (
    <>
      <div className="problem-nav-row">
        <Link to="/" className="back-link">
          <ArrowLeft size={14} strokeWidth={2} /> All problems
        </Link>
        <a href={problem.leetcodeUrl} target="_blank" rel="noreferrer" className="leetcode-link">
          View on LeetCode ↗
        </a>
      </div>
      {/* key remounts the page so playback state resets when switching problems */}
      <ProblemPage key={problem.slug} problem={problem} />
    </>
  );
}

function ThemeToggle() {
  const [theme, setTheme] = useTheme();
  return (
    <button
      className="icon-btn"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
    </button>
  );
}

function TopNav() {
  const [searchParams] = useSearchParams();
  const isMap = searchParams.get("view") === "map";
  return (
    <div className="topnav">
      <NavLink
        to="/"
        end
        className={`topnav-link${!isMap ? " topnav-active" : ""}`}
      >
        Problems
      </NavLink>
      <Link
        to="/?view=map"
        className={`topnav-link${isMap ? " topnav-active" : ""}`}
      >
        Roadmap
      </Link>
    </div>
  );
}

export default function App() {
  useTheme(); // initialize theme on mount
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="topbar">
          <div className="topbar-left">
            <Link to="/" className="topbar-link">
              <img className="logo" src="/logo.png" alt="LeetSharp" />
            </Link>
            <TopNav />
          </div>
          <div className="topbar-right">
            <ThemeToggle />
            <a
              className="icon-btn"
              href="https://github.com/elberfunez/leetsharp"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              title="GitHub"
            >
              <Code2 size={18} strokeWidth={2} />
            </a>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/problems/:slug" element={<ProblemRoute />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <footer className="footer">
          <div className="footer-content">
            <p className="footer-text">Made for C# developers preparing for technical interviews.</p>
            <div className="footer-links">
              <a href="https://github.com/elberfunez/leetsharp" target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href="https://github.com/elberfunez" target="_blank" rel="noreferrer">
                Author
              </a>
            </div>
          </div>
          <p className="footer-copy">© 2026 LeetSharp. All rights reserved.</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}
