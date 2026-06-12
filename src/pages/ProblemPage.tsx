import { AnimatePresence, motion } from "framer-motion";
import type { Problem } from "../domain/types";
import { useStepRunner } from "../engine/useStepRunner";
import { CodePanel } from "../components/CodePanel";
import { VisualPanel } from "../components/VisualPanel";
import { VariablesPanel } from "../components/VariablesPanel";
import { StepControls } from "../components/StepControls";

/** Composes the engine and panels for one problem. */
export function ProblemPage({ problem }: { problem: Problem }) {
  const runner = useStepRunner(problem.steps);

  return (
    <div className="problem-page">
      <header className="problem-header">
        <h1>{problem.title}</h1>
        <span className={`difficulty difficulty-${problem.difficulty.toLowerCase()}`}>
          {problem.difficulty}
        </span>
        <a href={problem.leetcodeUrl} target="_blank" rel="noreferrer" className="leetcode-link">
          View on LeetCode ↗
        </a>
      </header>

      <div className="problem-input">Tracing: {problem.input}</div>

      <div className="workspace">
        <CodePanel code={problem.code} activeLines={runner.step.lines} />
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
              {runner.step.label}
            </motion.div>
          </AnimatePresence>
          <VariablesPanel variables={runner.step.variables} />
          <VisualPanel visuals={runner.step.visuals} />
        </div>
      </div>

      <StepControls runner={runner} />

      <section className="approach">
        <h2>Approach</h2>
        <p>{problem.approach.summary}</p>
        <div className="complexity">
          <div>
            <strong>Time:</strong> {problem.approach.timeComplexity}
          </div>
          <div>
            <strong>Space:</strong> {problem.approach.spaceComplexity}
          </div>
        </div>
        {problem.approach.notes && (
          <>
            <h3>C# notes</h3>
            <ul>
              {problem.approach.notes.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
