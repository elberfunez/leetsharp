import { BrowserRouter, Link, Navigate, NavLink, Route, Routes, useParams, useSearchParams } from "react-router-dom";
import { Sun, Moon, ArrowLeft, Code2, AlertCircle } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { getProblem } from "./problems";
import { HomePage } from "./pages/HomePage";
import { ProblemPage } from "./pages/ProblemPage";
import { useTheme } from "./hooks/useTheme";

function ProblemRoute() {
  const { slug } = useParams();
  const problem = slug ? getProblem(slug) : undefined;
  if (!problem) return <Navigate to="/" replace />;

  const issueUrl = `https://github.com/elberfunez/leetsharp/issues/new?title=Issue:%20${encodeURIComponent(problem.title)}&body=${encodeURIComponent(`**Problem:** ${problem.title}\n\n**What's the issue?**\n\n**Steps to reproduce:**\n`)}`;

  return (
    <>
      <div className="problem-nav-row">
        <Link to="/" className="back-link">
          <ArrowLeft size={14} strokeWidth={2} /> All problems
        </Link>
        <div className="nav-row-right">
          <a href={issueUrl} target="_blank" rel="noreferrer" className="report-link" title="Report an issue with this problem">
            <AlertCircle size={14} strokeWidth={2} /> Report issue
          </a>
          <a href={problem.leetcodeUrl} target="_blank" rel="noreferrer" className="leetcode-link">
            View on LeetCode ↗
          </a>
        </div>
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
              <a
                href="https://github.com/elberfunez/leetsharp/issues/new?title=Feedback&body=**Type:**%20Bug%20%2F%20Suggestion%0A%0A**Description:**%0A"
                target="_blank"
                rel="noreferrer"
              >
                Feedback
              </a>
            </div>
            <p className="footer-creator">
              Started by Elber Funez —{" "}
              <a href="https://www.linkedin.com/in/elber-funez/" target="_blank" rel="noreferrer" title="Connect on LinkedIn" className="creator-linkedin">
                <FaLinkedin />
              </a>
            </p>
          </div>
          <p className="footer-copy">© 2026 LeetSharp. All rights reserved.</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}
