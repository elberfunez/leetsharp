import { BrowserRouter, Link, Navigate, Route, Routes, useParams } from "react-router-dom";
import { Sun, Moon, ArrowLeft } from "lucide-react";
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
      <Link to="/" className="back-link">
        <ArrowLeft size={14} strokeWidth={2} /> All problems
      </Link>
      {/* key remounts the page so playback state resets when switching problems */}
      <ProblemPage key={problem.slug} problem={problem} />
    </>
  );
}

function ThemeToggle() {
  const [theme, setTheme] = useTheme();
  return (
    <button
      className="theme-toggle"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? <Sun size={16} strokeWidth={2} /> : <Moon size={16} strokeWidth={2} />}
    </button>
  );
}

export default function App() {
  useTheme(); // initialize theme on mount
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="topbar">
          <Link to="/" className="topbar-link">
            <img className="logo" src="/logo.png" alt="LeetSharp" />
          </Link>
          <span className="tagline">LeetCode, visualized for C# developers</span>
          <ThemeToggle />
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/problems/:slug" element={<ProblemRoute />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
