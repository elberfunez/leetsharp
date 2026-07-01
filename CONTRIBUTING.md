# Contributing to LeetSharp

Thanks for helping make algorithm learning better for C# developers. There are two ways in.

## The easy way: submit a solution in the app (no git required)

1. Sign in with GitHub on the site.
2. Browse the **Unsolved** board for a problem that needs solving (or propose one).
3. Click **Solve this** and fill out the short form: the LeetCode/NeetCode **URL** and your
   **C# solution** (a description is optional). That's it — submit for review.

A maintainer builds the step-by-step animation, complexity notes, and approach, then
publishes it with **you credited as the author**. You can track status on **My Submissions**.

This is the recommended path for most contributors: you provide the solution, we do the
visualization craft.

## The full way: author the whole animated problem (git)

If you want to author the entire experience — steps, visuals, and all — do it directly in
code and open a PR. This is also the workflow a maintainer follows when building out a
submitted solution.

## Adding a problem

1. **Solve it.** Make sure you have a clean, working C# solution for any LeetCode problem.
2. **Create the folder:** `src/problems/<slug>/index.ts` (e.g., `src/problems/3sum/index.ts`).
3. **Define the `Problem` object:**
   - `author`: import your author constant from `src/problems/authors.ts` (add yourself there if you're new — see below)
   - `code`: your C# solution as a string, pasted from your submission
   - `steps`: an array tracing the algorithm on a real example (see existing problems for structure)
   - `approach`: summary, complexity, C#-specific notes
   - `description`: **required** — the original problem statement as Markdown. `tsc` will fail the build if it's
     missing. See [Adding the problem statement](#adding-the-problem-statement) below
4. **Register it:** add the import and export to `src/problems/index.ts`. Keep the comment order in sync with the [NeetCode roadmap](https://neetcode.io/roadmap).
5. **Test:** `npm run dev`, click to your problem, step through it, verify every step maps to your code.
6. **Open a PR** with a clear title: "Add [Problem Name] with [visual type]" (e.g., "Add 3Sum with ArrayVisual").

## Adding the problem statement

`description` is a required `Markdown` string on `Problem` (`src/domain/types.ts`). It powers the
**"See Problem"** button on the problem page, which opens a slide-over panel with the original question — every
problem must ship the statement it's solving, so a PR that omits it won't type-check (`tsc` enforces this).

```typescript
description: `## Description

Given an integer array \`nums\`, return \`true\` if any value appears more than once in the array, otherwise return \`false\`.

## Examples

### Example 1:

\`\`\`
Input: nums = [1, 2, 3, 3]

Output: true
\`\`\`

## Constraints

- \`0 <= nums.length <= 10^5\``,
```

**Rules the renderer expects** (`src/components/ProblemStatement.tsx` is a small hand-rolled Markdown
renderer — no parser dependency — so keep statements regular):

- Start the body at `## Description` — don't repeat the title or difficulty; those are already rendered from
  the `title`/`difficulty` fields. Leading `#`/`**Difficulty:**`-style preambles before the first `##` heading
  are stripped automatically, so it's fine to paste the full statement including those — just don't rely on them
  rendering.
- Supported blocks: `##`/`###` headings, fenced code blocks, `---` rules, `- ` bullet lists, and plain
  paragraphs. Inline `` `code` `` and `**bold**` are supported.
- Fenced blocks tagged ` ```csharp ` (e.g., interface signatures in "Design a ..." problems) get real syntax
  highlighting via the same Shiki instance as the solution panel. Fenced blocks with `Input:`/`Output:`/`Explanation:`
  lines (LeetCode's usual example format) get colored automatically — don't add language tags to those, leave
  the fence bare (` ``` `).
- Stop before any section that duplicates the app's own Approach panel — `## Approach`, `## Complexity
  Analysis`, `## Key Observations`, `## Notes`, `## Hints`, etc. Genuine LeetCode sections like `## Follow-up`
  should stay.
- Escape backticks (`` \` ``) and `${` inside the template literal, since `description` is a JS template string.

## Adding yourself as an author

Open `src/problems/authors.ts` and add an entry:

```typescript
export const YOUR_HANDLE: Author = {
  name: "Your Name",
  handle: "your-github-handle",
  githubUrl: "https://github.com/your-github-handle",
};
```

Then set `author: YOUR_HANDLE` on the `Problem` object. Your handle will appear as a clickable tag on the problem page and your name will be credited on the homepage counter.

If you're adding an alternative solution to an existing problem, set `author` on the `Solution` object instead — it will override the problem-level author for that specific approach tab.

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
  label: "Search space isn't empty. Compute the midpoint to split it in half.",
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
- [ ] `description` is set with the original problem statement, rendered correctly in the "See Problem" panel
- [ ] Every step is manually verified against the code
- [ ] C# solution is idiomatic (uses language strengths, not a literal translation from another lang)
- [ ] Approach notes mention C#-specific considerations

Questions? Open an issue — we build this together.
