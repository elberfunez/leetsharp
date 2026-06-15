import type { Problem, VisualState } from "../../domain/types";
import { ELBER } from "../authors";

// Elber's actual solution from LeetcodePractice/Problems/TwoPointers/TwoIntegerSumII,
// presented in LeetCode submission format.
const code = `public class Solution {
    public int[] TwoSum(int[] numbers, int target) {
        int l = 0;
        int r = numbers.Length - 1;
        while (l < r)
        {
            if (target < numbers[r] + numbers[l])
            {
                r--;
            }
            else if (target > numbers[r] + numbers[l])
            {
                l++;
            }
            else
            {
                return [l + 1, r + 1];
            }
        }
        return [0, 0];
    }
}`;

/** Traced input (Example 2 from the practice repo): numbers = [2, 7, 11, 15], target = 9 → [1, 2]. */
const numbers = [2, 7, 11, 15];

function arr(pointers: Record<string, number>, highlighted?: number[]): VisualState {
  return { type: "array", title: "numbers (sorted, 1-indexed)", items: numbers, pointers, highlighted };
}

export const twoIntegerSumII: Problem = {
  slug: "two-integer-sum-ii",
  number: 167,
  title: "Two Integer Sum II",
  difficulty: "Medium",
  category: "Two Pointers",
  leetcodeUrl: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
  author: ELBER,
  solutions: [
    {
      name: "Two Pointers",
      input: "numbers = [2, 7, 11, 15], target = 9",
      code,
      steps: [
        {
          lines: [3, 4],
          label: "The array is sorted. Put l at the first number and r at the last, then squeeze them toward each other.",
          variables: { target: "9", l: "0", r: "3" },
          visuals: [arr({ l: 0, r: 3 })],
        },
        {
          lines: [5, 6, 7],
          label: "numbers[l] + numbers[r] = 2 + 15 = 17. Compare to target 9 — the sum is too big.",
          variables: { target: "9", l: "0", r: "3", sum: "17" },
          visuals: [arr({ l: 0, r: 3 }, [0, 3])],
        },
        {
          lines: [9],
          label: "Sum overshot, so the largest number (15) is too big to ever be part of the answer. Drop it: move r left to 2.",
          variables: { target: "9", l: "0", r: "2" },
          visuals: [arr({ l: 0, r: 2 })],
        },
        {
          lines: [7],
          label: "Now 2 + 11 = 13. Still bigger than 9.",
          variables: { target: "9", l: "0", r: "2", sum: "13" },
          visuals: [arr({ l: 0, r: 2 }, [0, 2])],
        },
        {
          lines: [9],
          label: "Too big again → move r left to 1.",
          variables: { target: "9", l: "0", r: "1" },
          visuals: [arr({ l: 0, r: 1 })],
        },
        {
          lines: [7, 11],
          label: "2 + 7 = 9. Not greater, not less — it equals the target.",
          variables: { target: "9", l: "0", r: "1", sum: "9" },
          visuals: [arr({ l: 0, r: 1 }, [0, 1])],
        },
        {
          lines: [17],
          label: "Return the 1-based indices [l + 1, r + 1] = [1, 2]. ✓",
          variables: { target: "9", result: "[1, 2]" },
          visuals: [arr({ l: 0, r: 1 }, [0, 1])],
        },
      ],
      approach: {
        summary:
          "Because the array is sorted, the sum of the two ends tells you which way to move. Too big? The right number is too large — move r left. Too small? The left number is too small — move l right. Each comparison eliminates one number from consideration, so a single pass finds the pair with no nested loop and no hash map.",
        timeComplexity: "O(n) — the two pointers only ever move toward each other, never back.",
        spaceComplexity: "O(1) — just two indices.",
        notes: [
          "Sorted input is the entire trick — it's what lets one comparison decide which pointer to move. The original unsorted Two Sum (#1) can't do this and reaches for a Dictionary instead.",
          "This problem is 1-indexed, so the answer is [l + 1, r + 1], not [l, r] — a classic off-by-one trap.",
          "return [l + 1, r + 1] is a C# 12 collection expression, shorthand for new int[] { l + 1, r + 1 }.",
          "l < r is strict, so the same element is never used twice and the pointers can't cross.",
        ],
      },
    },
  ],
};
