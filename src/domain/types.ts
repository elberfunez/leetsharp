/**
 * Domain layer — the contract the whole engine is built around.
 * Depends on nothing. Everything else depends on this.
 */

/** A single visual to render during a step. A step can show several at once
 *  (e.g. Two Sum shows the input array AND the dictionary). */
export type VisualState =
  | ArrayVisualState
  | DictVisualState;

export interface ArrayVisualState {
  type: "array";
  /** Panel heading, e.g. "nums" */
  title?: string;
  items: (number | string)[];
  /** pointer name -> index it points at, e.g. { i: 2 } */
  pointers?: Record<string, number>;
  /** indices to emphasize (e.g. the matched pair) */
  highlighted?: number[];
}

export interface DictVisualState {
  type: "dict";
  /** Panel heading, e.g. "seen <value, index>" */
  title?: string;
  entries: [key: number | string, value: number | string][];
  /** key being read or written this step */
  activeKey?: number | string;
}

/** One frame of the visualization. */
export interface Step {
  /** 1-based line numbers of the solution to highlight */
  lines: number[];
  /** Plain-English narration of what this step does */
  label: string;
  /** Current variable values shown in the side panel */
  variables?: Record<string, string>;
  visuals: VisualState[];
}

export interface Approach {
  summary: string;
  timeComplexity: string;
  spaceComplexity: string;
  /** C#-specific tips, gotchas, alternatives */
  notes?: string[];
}

export interface Problem {
  slug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  leetcodeUrl: string;
  /** Human-readable description of the traced input, e.g. "nums = [3,4,5,6], target = 9" */
  input: string;
  /** The C# solution source. Line numbers in steps refer to this, 1-based. */
  code: string;
  steps: Step[];
  approach: Approach;
}
