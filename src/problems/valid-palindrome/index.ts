import type { Problem, VisualState } from "../../domain/types";
import { ELBER } from "../authors";

// Elber's actual solution from LeetcodePractice/Problems/TwoPointers/IsPalindrome,
// presented in LeetCode submission format.
const code = `public class Solution {
    public bool IsPalindrome(string s) {
        int l = 0;
        int r = s.Length - 1;
        while (l < r)
        {
            while (l < r && !char.IsLetterOrDigit(s[l])) l++;
            while (l < r && !char.IsLetterOrDigit(s[r])) r--;
            if (char.ToLower(s[l]) != char.ToLower(s[r]))
            {
                return false;
            }
            l++;
            r--;
        }
        return true;
    }
}`;

/** Traced input (Example 3 from the practice repo): "No lemon, no melon" → true. */
const chars = ["N", "o", "·", "l", "e", "m", "o", "n", ",", "·", "n", "o", "·", "m", "e", "l", "o", "n"];

function arr(l: number, r: number, highlighted?: number[]): VisualState {
  return { type: "array", title: 's  (· = space, ignored)', items: chars, pointers: { l, r }, highlighted };
}

export const validPalindrome: Problem = {
  slug: "valid-palindrome",
  number: 125,
  title: "Valid Palindrome",
  difficulty: "Easy",
  category: "Two Pointers",
  leetcodeUrl: "https://leetcode.com/problems/valid-palindrome/",
  author: ELBER,
  solutions: [
    {
      name: "Two Pointers",
      input: '"No lemon, no melon"',
      code,
      steps: [
        {
          lines: [3, 4],
          label: "`l` at the first character, `r` at the last. We compare inward, ignoring anything that isn't a letter or digit.",
          variables: { l: "0", r: "17" },
          visuals: [arr(0, 17)],
        },
        {
          lines: [7, 8, 9],
          label: "`s[0]`='N', `s[17]`='n'. Both are letters, and `char.ToLower` makes them equal — match.",
          variables: { l: "0", r: "17" },
          visuals: [arr(0, 17, [0, 17])],
        },
        {
          lines: [13, 14],
          label: "Match confirmed — step both pointers inward: `l` = 1, `r` = 16.",
          variables: { l: "1", r: "16" },
          visuals: [arr(1, 16)],
        },
        {
          lines: [9, 13, 14],
          label: "`s[l]` and `s[r]` are both 'o' — match. Step both pointers inward.",
          variables: { l: "2", r: "15" },
          visuals: [arr(1, 16, [1, 16])],
        },
        {
          lines: [7],
          label: "`s[2]` is a space — the inner while skips it, advancing `l` to 3. `r` stays at 15.",
          variables: { l: "3", r: "15" },
          visuals: [arr(3, 15)],
        },
        {
          lines: [9, 13, 14],
          label: "'l' on both sides — match. Step inward.",
          variables: { l: "4", r: "14" },
          visuals: [arr(3, 15, [3, 15])],
        },
        {
          lines: [9, 13, 14],
          label: "'e' on both sides — match. Step inward.",
          variables: { l: "5", r: "13" },
          visuals: [arr(4, 14, [4, 14])],
        },
        {
          lines: [9, 13, 14],
          label: "'m' on both sides — match. Step inward.",
          variables: { l: "6", r: "12" },
          visuals: [arr(5, 13, [5, 13])],
        },
        {
          lines: [8],
          label: "`s[12]` is a space — the inner while skips it, dropping `r` to 11. `l` stays at 6.",
          variables: { l: "6", r: "11" },
          visuals: [arr(6, 11)],
        },
        {
          lines: [9, 13, 14],
          label: "'o' on both sides — match. Step inward.",
          variables: { l: "7", r: "10" },
          visuals: [arr(6, 11, [6, 11])],
        },
        {
          lines: [9, 13, 14],
          label: "'n' on both sides — match. Step inward.",
          variables: { l: "8", r: "9" },
          visuals: [arr(7, 10, [7, 10])],
        },
        {
          lines: [7],
          label: "`s[8]`=',' is skipped, advancing `l` to 9 — the same spot as `r`. The pointers have met in the middle.",
          variables: { l: "9", r: "9" },
          visuals: [arr(9, 9)],
        },
        {
          lines: [5, 16],
          label: "`l` is no longer less than `r` — every mirrored pair matched. Return true. ✓",
          variables: { result: "true" },
          visuals: [arr(9, 9, [9])],
        },
      ],
      approach: {
        summary:
          "Walk one pointer in from each end, comparing characters that mirror each other. Skip anything that isn't alphanumeric, and compare case-insensitively. The moment two real characters disagree it's not a palindrome; if the pointers meet without a mismatch, it is. No cleaned-up copy of the string is ever allocated — the filtering happens in place.",
        timeComplexity: "O(n) — each pointer sweeps across the string once.",
        spaceComplexity: "O(1) — comparisons happen on the original string, no second buffer.",
        notes: [
          "The inner while loops carry their own l < r guard so they can't run off the end if the string is all punctuation.",
          "char.IsLetterOrDigit and char.ToLower are built-ins that handle the 'alphanumeric only, case-insensitive' rules without manual ASCII math.",
          "Doing it in place keeps it O(1) space — the tempting s.Where(char.IsLetterOrDigit) one-liner allocates a whole new string.",
          "Comparing with ToLower on both sides avoids a separate normalization pass over the input.",
        ],
      },
    },
  ],
};
