import type { Problem, VisualState } from "../../domain/types";
import { ELBER } from "../authors";

const code = `public class Solution {
    public int CharacterReplacement(string s, int k) {
        Dictionary<char, int> d = new();
        int l = 0;
        int result = 0;
        for (int r = 0; r < s.Length; r++)
        {
            if (!d.ContainsKey(s[r]))
            {
                d[s[r]] = 1;
            }
            else
            {
                d[s[r]]++;
            }
            while ((r - l + 1) - d.Values.Max() > k)
            {
                d[s[l]]--;
                l++;
            }
            result = Math.Max(result, (r - l + 1));
        }
        return result;
    }
}`;

/** Traced input: s = "BAAAB", k = 1 → 4.
 *  Chosen because the window grows cleanly to 4, then the second 'B'
 *  pushes swaps to 2 > k — forcing one shrink — before settling at 4. */
const chars = ["B", "A", "A", "A", "B"];

function win(l: number, r: number): VisualState {
  const highlighted: number[] = [];
  for (let i = l; i <= r; i++) highlighted.push(i);
  return { type: "array", title: "s", items: chars, pointers: { l, r }, highlighted };
}

function counts(entries: [string, number][], activeKey?: string): VisualState {
  return { type: "dict", title: "d <char, count>", entries, activeKey };
}

function swapPreview(l: number, r: number, dominant: string, swapsNeeded: number): VisualState {
  const windowStr = chars.slice(l, r + 1).map(() => dominant).join("");
  const valid = swapsNeeded <= 1;
  return {
    type: "dict",
    title: "if we swapped now",
    entries: [
      ["dominant char", dominant],
      ["swaps needed", `${swapsNeeded} / k=1`],
      ["window becomes", windowStr],
    ],
    activeKey: valid ? "window becomes" : "swaps needed",
  };
}

