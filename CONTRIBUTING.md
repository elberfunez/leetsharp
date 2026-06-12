# Contributing to LeetSharp

Thanks for helping make algorithm learning better for C# devs. Here's how.

## Adding a problem

1. **Solve it.** Make sure you have a clean, working C# solution for a Blind 75 problem.
2. **Create the folder:** `src/problems/<slug>/index.ts` (e.g., `src/problems/3sum/index.ts`).
3. **Define the `Problem` object:**
   - `code`: your C# solution as a string, pasted from your submission
   - `steps`: an array tracing the algorithm on a real example (see existing problems for structure)
   - `approach`: summary, complexity, C#-specific notes
4. **Register it:** add the import and export to `src/problems/index.ts`.
5. **Test:** `npm run dev`, click to your problem, step through it, verify every step maps to your code.
6. **Open a PR** with a clear title: "Add [Problem Name] with [visual type]" (e.g., "Add 3Sum with ArrayVisual").

## Authoring steps

The `Step` schema is:

```typescript
interface Step {
  lines: number[];                    // 1-based line numbers to highlight
  label: string;                      // Plain English: what's happening this frame
  variables?: Record<string, string>; // Current variable values
  visuals: VisualState[];             // What to draw
}
```

Example: in BinarySearch, when we set `m = l + (r - l) / 2`, the step is:

```typescript
{
  lines: [7],
  label: "l ≤ r, so the search space isn't empty. Middle: m = 0 + (5 − 0) / 2 = 2.",
  variables: { l: "0", r: "5", m: "2" },
  visuals: [numsVisual({ pointers: { l: 0, r: 5, m: 2 }, highlighted: [2] })]
}
```

**Tips:**
- One step per "interesting" line of code — don't step inside library calls.
- Variables show the VALUE at that step (not type/address), stringified: `l: "0"`, not `l: 0`.
- Visualizations show data structure state **after** this step's code executes.

## Adding a visual component

If you need a new data structure (e.g., a graph with highlighted edges):

1. Add a `VisualState` variant to `src/domain/types.ts`.
2. Write the renderer in `src/components/visuals/YourVisual.tsx` — it receives the visual state and renders it.
3. Add a case in `VisualPanel.tsx` to dispatch to your renderer.
4. Add CSS to `src/index.css` for the styling.
5. Use it in problem step data by adding a step with `type: "your-type"`.

## Code style

- No special rules — match the existing code (TypeScript, React, Tailwind-ish CSS).
- Comments only when the WHY is non-obvious.
- Keep the domain types stable (at the center of the architecture) — components/pages are free to refactor.

## PR checklist

- [ ] Code builds without errors or warnings (`npm run build`)
- [ ] TypeScript is strict (`tsc` passes)
- [ ] Every step is manually verified against the code
- [ ] C# solution is idiomatic (uses language strengths, not a literal translation from another lang)
- [ ] Approach notes mention C#-specific considerations

Questions? Open an issue — we build this together.
