import type { Problem, VisualState } from "../../domain/types";

// Elber's actual solution from LeetcodePractice/Problems/ArraysAndHashing/LongestConsecutive,
// presented in LeetCode submission format.
const code = `public class Solution {
    public int LongestConsecutive(int[] nums) {
        HashSet<int> hs = new(nums);
        int counter = 0;
        foreach (int num in hs)
        {
            bool isBegOfSeq = !hs.Contains(num - 1);
            if (isBegOfSeq)
            {
                int seqCounter = 1;
                int curNum = num;
                while (hs.Contains(curNum + 1))
                {
                    seqCounter++;
                    curNum = curNum + 1;
                }
                counter = Math.Max(counter, seqCounter);
            }
        }
        return counter;
    }
}`;

/** Traced input (Example 1 from the practice repo): nums = [2, 20, 4, 10, 3, 4, 5] → 4
 *  (the run 2, 3, 4, 5). The set dedupes the two 4s. */
function set(activeItem?: number): VisualState {
  return { type: "set", title: "hs (unique values)", items: [2, 20, 4, 10, 3, 5], activeItem };
}

function run(items: number[]): VisualState {
  return { type: "array", title: "current run", items, highlighted: items.map((_, i) => i) };
}

export const longestConsecutiveSequence: Problem = {
  slug: "longest-consecutive-sequence",
  number: 128,
  title: "Longest Consecutive Sequence",
  difficulty: "Medium",
  category: "Arrays & Hashing",
  leetcodeUrl: "https://leetcode.com/problems/longest-consecutive-sequence/",
  solutions: [
    {
      name: "Hash Set",
      input: "nums = [2, 20, 4, 10, 3, 4, 5]",
      code,
      steps: [
        {
          lines: [3, 4],
          label: "Dump everything into a HashSet — this dedupes (the two 4s collapse) and gives O(1) membership checks: {2, 20, 4, 10, 3, 5}. counter = 0.",
          variables: { counter: "0" },
          visuals: [set()],
        },
        {
          lines: [5, 7, 8],
          label: "Consider 2. Is it the START of a run? Check for 1 — not in the set → yes, 2 begins a run.",
          variables: { num: "2", isBegOfSeq: "true" },
          visuals: [set(2), run([2])],
        },
        {
          lines: [12, 14, 15],
          label: "Walk upward: 3 in the set? yes (run = 2). 4? yes (3). 5? yes (4). 6? no → stop.",
          variables: { num: "2", seqCounter: "4", curNum: "5" },
          visuals: [set(), run([2, 3, 4, 5])],
        },
        {
          lines: [17],
          label: "This run has length 4 → counter = 4.",
          variables: { counter: "4" },
          visuals: [set(), run([2, 3, 4, 5])],
        },
        {
          lines: [5, 7, 8, 12],
          label: "Consider 20. 19 isn't in the set → it's a start. But 21 isn't there either, so the run is just [20], length 1. counter stays 4.",
          variables: { num: "20", seqCounter: "1" },
          visuals: [set(20), run([20])],
        },
        {
          lines: [7],
          label: "Consider 4. Is 3 in the set? YES — so 4 is NOT a start, it sits inside a run. Skip it entirely.",
          variables: { num: "4", isBegOfSeq: "false" },
          visuals: [set(4)],
        },
        {
          lines: [5, 7, 8, 12],
          label: "Consider 10. 9 isn't present → start. 11 isn't either → run [10], length 1.",
          variables: { num: "10", seqCounter: "1" },
          visuals: [set(10), run([10])],
        },
        {
          lines: [7],
          label: "Consider 3 (2 is present → skip) and 5 (4 is present → skip). Both are interior to the 2→5 run already counted.",
          variables: { isBegOfSeq: "false" },
          visuals: [set(3)],
        },
        {
          lines: [20],
          label: "Return counter = 4 — the longest consecutive run is 2, 3, 4, 5. ✓",
          variables: { result: "4" },
          visuals: [set(), run([2, 3, 4, 5])],
        },
      ],
      approach: {
        summary:
          "Put every value in a HashSet for O(1) lookups. A number is worth exploring only if it's the START of a run — that is, num − 1 isn't present. From each start, walk upward (num+1, num+2, …) counting until the set runs out. Because every number is only ever walked as part of the one run it belongs to, the whole thing is O(n) despite the nested-looking loop.",
        timeComplexity: "O(n) — each value is touched at most twice: once by the foreach, once while walking its run.",
        spaceComplexity: "O(n) for the set.",
        notes: [
          "The isBegOfSeq guard is what keeps it linear: runs are only counted from their smallest element, so none is ever re-walked from the middle.",
          "new HashSet<int>(nums) builds the set straight from the array AND dedupes (the input's two 4s become one).",
          "Without the 'start only' check this degrades to O(n²) — every element would re-scan its entire run.",
          "Sorting then scanning is the O(n log n) alternative; the set buys O(n) time at the cost of O(n) space.",
        ],
      },
    },
  ],
};
