import { BrowserRouter, Link, Navigate, Route, Routes, useParams } from "react-router-dom";
import { getProblem } from "./problems";
import { HomePage } from "./pages/HomePage";
import { ProblemPage } from "./pages/ProblemPage";

function ProblemRoute() {
  const { slug } = useParams();
  const problem = slug ? getProblem(slug) : undefined;
  if (!problem) return <Navigate to="/" replace />;
  return (
    <>
      <Link to="/" className="back-link">
        ← All problems
      </Link>
      {/* key remounts the page so playback state resets when switching problems */}
      <ProblemPage key={problem.slug} problem={problem} />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="topbar">
          <Link to="/" className="topbar-link">
            <img className="logo" src="/logo.png" alt="LeetSharp" />
          </Link>
          <span className="tagline">LeetCode, visualized for C# developers</span>
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
