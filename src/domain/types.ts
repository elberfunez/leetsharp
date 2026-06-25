/**
 * Domain layer — the contract the whole engine is built around.
 * Depends on nothing. Everything else depends on this.
 */

/** A single visual to render during a step. A step can show several at once
 *  (e.g. Two Sum shows the input array AND the dictionary). */
export type VisualState =
  | ArrayVisualState
  | DictVisualState
  | SetVisualState
  | StackVisualState
  | LinkedListVisualState
  | TreeVisualState
  | ContainerVisualState
  | RowVisualState;

export interface RowVisualState {
  type: "row";
  visuals: VisualState[];
}

export interface ArrayVisualState {
  type: "array";
  /** Panel heading, e.g. "nums" */
  title?: string;
  items: (number | string)[];
  /** pointer name -> index it points at, e.g. { l: 0, r: 5, m: 2 } */
  pointers?: Record<string, number>;
  /** indices to emphasize (matched pair, current window, ...) */
  highlighted?: number[];
  /** indices to fade out (e.g. the half discarded by binary search) */
  dimmed?: number[];
}

export interface DictVisualState {
  type: "dict";
  /** Panel heading, e.g. "d <value, index>" */
  title?: string;
  entries: [key: number | string, value: number | string][];
  /** key being read or written this step */
  activeKey?: number | string;
}

export interface SetVisualState {
  type: "set";
  /** Panel heading, e.g. "charSet" */
  title?: string;
  items: (number | string)[];
  /** item being added, removed, or tested this step */
  activeItem?: number | string;
}

export interface StackVisualState {
  type: "stack";
  /** Panel heading, e.g. "stack" */
  title?: string;
  /** bottom first — last item renders on top */
  items: (number | string)[];
  /** emphasize the top item (being pushed or popped) */
  topActive?: boolean;
}

export interface LinkedListVisualState {
  type: "linkedlist";
  title?: string;
  /** node values in their ORIGINAL order — nodes never move on screen,
   *  only the arrows between them change */
  values: (number | string)[];
  /** next[i] = index of the node that node i points to, or null.
   *  Arrows between neighbors render as → or ← from this. */
  next: (number | null)[];
  /** pointer name -> node index. Pointers that are null this step are
   *  omitted here and shown in the variables panel instead. */
  pointers?: Record<string, number>;
  highlighted?: number[];
  /** "above" places pointer labels above the node row (leaves the bottom clean for cycle arcs).
   *  Defaults to "below". */
  pointerPosition?: "above" | "below";
  /** [from, to] index pairs that represent cycle back-links — rendered in yellow
   *  with a shallower arc so they're visually distinct from reversed links. */
  cycleEdges?: [number, number][];
  /** When true the visual will play a one-shot celebration after ~800 ms:
   *  the list re-renders in its reversed reading order (new head → … → tail)
   *  with forward arcs so the viewer can "read" the result naturally. */
  celebrate?: boolean;
}

export interface ContainerVisualState {
  type: "container";
  title?: string;
  heights: number[];
  l: number;
  r: number;
}

export interface TreeVisualNode {
  id: string;
  value: number | string;
  left?: TreeVisualNode | null;
  right?: TreeVisualNode | null;
}

export interface TreeVisualState {
  type: "tree";
  title?: string;
  root: TreeVisualNode;
  /** node ids being processed this step */
  highlighted?: string[];
  /** node ids already fully processed (rendered dimmed) */
  visited?: string[];
  /** node id -> small badge text, e.g. its depth */
  annotations?: Record<string, string>;
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

export interface Author {
  name: string;
  handle: string;
  githubUrl: string;
}

/** One way to solve a problem. A problem can ship several (e.g. BFS + DFS),
 *  rendered as tabs. Single-solution problems just have one entry. */
export interface Solution {
  /** Who wrote this solution — defaults to the problem author if omitted. */
  author?: Author;
  /** Short tab label, e.g. "Hash Map", "BFS", "Two Pointers" */
  name: string;
  /** Human-readable description of the traced input, e.g. "nums = [3,4,5,6], target = 7" */
  input: string;
  /** The C# solution source. Line numbers in steps refer to this, 1-based. */
  code: string;
  steps: Step[];
  approach: Approach;
}

export interface Problem {
  slug: string;
  /** LeetCode problem number */
  number: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  /** NeetCode roadmap category, e.g. "Arrays & Hashing" */
  category: string;
  leetcodeUrl: string;
  /** Default author for all solutions on this problem. */
  author: Author;
  /** One or more approaches. Multiple → rendered as tabs. */
  solutions: Solution[];
}
