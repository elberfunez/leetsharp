import type { Problem, VisualState } from "../../domain/types";
import { ELBER } from "../authors";

// Elber's actual solution from LeetcodePractice/Problems/BinarySearch/BinarySearch,
// presented in LeetCode submission format.
const code = `public class Solution {
    public int Search(int[] nums, int target) {
        int l = 0;
        int r = nums.Length - 1;

        while (l <= r) {
            int m = l + (r - l) / 2;

            if (nums[m] == target) {
                return m;
            } else if (target > nums[m]) {
                l = m + 1;
            } else {
                r = m - 1;
            }
        }

        return -1;
    }
}`;

/** Traced input (Example 1 from the practice repo): nums = [-1, 0, 2, 4, 6, 8], target = 4 → 3. */
const nums = [-1, 0, 2, 4, 6, 8];

function numsVisual(overrides?: Partial<Extract<VisualState, { type: "array" }>>): VisualState {
  return { type: "array", title: "nums (sorted)", items: nums, ...overrides };
}

export const binarySearch: Problem = {
  slug: "binary-search",
  number: 704,
  title: "Binary Search",
  difficulty: "Easy",
  category: "Binary Search",
  leetcodeUrl: "https://leetcode.com/problems/binary-search/",
  author: ELBER,
  solutions: [
    {
      name: "Iterative",
      input: "nums = [-1, 0, 2, 4, 6, 8], target = 4",
      code,
      steps: [
    {
      lines: [3, 4],
      label: "Start with the whole array in play: l at the first index, r at the last.",
      variables: { target: "4", l: "0", r: "5" },
      visuals: [numsVisual({ pointers: { l: 0, r: 5 } })],
    },
    {
      lines: [6, 7],
      label: "Search space is still open. Compute the midpoint to decide which half to keep.",
      variables: { target: "4", l: "0", r: "5", m: "2" },
      visuals: [numsVisual({ pointers: { l: 0, r: 5, m: 2 }, highlighted: [2] })],
    },
    {
      lines: [9],
      label: "Is nums[2] the target? 2 ≠ 4 — no.",
      variables: { target: "4", l: "0", r: "5", m: "2" },
      visuals: [numsVisual({ pointers: { l: 0, r: 5, m: 2 }, highlighted: [2] })],
    },
    {
      lines: [11, 12],
      label: "nums[m] is smaller than the target — answer must be to the right. Discard the left half.",
      variables: { target: "4", l: "3", r: "5" },
      visuals: [numsVisual({ pointers: { l: 3, r: 5 }, dimmed: [0, 1, 2] })],
    },
    {
      lines: [6, 7],
      label: "Search space still open. New midpoint lands in the right half.",
      variables: { target: "4", l: "3", r: "5", m: "4" },
      visuals: [numsVisual({ pointers: { l: 3, r: 5, m: 4 }, highlighted: [4], dimmed: [0, 1, 2] })],
    },
    {
      lines: [9],
      label: "Is nums[4] the target? 6 ≠ 4 — no.",
      variables: { target: "4", l: "3", r: "5", m: "4" },
      visuals: [numsVisual({ pointers: { l: 3, r: 5, m: 4 }, highlighted: [4], dimmed: [0, 1, 2] })],
    },
    {
      lines: [13, 14],
      label: "nums[m] is bigger than the target — answer must be to the left. Discard the right half.",
      variables: { target: "4", l: "3", r: "3" },
      visuals: [numsVisual({ pointers: { l: 3, r: 3 }, dimmed: [0, 1, 2, 4, 5] })],
    },
    {
      lines: [6, 7],
      label: "One element left in the search space. Midpoint lands right on it.",
      variables: { target: "4", l: "3", r: "3", m: "3" },
      visuals: [
        numsVisual({ pointers: { l: 3, r: 3, m: 3 }, highlighted: [3], dimmed: [0, 1, 2, 4, 5] }),
      ],
    },
    {
      lines: [9, 10],
      label: "nums[m] matches the target. Return m.",
      variables: { target: "4", l: "3", r: "3", m: "3", result: "3" },
      visuals: [
        numsVisual({ pointers: { m: 3 }, highlighted: [3], dimmed: [0, 1, 2, 4, 5] }),
      ],
    },
  ],
  approach: {
    summary:
      "The array is sorted, so one comparison against the middle element tells you which half the target lives in — and lets you throw the other half away. Keep two pointers l and r marking the live search space; each loop iteration halves it. The space shrinks from 6 → 3 → 1 elements here, which is why the runtime is logarithmic.",
    timeComplexity: "O(log n) — the search space halves every iteration.",
    spaceComplexity: "O(1) — three ints, no extra storage.",
    notes: [
      "m = l + (r - l) / 2 instead of (l + r) / 2 — the naive version can overflow int when l and r are both huge; this form never does.",
      "The loop condition is l <= r, not l < r — when l == r there's still one unexamined element, and skipping it would miss a target sitting exactly there.",
      "Integer division in C# truncates, so m naturally floors — no Math.Floor needed.",
      "When the target is absent, l eventually crosses past r and the loop exits to return -1 (his Example 2: target 3 → -1).",
    ],
  },
    },
  ],
};
