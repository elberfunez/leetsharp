import type { Problem, VisualState } from "../../domain/types";

// Elber's actual solution from LeetcodePractice/Problems/ArraysAndHashing/TwoSum,
// presented in LeetCode submission format.
const code = `public class Solution {
    public int[] TwoSum(int[] nums, int target) {
        Dictionary<int, int> d = new();
        for (int i = 0; i < nums.Length; i++)
        {
            int rem = target - nums[i]; // this is what well check in the hm
            if (d.TryGetValue(rem, out int j))
            {
                return [j, i];
            }
            d[nums[i]] = i;
        }
        return [0,0];
    }
}`;

/** Traced input (Example 1 from the practice repo): nums = [3, 4, 5, 6], target = 7 → [0, 1]. */
const nums = [3, 4, 5, 6];

function numsVisual(overrides?: Partial<Extract<VisualState, { type: "array" }>>): VisualState {
  return { type: "array", title: "nums", items: nums, ...overrides };
}

function dictVisual(
  entries: [number, number][],
  activeKey?: number
): VisualState {
  return { type: "dict", title: "d <value, index>", entries, activeKey };
}

export const twoSum: Problem = {
  slug: "two-sum",
  number: 1,
  title: "Two Sum",
  difficulty: "Easy",
  category: "Arrays & Hashing",
  leetcodeUrl: "https://leetcode.com/problems/two-sum/",
  input: "nums = [3, 4, 5, 6], target = 7",
  code,
  steps: [
    {
      lines: [3],
      label: "Create an empty dictionary. It will remember each value we've seen and the index where we saw it.",
      variables: { target: "7" },
      visuals: [numsVisual(), dictVisual([])],
    },
    {
      lines: [4],
      label: "Start the loop at i = 0. nums[0] is 3.",
      variables: { target: "7", i: "0" },
      visuals: [numsVisual({ pointers: { i: 0 } }), dictVisual([])],
    },
    {
      lines: [6],
      label: "rem is what we'd need to pair with 3: target − nums[0] = 7 − 3 = 4.",
      variables: { target: "7", i: "0", rem: "4" },
      visuals: [numsVisual({ pointers: { i: 0 }, highlighted: [0] }), dictVisual([])],
    },
    {
      lines: [7],
      label: "TryGetValue(4): is 4 in the dictionary? No — it's empty, so this returns false.",
      variables: { target: "7", i: "0", rem: "4" },
      visuals: [numsVisual({ pointers: { i: 0 } }), dictVisual([])],
    },
    {
      lines: [11],
      label: "Remember 3 lives at index 0, in case a later number needs it.",
      variables: { target: "7", i: "0", rem: "4" },
      visuals: [numsVisual({ pointers: { i: 0 } }), dictVisual([[3, 0]], 3)],
    },
    {
      lines: [4],
      label: "Next iteration: i = 1. nums[1] is 4.",
      variables: { target: "7", i: "1" },
      visuals: [numsVisual({ pointers: { i: 1 } }), dictVisual([[3, 0]])],
    },
    {
      lines: [6],
      label: "rem = 7 − 4 = 3.",
      variables: { target: "7", i: "1", rem: "3" },
      visuals: [numsVisual({ pointers: { i: 1 }, highlighted: [1] }), dictVisual([[3, 0]])],
    },
    {
      lines: [7],
      label: "TryGetValue(3): is 3 in the dictionary? Yes! It writes its index into j — we saw 3 at index 0.",
      variables: { target: "7", i: "1", rem: "3", j: "0" },
      visuals: [numsVisual({ pointers: { i: 1 } }), dictVisual([[3, 0]], 3)],
    },
    {
      lines: [9],
      label: "Return [j, i] = [0, 1]. Check: nums[0] + nums[1] = 3 + 4 = 7. ✓",
      variables: { target: "7", i: "1", rem: "3", j: "0", result: "[0, 1]" },
      visuals: [numsVisual({ pointers: { i: 1 }, highlighted: [0, 1] }), dictVisual([[3, 0]], 3)],
    },
  ],
  approach: {
    summary:
      "Brute force checks every pair — O(n²). Instead, make one pass and ask a cheaper question at each element: \"have I already seen the number that would complete this pair?\" A Dictionary<int, int> answers that in O(1). For each nums[i], compute rem = target - nums[i]. If rem is already in the dictionary, the answer is its stored index plus i. Otherwise store nums[i] → i and move on.",
    timeComplexity: "O(n) — one pass, O(1) dictionary lookups.",
    spaceComplexity: "O(n) — worst case stores every element in the dictionary.",
    notes: [
      "TryGetValue(rem, out int j) does the membership check and the read in a single lookup — faster than ContainsKey followed by the indexer, which hashes the key twice.",
      "return [j, i] is a C# 12 collection expression — shorthand for new int[] { j, i }.",
      "We check for rem before storing the current element, so an element can never match itself (e.g. target 8 with a single 4).",
      "LeetCode guarantees exactly one solution, so the final return [0,0] is unreachable — it only exists to satisfy the compiler.",
    ],
  },
};
