import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Problem, Solution } from "../domain/types";
import { useStepRunner } from "../engine/useStepRunner";
import { CodePanel } from "../components/CodePanel";
import { VisualPanel } from "../components/VisualPanel";
import { VariablesPanel } from "../components/VariablesPanel";
import { StepControls } from "../components/StepControls";

function renderLabel(label: string) {
  return label.split(/(`[^`]+`)/).map((part, i) =>
    part.startsWith("`") && part.endsWith("`")
      ? <code key={i} className="label-var">{part.slice(1, -1)}</code>
      : part
  );
}

/** Renders a single solution: code + visualization + approach write-up. */
function SolutionView({ solution }: { solution: Solution }) {
  const runner = useStepRunner(solution.steps);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowLeft") runner.prev();
      if (e.key === "ArrowRight") runner.next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [runner]);

  return (
    <>
      <div className="workspace">
        <div className="left-column">
          <CodePanel code={solution.code} activeLines={runner.step.lines} stepIndex={runner.index} />
          <StepControls runner={runner} />
        </div>
        <div className="right-pane">
          <AnimatePresence mode="wait">
            <motion.div
              className="step-label"
              key={runner.index}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <span className="step-op-header">Current Operation</span>
              <span className="step-label-text">{renderLabel(runner.step.label)}</span>
              <motion.span
                key={runner.index}
                className="step-badge"
                initial={{ opacity: 0.3, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.18, type: "spring", stiffness: 400, damping: 25 }}
              >
                {runner.index + 1}<span className="step-badge-total">/{runner.total}</span>
              </motion.span>
            </motion.div>
          </AnimatePresence>
          <VariablesPanel variables={runner.step.variables} />
          <VisualPanel visuals={runner.step.visuals} />
        </div>
      </div>

      <section className="approach">
        <h2>Approach</h2>
        <p>{solution.approach.summary}</p>
        <div className="complexity">
          <div>
            <strong>Time:</strong> {solution.approach.timeComplexity}
          </div>
          <div>
            <strong>Space:</strong> {solution.approach.spaceComplexity}
          </div>
        </div>
        {solution.approach.notes && (
          <>
            <h3>C# notes</h3>
            <ul>
              {solution.approach.notes.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          </>
        )}
      </section>
    </>
  );
}

/** Composes the engine and panels for one problem, with a tab per approach. */
export function ProblemPage({ problem }: { problem: Problem }) {
  const [active, setActive] = useState(0);
  const solution = problem.solutions[active];
  const multiple = problem.solutions.length > 1;

  return (
    <div className="problem-page">
      <header className="problem-header">
        <h1>{problem.title}</h1>
        <span className={`difficulty difficulty-${problem.difficulty.toLowerCase()}`}>
          {problem.difficulty}
        </span>
        <a
          href={(solution.author ?? problem.author).githubUrl}
          target="_blank"
          rel="noreferrer"
          className="author-tag"
        >
          Solved by @{(solution.author ?? problem.author).handle}
        </a>
        <div className="problem-input">
          <span className="problem-input-label">Tracing:</span>
          <code className="problem-input-value">{solution.input}</code>
        </div>
      </header>

      {multiple && (
        <div className="solution-tabs" role="tablist">
          {problem.solutions.map((s, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === active}
              className={`solution-tab${i === active ? " solution-tab-active" : ""}`}
              onClick={() => setActive(i)}
            >
              <span className="solution-tab-index">Approach {i + 1}</span>
              <span className="solution-tab-name">{s.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* key remounts so playback state resets when switching approaches */}
      <SolutionView key={active} solution={solution} />
    </div>
  );
}
