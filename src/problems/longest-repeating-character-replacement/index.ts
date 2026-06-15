import type { Problem, VisualState } from "../../domain/types";
import { ELBER } from "../authors";

// Elber's actual solution from LeetcodePractice/Problems/SlidingWindow/LongestRepeatingCharacterReplacement,
// presented in LeetCode submission format.
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

/** Traced input (Example 1 from the practice repo): s = "XYYX", k = 2 → 4. */
const chars = ["X", "Y", "Y", "X"];

function win(l: number, r: number): VisualState {
  const highlighted = [];
  for (let i = l; i <= r; i++) highlighted.push(i);
  return { type: "array", title: "s (window highlighted)", items: chars, pointers: { l, r }, highlighted };
}

function counts(entries: [string, number][], activeKey?: string): VisualState {
  return { type: "dict", title: "d <char, count>", entries, activeKey };
}

export const longestRepeatingCharacterReplacement: Problem = {
  slug: "longest-repeating-character-replacement",
  number: 424,
  title: "Longest Repeating Character Replacement",
  difficulty: "Medium",
  category: "Sliding Window",
  leetcodeUrl: "https://leetcode.com/problems/longest-repeating-character-replacement/",
  author: ELBER,
  solutions: [
    {
      name: "Sliding Window",
      input: 's = "XYYX", k = 2',
      code,
      steps: [
        {
          lines: [3, 4, 5],
          label: "Track each character's count inside the window (d), the window's left edge l, and the best window length (result).",
          variables: { k: "2", l: "0", result: "0" },
          visuals: [
            { type: "array", title: "s (window highlighted)", items: chars, pointers: { l: 0 } },
            counts([]),
          ],
        },
        {
          lines: [6, 8, 10],
          label: "r = 0: 'X' is new → d['X'] = 1.",
          variables: { k: "2", l: "0", r: "0" },
          visuals: [win(0, 0), counts([["X", 1]], "X")],
        },
        {
          lines: [16, 21],
          label: "Window \"X\" (length 1): all one character already, zero replacements needed. Within budget — valid window. result = 1.",
          variables: { k: "2", l: "0", r: "0", result: "1" },
          visuals: [win(0, 0), counts([["X", 1]])],
        },
        {
          lines: [6, 8, 10],
          label: "r = 1: 'Y' is new → d['Y'] = 1.",
          variables: { k: "2", l: "0", r: "1" },
          visuals: [win(0, 1), counts([["X", 1], ["Y", 1]], "Y")],
        },
        {
          lines: [16, 21],
          label: "Window \"XY\" (length 2): one replacement turns it uniform. Within budget of 2 — valid. result = 2.",
          variables: { k: "2", l: "0", r: "1", result: "2" },
          visuals: [win(0, 1), counts([["X", 1], ["Y", 1]])],
        },
        {
          lines: [6, 12, 14],
          label: "r = 2: 'Y' seen before → d['Y'] becomes 2.",
          variables: { k: "2", l: "0", r: "2" },
          visuals: [win(0, 2), counts([["X", 1], ["Y", 2]], "Y")],
        },
        {
          lines: [16, 21],
          label: "Window \"XYY\" (length 3): Y appears twice — replacing the lone X makes it all-Y. One swap, within budget. result = 3.",
          variables: { k: "2", l: "0", r: "2", result: "3" },
          visuals: [win(0, 2), counts([["X", 1], ["Y", 2]])],
        },
        {
          lines: [6, 12, 14],
          label: "r = 3: 'X' seen before → d['X'] becomes 2.",
          variables: { k: "2", l: "0", r: "3" },
          visuals: [win(0, 3), counts([["X", 2], ["Y", 2]], "X")],
        },
        {
          lines: [16, 21],
          label: "Window \"XYYX\" (length 4): X and Y each appear twice. Two replacements make it uniform — exactly at the budget. Valid! result = 4.",
          variables: { k: "2", l: "0", r: "3", result: "4" },
          visuals: [win(0, 3), counts([["X", 2], ["Y", 2]])],
        },
        {
          lines: [23],
          label: "Loop done. The whole string can become one repeated letter with ≤ 2 swaps → return 4. ✓",
          variables: { result: "4" },
          visuals: [win(0, 3), counts([["X", 2], ["Y", 2]])],
        },
      ],
      approach: {
        summary:
          "Slide a window and ask: can this window become all-one-character using at most k replacements? That holds exactly when (window length − count of its most frequent character) ≤ k — those are the minority characters you'd swap. Grow the window on the right; whenever that budget is exceeded, shrink from the left. The largest window that ever satisfies it is the answer.",
        timeComplexity: "O(n · 26) as written, because d.Values.Max() rescans the counts each step. Caching the running max makes it true O(n).",
        spaceComplexity: "O(1) — at most 26 uppercase letters live in the dictionary.",
        notes: [
          "The crux: windowLength − maxFreq counts the non-majority characters in the window — exactly how many swaps make it uniform. Keep that ≤ k.",
          "d.Values.Max() is the costly line — it rescans every entry each iteration. Tracking the max as you increment counts removes the 26× factor.",
          "d[s[l]]-- as l advances keeps the dictionary in sync with exactly the characters currently inside the window.",
          "result only ever grows, so the final value is the longest window that was valid at any point.",
        ],
      },
    },
  ],
};
