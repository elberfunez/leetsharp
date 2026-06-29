# LeetSharp ⚡

**LeetCode, visualized for C# developers.**

Curated C# solutions with step-by-step animated visualizations. Step through a solution
line by line and watch the data structures change — pointers glide across arrays,
dictionary entries appear as they're stored, the matching pair lights up when it's found.

No accounts. No submissions. Free. Open source.

## Running locally

```bash
npm install
npm run dev
```

## How it works

Every problem ships with **pre-authored step data**: a sequence of frames describing
which lines of the C# solution are executing and what every data structure looks like at
that moment. Nothing is executed or AI-generated at runtime — step data is authored once
(AI-assisted), reviewed by a human, and committed as plain TypeScript. That keeps the
visualizations fast, free to serve, and — most importantly — correct.

Community contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) to add your solutions.

## Architecture

Dependencies point inward. The domain types are the center; everything else depends on
them and not on each other.

```
src/
├── domain/        Core types: Problem, Step, VisualState. Depends on nothing.
├── engine/        useStepRunner — playback state machine (index, play/pause, speed).
│                  Knows nothing about rendering.
├── components/    Dumb renderers. Receive state, draw it.
│   ├── CodePanel        Shiki-highlighted C# with the current step's lines spotlighted
│   ├── VisualPanel      Dispatches each VisualState to its renderer
│   ├── VariablesPanel   Current variable values as chips
│   ├── StepControls     Transport bar: prev/play/next, scrubber, speed
│   └── visuals/         One component per VisualState type (array, dict, ...)
├── problems/      Pure data. One folder per problem: C# source, step frames, approach
│                  write-up. No logic. The registry lives in problems/index.ts.
├── pages/         Composition — ProblemPage wires engine + panels together.
└── lib/           Infrastructure (Shiki highlighter singleton).
```

### The core contract

A `Step` is one frame of the animation:

```ts
interface Step {
  lines: number[];                      // 1-based lines of the solution to highlight
  label: string;                        // plain-English narration
  variables?: Record<string, string>;   // current variable values
  visuals: VisualState[];               // what to draw (array + dict, a tree, ...)
}
```

`VisualState` is a discriminated union — one variant per visual component. Today:
`array` (cells, named pointers, highlighted indices) and `dict` (key→value pills,
active key). NeetCode problems cluster into roughly 7 visual families; each new family is
one new variant + one new renderer, and every problem in that family becomes pure data.

### Adding a problem

1. Create `src/problems/<slug>/index.ts` exporting a `Problem`: the C# solution as a
   string, the step frames, and the approach write-up.
2. Register it in `src/problems/index.ts` (organized by the NeetCode roadmap).
3. If it needs a visual type that doesn't exist yet, add a variant to `VisualState`
   and a renderer in `components/visuals/`.

Step data can be drafted with an LLM (give it the solution and the `Step` schema),
but **every frame gets hand-verified before it ships** — accuracy is the product.

For detailed contribution guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

## Tech

- [Vite](https://vite.dev) + React 18 + TypeScript (strict)
- [Shiki](https://shiki.style) — C# syntax highlighting
- [Framer Motion](https://www.framer.com/motion/) — step transitions

## Roadmap

- [x] **Phase 1** — Visualizer engine + Two Sum end to end
- [x] **Phase 2** — Routing + problem list; 35+ problems across NeetCode roadmap topics
- [ ] **Phase 3** — Expand coverage: more problems across all roadmap categories
- [ ] **Phase 4** — Polish: keyboard shortcuts, shareable step links, mobile

Want to help? [Contribute a problem!](CONTRIBUTING.md)
