import { getProblem } from "./problems";
import { ProblemPage } from "./pages/ProblemPage";

export default function App() {
  const problem = getProblem("two-sum")!;
  return (
    <div className="app">
      <nav className="topbar">
        <img className="logo" src="/logo.png" alt="LeetSharp" />
        <span className="tagline">LeetCode, visualized for C# developers</span>
      </nav>
      <ProblemPage problem={problem} />
    </div>
  );
}
