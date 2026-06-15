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

/** Traced input: "taco cat" → true.
 *  8 characters: t(0) a(1) c(2) o(3) space(4) c(5) a(6) t(7)
 *  The space at index 4 is skipped, pointers meet in the middle. */
const chars = ["t", "a", "c", "o", " ", "c", "a", "t"];

function arr(l: number, r: number, highlighted?: number[]): VisualState {
  return { type: "array", title: 's  (space at index 4 is skipped)', items: chars, pointers: { l, r }, highlighted };
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
      input: '"taco cat"',
      code,
      steps: [
        {
          lines: [3, 4],
          label: "`l` at the first character, `r` at the last. We'll compare inward, skipping anything that isn't a letter or digit.",
          variables: { l: "0", r: "7" },
          visuals: [arr(0, 7)],
        },
        {
          lines: [7, 8, 9],
          label: "`s[0]`='t' and `s[7]`='t' — both letters, `char.ToLower` makes them equal. Match.",
          variables: { l: "0", r: "7" },
          visuals: [arr(0, 7, [0, 7])],
        },
        {
          lines: [13, 14],
          label: "Match — step both pointers inward: `l` = 1, `r` = 6.",
          variables: { l: "1", r: "6" },
          visuals: [arr(1, 6)],
        },
        {
          lines: [7, 8, 9],
          label: "`s[1]`='a' and `s[6]`='a' — match.",
          variables: { l: "1", r: "6" },
          visuals: [arr(1, 6, [1, 6])],
        },
        {
          lines: [13, 14],
          label: "Match — step inward: `l` = 2, `r` = 5.",
          variables: { l: "2", r: "5" },
          visuals: [arr(2, 5)],
        },
        {
          lines: [7, 8, 9],
          label: "`s[2]`='c' and `s[5]`='c' — match.",
          variables: { l: "2", r: "5" },
          visuals: [arr(2, 5, [2, 5])],
        },
        {
          lines: [13, 14],
          label: "Match — step inward: `l` = 3, `r` = 4.",
          variables: { l: "3", r: "4" },
          visuals: [arr(3, 4)],
        },
        {
          lines: [8],
          label: "`s[4]` is a space — not alphanumeric. The inner while skips it, dropping `r` to 3.",
          variables: { l: "3", r: "3" },
          visuals: [arr(3, 3)],
        },
        {
          lines: [5, 16],
          label: "`l` = 3 is no longer less than `r` = 3 — the pointers met. Every mirrored pair matched. Return `true`. ✓",
          variables: { result: "true" },
          visuals: [arr(3, 3, [3])],
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
