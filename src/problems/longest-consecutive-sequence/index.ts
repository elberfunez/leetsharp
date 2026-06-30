import type { Problem, VisualState } from "../../domain/types";
import { ELBER } from "../authors";

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
  description: `# Longest Consecutive Sequence

**LeetCode Problem #128**  
**Difficulty:** Medium  
**Topics:** Array, Hash Set, Union Find

## Description

Given an array of integers \`nums\`, return the length of the longest consecutive sequence of elements that can be formed.

A consecutive sequence is a sequence of elements in which each element is exactly 1 greater than the previous element. The elements do not have to be consecutive in the original array.

**You must write an algorithm that runs in O(n) time.**

## Examples

**Example 1:**
\`\`\`
Input: nums = [2,20,4,10,3,4,5]
Output: 4
Explanation: The longest consecutive sequence is [2, 3, 4, 5].
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [0,3,2,5,4,6,1,1]
Output: 7
Explanation: The longest consecutive sequence is [0, 1, 2, 3, 4, 5, 6].
\`\`\`

## Constraints

- \`0 <= nums.length <= 1000\`
- \`-10^9 <= nums[i] <= 10^9\``,
  author: ELBER,
  solutions: [
    {
      name: "Hash Set",
      input: "nums = [2, 20, 4, 10, 3, 4, 5]",
      code,
      steps: [
        {
          lines: [3, 4],
          label: "Dump everything into `hs` (HashSet) — this dedupes (the two 4s collapse) and gives O(1) membership checks: {2, 20, 4, 10, 3, 5}. `counter` = 0.",
          variables: { counter: "0" },
          visuals: [set()],
        },
        {
          lines: [5, 7, 8],
          label: "Consider `num` = 2. Is it the START of a run? Check for 1 — not in `hs` → `isBegOfSeq` = `true`, 2 begins a run.",
          variables: { num: "2", isBegOfSeq: "true" },
          visuals: [set(2), run([2])],
        },
        {
          lines: [12, 14, 15],
          label: "Check `curNum + 1` = 3. It's in `hs` — extend the run. `seqCounter` = 2.",
          variables: { num: "2", curNum: "3", seqCounter: "2" },
          visuals: [set(3), run([2, 3])],
        },
        {
          lines: [14, 15],
          label: "Check `curNum + 1` = 4. It's in `hs` — extend the run. `seqCounter` = 3.",
          variables: { num: "2", curNum: "4", seqCounter: "3" },
          visuals: [set(4), run([2, 3, 4])],
        },
        {
          lines: [14, 15],
          label: "Check `curNum + 1` = 5. It's in `hs` — extend the run. `seqCounter` = 4.",
          variables: { num: "2", curNum: "5", seqCounter: "4" },
          visuals: [set(5), run([2, 3, 4, 5])],
        },
        {
          lines: [12],
          label: "Check `curNum + 1` = 6. Not in `hs` — the run is over. `seqCounter` = 4.",
          variables: { num: "2", curNum: "5", seqCounter: "4" },
          visuals: [set(), run([2, 3, 4, 5])],
        },
        {
          lines: [17],
          label: "This run has length 4 → `counter` = 4.",
          variables: { counter: "4" },
          visuals: [set(), run([2, 3, 4, 5])],
        },
        {
          lines: [5, 7, 8, 12],
          label: "Consider `num` = 20. 19 isn't in `hs` → it's a start. But 21 isn't there either, so the run is just [20], `seqCounter` = 1. `counter` stays 4.",
          variables: { num: "20", seqCounter: "1" },
          visuals: [set(20), run([20])],
        },
        {
          lines: [7],
          label: "Consider `num` = 4. Is 3 in `hs`? YES — so 4 is NOT a start, `isBegOfSeq` = `false`. Skip it entirely.",
          variables: { num: "4", isBegOfSeq: "false" },
          visuals: [set(4)],
        },
        {
          lines: [5, 7, 8, 12],
          label: "Consider `num` = 10. 9 isn't in `hs` → start. 11 isn't either → run [10], `seqCounter` = 1.",
          variables: { num: "10", seqCounter: "1" },
          visuals: [set(10), run([10])],
        },
        {
          lines: [7],
          label: "Consider `num` = 3 (2 is in `hs` → `isBegOfSeq` = `false`, skip) and `num` = 5 (4 is in `hs` → skip). Both are interior to the 2→5 run already counted.",
          variables: { isBegOfSeq: "false" },
          visuals: [set(3)],
        },
        {
          lines: [20],
          label: "Return `counter` = 4 — the longest consecutive run is 2, 3, 4, 5. ✓",
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
