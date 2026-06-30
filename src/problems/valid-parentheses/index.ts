import type { Problem, VisualState } from "../../domain/types";
import { ELBER } from "../authors";

// Elber's actual solution from LeetcodePractice/Problems/Stack/ValidParentheses,
// presented in LeetCode submission format.
const code = `public class Solution {
    public bool IsValid(string s) {
        if (s.Length % 2 != 0) return false; // must be even length

        var stack = new Stack<char>();
        var pairs = new Dictionary<char, char> {
            { ')', '(' },
            { ']', '[' },
            { '}', '{' }
        };

        foreach (char c in s) {
            if (pairs.TryGetValue(c, out char opening))
            {
                // closing bracket
                if (stack.Count == 0 || stack.Pop() != opening)
                {
                    return false;
                }
            }
            else
            {
                // opening bracket
                stack.Push(c);
            }
        }

        return stack.Count == 0;
    }
}`;

/** Traced input (Example 2 from the practice repo): s = "([{}])" → true. */
const chars = ["(", "[", "{", "}", "]", ")"];

function sVisual(pointerIndex?: number, highlighted?: number[]): VisualState {
  return {
    type: "array",
    title: "s",
    items: chars,
    pointers: pointerIndex !== undefined ? { c: pointerIndex } : undefined,
    highlighted,
  };
}

function stackVisual(items: string[], topActive = false): VisualState {
  return { type: "stack", title: "stack", items, topActive };
}

export const validParentheses: Problem = {
  slug: "valid-parentheses",
  number: 20,
  title: "Valid Parentheses",
  difficulty: "Easy",
  category: "Stack",
  leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/",
  description: `# Valid Parentheses

**Difficulty:** Easy  
**Topic:** Stack

---

## Description

You are given a string \`s\` consisting of the following characters: \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`.

The input string \`s\` is valid if and only if:

1. Every open bracket is closed by the same type of close bracket.
2. Open brackets are closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

Return \`true\` if \`s\` is a valid string, and \`false\` otherwise.

---

## Examples

### Example 1:

\`\`\`
Input: s = "[]"

Output: true
\`\`\`

### Example 2:

\`\`\`
Input: s = "([{}])"

Output: true
\`\`\`

### Example 3:

\`\`\`
Input: s = "[(])"

Output: false

Explanation: The brackets are not closed in the correct order.
\`\`\`

---

## Constraints

- \`1 <= s.length <= 1000\`
- \`s\` consists of characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\``,
  author: ELBER,
  solutions: [
    {
      name: "Stack",
      input: 's = "([{}])"',
      code,
      steps: [
    {
      lines: [3],
      label: "Quick rejection: 6 characters is even, so it COULD be valid. (An odd-length string never can be — brackets come in pairs.)",
      visuals: [sVisual(), stackVisual([])],
    },
    {
      lines: [5, 6, 7, 8, 9, 10],
      label: "Set up an empty stack and the `pairs` lookup, which maps each closing bracket to the opener it requires: `)` → `(`, `]` → `[`, `}` → `{`.",
      visuals: [sVisual(), stackVisual([])],
    },
    {
      lines: [12],
      label: "First char: `c` = `(`.",
      visuals: [sVisual(0), stackVisual([])],
    },
    {
      lines: [13, 24],
      label: "`(` isn't a key in `pairs` (only closers are) — it's an opening bracket. Push `c` onto the stack; it waits for its match.",
      visuals: [sVisual(0), stackVisual(["("], true)],
    },
    {
      lines: [12],
      label: "`c` = `[`.",
      visuals: [sVisual(1), stackVisual(["("])],
    },
    {
      lines: [13, 24],
      label: "`[` is an opening bracket — push `c`.",
      visuals: [sVisual(1), stackVisual(["(", "["], true)],
    },
    {
      lines: [12],
      label: "`c` = `{`.",
      visuals: [sVisual(2), stackVisual(["(", "["])],
    },
    {
      lines: [13, 24],
      label: "`{` is an opening bracket — push `c`. Three brackets waiting, newest on top.",
      visuals: [sVisual(2), stackVisual(["(", "[", "{"], true)],
    },
    {
      lines: [12],
      label: "`c` = `}` — our first closing bracket.",
      visuals: [sVisual(3), stackVisual(["(", "[", "{"])],
    },
    {
      lines: [13, 16],
      label: "`pairs['}']` says we need `{`. Pop the top: it IS `{` — match! The innermost pair closed correctly.",
      visuals: [sVisual(3, [2, 3]), stackVisual(["(", "["], true)],
    },
    {
      lines: [12],
      label: "`c` = `]`.",
      visuals: [sVisual(4), stackVisual(["(", "["])],
    },
    {
      lines: [13, 16],
      label: "`pairs[']']` needs `[`. Pop the top: it's `[` — match!",
      visuals: [sVisual(4, [1, 4]), stackVisual(["("], true)],
    },
    {
      lines: [12],
      label: "`c` = `)`.",
      visuals: [sVisual(5), stackVisual(["("])],
    },
    {
      lines: [13, 16],
      label: "`pairs[')']` needs `(`. Pop the top: it's `(` — match! Stack is now empty.",
      visuals: [sVisual(5, [0, 5]), stackVisual([])],
    },
    {
      lines: [28],
      label: "Every opener found its closer in the right order — `stack.Count` == 0 → return `true`. ✓",
      variables: { result: "true" },
      visuals: [sVisual(), stackVisual([])],
    },
  ],
  approach: {
    summary:
      "Brackets close in reverse order of how they opened — that last-in-first-out pattern IS a stack. Push every opening bracket. When a closing bracket arrives, the top of the stack must be its partner: pop and compare. Any mismatch, a close with nothing open, or leftover openers at the end means invalid.",
    timeComplexity: "O(n) — one pass, O(1) stack ops per char.",
    spaceComplexity: "O(n) — worst case all openers, e.g. \"(((((\".",
    notes: [
      "The even-length check up front is a free early exit for strings like \"(()\" — an odd length can never pair up, so it fails before any real work.",
      "stack.Count == 0 || stack.Pop() != opening relies on short-circuit evaluation — if the stack is empty, Pop() never runs, so no InvalidOperationException.",
      "Keying pairs by the CLOSING bracket makes TryGetValue double as the is-this-a-closer test — one dictionary lookup classifies the char AND fetches the required opener.",
      "The final return stack.Count == 0 catches leftover openers — \"((\" sails through the loop but still isn't valid.",
    ],
  },
    },
  ],
};
