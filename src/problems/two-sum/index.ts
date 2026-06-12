import type { Problem, VisualState } from "../../domain/types";

const code = `public class Solution {
    public int[] TwoSum(int[] nums, int target) {
        var seen = new Dictionary<int, int>();
        for (int i = 0; i < nums.Length; i++)
        {
            int complement = target - nums[i];
            if (seen.ContainsKey(complement))
            {
                return new[] { seen[complement], i };
            }
            seen[nums[i]] = i;
        }
        return Array.Empty<int>();
    }
}`;

/** Traced input: nums = [3, 4, 5, 6], target = 9. Expected answer: [1, 2]. */
const nums = [3, 4, 5, 6];

function numsVisual(overrides?: Partial<Extract<VisualState, { type: "array" }>>): VisualState {
  return { type: "array", title: "nums", items: nums, ...overrides };
}

export const twoSum: Problem = {
  slug: "two-sum",
  title: "Two Sum",
  difficulty: "Easy",
  leetcodeUrl: "https://leetcode.com/problems/two-sum/",
  input: "nums = [3, 4, 5, 6], target = 9",
  code,
  steps: [
    {
      lines: [3],
      label: "Create an empty dictionary. It will remember each value we've seen and the index where we saw it.",
      variables: { target: "9" },
      visuals: [numsVisual(), { type: "dict", title: "seen <value, index>", entries: [] }],
    },
    {
      lines: [4],
      label: "Start the loop at i = 0. nums[0] is 3.",
      variables: { target: "9", i: "0" },
      visuals: [
        numsVisual({ pointers: { i: 0 } }),
        { type: "dict", title: "seen <value, index>", entries: [] },
      ],
    },
    {
      lines: [6],
      label: "The complement is what we'd need to pair with 3: target − nums[0] = 9 − 3 = 6.",
      variables: { target: "9", i: "0", complement: "6" },
      visuals: [
        numsVisual({ pointers: { i: 0 }, highlighted: [0] }),
        { type: "dict", title: "seen <value, index>", entries: [] },
      ],
    },
    {
      lines: [7],
      label: "Is 6 already in the dictionary? No — we haven't seen it yet.",
      variables: { target: "9", i: "0", complement: "6" },
      visuals: [
        numsVisual({ pointers: { i: 0 } }),
        { type: "dict", title: "seen <value, index>", entries: [] },
      ],
    },
    {
      lines: [11],
      label: "Remember 3 lives at index 0, in case a later number needs it.",
      variables: { target: "9", i: "0", complement: "6" },
      visuals: [
        numsVisual({ pointers: { i: 0 } }),
        { type: "dict", title: "seen <value, index>", entries: [[3, 0]], activeKey: 3 },
      ],
    },
    {
      lines: [4],
      label: "Next iteration: i = 1. nums[1] is 4.",
      variables: { target: "9", i: "1" },
      visuals: [
        numsVisual({ pointers: { i: 1 } }),
        { type: "dict", title: "seen <value, index>", entries: [[3, 0]] },
      ],
    },
    {
      lines: [6],
      label: "complement = 9 − 4 = 5.",
      variables: { target: "9", i: "1", complement: "5" },
      visuals: [
        numsVisual({ pointers: { i: 1 }, highlighted: [1] }),
        { type: "dict", title: "seen <value, index>", entries: [[3, 0]] },
      ],
    },
    {
      lines: [7],
      label: "Is 5 in the dictionary? No — only 3 so far.",
      variables: { target: "9", i: "1", complement: "5" },
      visuals: [
        numsVisual({ pointers: { i: 1 } }),
        { type: "dict", title: "seen <value, index>", entries: [[3, 0]] },
      ],
    },
    {
      lines: [11],
      label: "Remember 4 lives at index 1.",
      variables: { target: "9", i: "1", complement: "5" },
      visuals: [
        numsVisual({ pointers: { i: 1 } }),
        {
          type: "dict",
          title: "seen <value, index>",
          entries: [
            [3, 0],
            [4, 1],
          ],
          activeKey: 4,
        },
      ],
    },
    {
      lines: [4],
      label: "Next iteration: i = 2. nums[2] is 5.",
      variables: { target: "9", i: "2" },
      visuals: [
        numsVisual({ pointers: { i: 2 } }),
        {
          type: "dict",
          title: "seen <value, index>",
          entries: [
            [3, 0],
            [4, 1],
          ],
        },
      ],
    },
    {
      lines: [6],
      label: "complement = 9 − 5 = 4.",
      variables: { target: "9", i: "2", complement: "4" },
      visuals: [
        numsVisual({ pointers: { i: 2 }, highlighted: [2] }),
        {
          type: "dict",
          title: "seen <value, index>",
          entries: [
            [3, 0],
            [4, 1],
          ],
        },
      ],
    },
    {
      lines: [7],
      label: "Is 4 in the dictionary? Yes! We saw it at index 1.",
      variables: { target: "9", i: "2", complement: "4" },
      visuals: [
        numsVisual({ pointers: { i: 2 } }),
        {
          type: "dict",
          title: "seen <value, index>",
          entries: [
            [3, 0],
            [4, 1],
          ],
          activeKey: 4,
        },
      ],
    },
    {
      lines: [9],
      label: "Return [seen[4], i] = [1, 2]. Check: nums[1] + nums[2] = 4 + 5 = 9. ✓",
      variables: { target: "9", i: "2", complement: "4", result: "[1, 2]" },
      visuals: [
        numsVisual({ pointers: { i: 2 }, highlighted: [1, 2] }),
        {
          type: "dict",
          title: "seen <value, index>",
          entries: [
            [3, 0],
            [4, 1],
          ],
          activeKey: 4,
        },
      ],
    },
  ],
  approach: {
    summary:
      "Brute force checks every pair — O(n²). Instead, make one pass and ask a cheaper question at each element: \"have I already seen the number that would complete this pair?\" A Dictionary<int, int> answers that in O(1). For each nums[i], compute complement = target - nums[i]. If the complement is already in the dictionary, the answer is its stored index plus i. Otherwise store nums[i] → i and move on.",
    timeComplexity: "O(n) — one pass, O(1) dictionary lookups.",
    spaceComplexity: "O(n) — worst case stores every element in the dictionary.",
    notes: [
      "Dictionary<TKey, TValue> is C#'s hash map — average O(1) ContainsKey, indexer get/set.",
      "seen.TryGetValue(complement, out int j) does the membership check and the read in a single lookup — slightly faster than ContainsKey followed by the indexer.",
      "We check for the complement before storing the current element, so an element can never match itself (e.g. target 8 with a single 4).",
      "LeetCode guarantees exactly one solution, so the final return is unreachable; Array.Empty<int>() avoids allocating a new empty array just to satisfy the compiler.",
    ],
  },
};
