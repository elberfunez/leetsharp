# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Vite dev server
npm run build    # tsc (typecheck, strict) + vite build — run before any PR
npm run preview  # serve the production build
```

There is no test runner and no linter. The quality gate is `tsc` under `strict`
(plus `noUnusedLocals`/`noUnusedParameters`) and **manual step-through verification**
in the browser. "Testing a problem" means opening it in `npm run dev` and confirming
every step's highlighted lines and visuals match the code — there is no automated check
that step data is correct, so this is the only safety net.

## Architecture

LeetSharp is a Vite + React 18 + TypeScript SPA that plays pre-authored, hand-verified
animations of C# LeetCode solutions. **Nothing executes the C# at runtime** — each problem
ships a static array of `Step` frames describing which lines are lit and what every data
structure looks like at that moment.

**Dependencies point inward to the domain layer. The golden rule: keep `src/domain/types.ts`
stable — everything depends on it; it depends on nothing. Components and pages are free to refactor.**

- `domain/types.ts` — the entire contract: `Problem` → `Solution[]` → `Step[]`, and the
  `VisualState` discriminated union. Read this first; the inline comments are authoritative.
- `engine/useStepRunner.ts` — playback state machine (index, play/pause, speed). Pure
  orchestration; knows nothing about rendering.
- `components/` — dumb renderers fed state. `VisualPanel` dispatches each `VisualState` to
  a renderer in `components/visuals/`.
- `problems/<slug>/index.ts` — pure data, one folder per problem. No logic. Registered in
  `problems/index.ts` (order mirrors the NeetCode roadmap).
- `pages/` — composition (`ProblemPage` wires engine + panels).
- `lib/highlighter.ts` — single shared Shiki instance; C# grammar + one theme only, tags
  each line with `data-line="n"` (1-based) so the code panel can spotlight step lines.

### The core contract

A `Step` is one animation frame:

```ts
interface Step {
  lines: number[];                      // 1-based lines of the solution to highlight
  label: string;                        // plain-English narration
  variables?: Record<string, string>;   // values shown in the side panel, stringified
  visuals: VisualState[];               // what to draw this frame
}
```

`VisualState` is a discriminated union keyed by `type`: `array`, `dict`, `set`, `stack`,
`linkedlist`, `tree`, `container`, and `row` (lays out several visuals side by side).
A single step can carry multiple visuals (e.g. Two Sum shows the array AND the dictionary).

Conventions baked into the data: variables hold the **value** at that step (`l: "0"`, not a
type/address); visuals show data-structure state **after** the step's line executes; one
step per *interesting* line (don't step inside library calls).

## Adding a problem

1. `src/problems/<slug>/index.ts` exporting a `Problem` (C# `code` as a string, `steps`,
   `approach`, `author` from `src/problems/authors.ts`). A `Problem` has `solutions[]`;
   multiple solutions render as tabs (e.g. BFS + DFS).
2. Register the import/export in `src/problems/index.ts`, keeping NeetCode-roadmap order.
3. Verify by stepping through it in `npm run dev`.

## Adding a visual type

Touch **four** places, or the type won't render and `tsc` will fail the exhaustive switch:

1. Add a variant to the `VisualState` union in `domain/types.ts`.
2. Write `components/visuals/YourVisual.tsx`.
3. Add a `case` in `VisualPanel.tsx`. **Note:** the dispatch switch is duplicated — once at
   the top level and again inside the `row` branch. Add the case to both.
4. Add styling to `src/index.css`.

See `CONTRIBUTING.md` for the author-facing version of these workflows.