export const longestRepeatingCharacterReplacement: Problem = {
  slug: "longest-repeating-character-replacement",
  number: 424,
  title: "Longest Repeating Character Replacement",
  difficulty: "Medium",
  category: "Sliding Window",
  leetcodeUrl: "https://leetcode.com/problems/longest-repeating-character-replacement/",
  description: `# Longest Repeating Character Replacement

**Difficulty:** Medium  
**Topic:** Sliding Window

---

## Description

You are given a string \`s\` consisting of only uppercase English characters and an integer \`k\`. You can choose up to \`k\` characters of the string and replace them with any other uppercase English character.

After performing at most \`k\` replacements, return the length of the **longest substring** which contains only one distinct character.

---

## Examples

### Example 1:

\`\`\`
Input: s = "XYYX", k = 2

Output: 4

Explanation: Either replace the 'X's with 'Y's to get "YYYY", or replace the 'Y's with 'X's to get "XXXX".
\`\`\`

### Example 2:

\`\`\`
Input: s = "AAABABB", k = 1

Output: 5

Explanation: Replace the 'B' at index 5 with 'A' to get "AAAAABB" then take "AAAAA".
Or replace 'A' at index 2 to get "AABABB" then take "AABAA" which has length 5.
\`\`\`

---

## Constraints

- \`1 <= s.length <= 1000\`
- \`0 <= k <= s.length\`
- \`s\` consists of only uppercase English characters`,
  author: ELBER,
  solutions: [
    {
      name: "Sliding Window",
      input: 's = "BAAAB", k = 1',
      code,
      steps: [
        {
          lines: [3, 4, 5],
          label: "Initialize: `d` tracks each character's count inside the window, `l` = 0 (left edge), `result` = 0. `k` = 1 swap allowed.",
          variables: { k: "1", l: "0", result: "0" },
          visuals: [
            { type: "array", title: "s", items: chars, pointers: { l: 0 } },
            counts([]),
          ],
        },
        // ── r = 0, s[r] = 'B' ──────────────────────────────────────
        {
          lines: [6, 8, 10],
          label: "`r` = 0 → `s[r]` = 'B'. New character — `d['B']` = 1.",
          variables: { k: "1", l: "0", r: "0" },
          visuals: [win(0, 0), counts([["B", 1]], "B")],
        },
        {
          lines: [16, 21],
          label: "Window \"B\": only one character, zero swaps needed. Valid. `result` = 1.",
          variables: { k: "1", l: "0", r: "0", result: "1" },
          visuals: [win(0, 0), counts([["B", 1]]), swapPreview(0, 0, "B", 0)],
        },
        // ── r = 1, s[r] = 'A' ──────────────────────────────────────
        {
          lines: [6, 8, 10],
          label: "`r` = 1 → `s[r]` = 'A'. New character — `d['A']` = 1.",
          variables: { k: "1", l: "0", r: "1" },
          visuals: [win(0, 1), counts([["B", 1], ["A", 1]], "A")],
        },
        {
          lines: [16, 21],
          label: "Window \"BA\": B and A tied at 1 each. Swaps needed = 2 − 1 = 1 ≤ k. Swap the 'A' → \"BB\". Valid. `result` = 2.",
          variables: { k: "1", l: "0", r: "1", result: "2" },
          visuals: [win(0, 1), counts([["B", 1], ["A", 1]]), swapPreview(0, 1, "B", 1)],
        },
        // ── r = 2, s[r] = 'A' ──────────────────────────────────────
        {
          lines: [6, 12, 14],
          label: "`r` = 2 → `s[r]` = 'A'. Already in `d` — `d['A']` becomes 2.",
          variables: { k: "1", l: "0", r: "2" },
          visuals: [win(0, 2), counts([["B", 1], ["A", 2]], "A")],
        },
        {
          lines: [16, 21],
          label: "Window \"BAA\": 'A' is now dominant (count 2). Swaps needed = 3 − 2 = 1 ≤ k. Swap the lone 'B' → \"AAA\". Valid. `result` = 3.",
          variables: { k: "1", l: "0", r: "2", result: "3" },
          visuals: [win(0, 2), counts([["B", 1], ["A", 2]]), swapPreview(0, 2, "A", 1)],
        },
        // ── r = 3, s[r] = 'A' ──────────────────────────────────────
        {
          lines: [6, 12, 14],
          label: "`r` = 3 → `s[r]` = 'A'. `d['A']` becomes 3.",
          variables: { k: "1", l: "0", r: "3" },
          visuals: [win(0, 3), counts([["B", 1], ["A", 3]], "A")],
        },
        {
          lines: [16, 21],
          label: "Window \"BAAA\": 'A' dominates (count 3). Swaps needed = 4 − 3 = 1 ≤ k. Swap the 'B' → \"AAAA\". Valid. `result` = 4.",
          variables: { k: "1", l: "0", r: "3", result: "4" },
          visuals: [win(0, 3), counts([["B", 1], ["A", 3]]), swapPreview(0, 3, "A", 1)],
        },
        // ── r = 4, s[r] = 'B' — OVER BUDGET ───────────────────────
        {
          lines: [6, 12, 14],
          label: "`r` = 4 → `s[r]` = 'B'. `d['B']` becomes 2.",
          variables: { k: "1", l: "0", r: "4" },
          visuals: [win(0, 4), counts([["B", 2], ["A", 3]], "B")],
        },
        {
          lines: [16],
          label: "Window \"BAAAB\" (size 5): swaps needed = 5 − 3 = 2 > k=1. Over budget — must shrink from the left.",
          variables: { k: "1", l: "0", r: "4" },
          visuals: [win(0, 4), counts([["B", 2], ["A", 3]]), swapPreview(0, 4, "A", 2)],
        },
        {
          lines: [18, 19],
          label: "Remove `s[l]` = `s[0]` = 'B' from `d`, then `l`++. `d['B']` drops to 1. `l` = 1.",
          variables: { k: "1", l: "1", r: "4" },
          visuals: [win(1, 4), counts([["B", 1], ["A", 3]], "B")],
        },
        {
          lines: [21],
          label: "Window \"AAAB\" (size 4): swaps needed = 4 − 3 = 1 ≤ k. Swap the trailing 'B' → \"AAAA\". Valid. `result` stays 4.",
          variables: { k: "1", l: "1", r: "4", result: "4" },
          visuals: [win(1, 4), counts([["B", 1], ["A", 3]]), swapPreview(1, 4, "A", 1)],
        },
        {
          lines: [23],
          label: "`r` reached the end. Best window was \"BAAA\" or \"AAAB\" — both become \"AAAA\" with 1 swap. Return `result` = 4. ✓",
          variables: { result: "4" },
          visuals: [win(1, 4), counts([["B", 1], ["A", 3]]), swapPreview(1, 4, "A", 1)],
        },
      ],
      approach: {
        summary:
          "Slide a window and ask: can this window become all-one-character using at most k replacements? That holds when (window length − count of its most frequent character) ≤ k — those are the minority characters you'd swap. Grow the window on the right; whenever the swap budget is exceeded, shrink from the left. The largest valid window is the answer.",
        timeComplexity: "O(n · 26) as written, because d.Values.Max() rescans the counts each step. Caching the running max makes it true O(n).",
        spaceComplexity: "O(1) — at most 26 uppercase letters live in the dictionary.",
        notes: [
          "The crux: windowLength − maxFreq counts the non-majority characters — exactly how many swaps make the window uniform. Keep that ≤ k.",
          "d.Values.Max() is the costly line — it rescans every entry each iteration. Tracking the max as you increment counts removes the 26× factor.",
          "d[s[l]]-- as l advances keeps the dictionary in sync with exactly the characters currently inside the window.",
          "result only ever grows, so the final value is the longest window that was valid at any point.",
        ],
      },
    },
  ],
};
