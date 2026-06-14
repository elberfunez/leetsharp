import type { Problem, VisualState } from "../../domain/types";

// Elber's actual solution from LeetcodePractice/Problems/ArraysAndHashing/TopKFrequentElements,
// presented in LeetCode submission format.
const code = `public class Solution {
    public int[] TopKFrequent(int[] nums, int k) {
        Dictionary<int, int> freq = new();
        foreach (int num in nums)
        {
            if (freq.ContainsKey(num))
            {
                freq[num]++;
            }
            else
            {
                freq[num] = 1;
            }
        }
        return freq.OrderByDescending(kvp => kvp.Value)
            .Take(k)
            .Select(x => x.Key)
            .ToArray();
    }
}`;

/** Traced input (Example 1 from the practice repo): nums = [1, 2, 2, 3, 3, 3], k = 2 → [3, 2]. */
const nums = [1, 2, 2, 3, 3, 3];

function arr(i: number, highlighted?: number[]): VisualState {
  return { type: "array", title: "nums", items: nums, pointers: { num: i }, highlighted };
}

function freq(entries: [number, number][], activeKey?: number): VisualState {
  return { type: "dict", title: "freq <num, count>", entries, activeKey };
}

export const topKFrequentElements: Problem = {
  slug: "top-k-frequent-elements",
  number: 347,
  title: "Top K Frequent Elements",
  difficulty: "Medium",
  category: "Arrays & Hashing",
  leetcodeUrl: "https://leetcode.com/problems/top-k-frequent-elements/",
  solutions: [
    {
      name: "Count + Sort",
      input: "nums = [1, 2, 2, 3, 3, 3], k = 2",
      code,
      steps: [
        {
          lines: [3],
          label: "First, count how many times each number appears.",
          variables: { k: "2" },
          visuals: [arr(0), freq([])],
        },
        {
          lines: [4, 6, 12],
          label: "num = 1, new → freq[1] = 1.",
          visuals: [arr(0, [0]), freq([[1, 1]], 1)],
        },
        {
          lines: [6, 12],
          label: "num = 2, new → freq[2] = 1.",
          visuals: [arr(1, [1]), freq([[1, 1], [2, 1]], 2)],
        },
        {
          lines: [6, 8],
          label: "num = 2 again → freq[2] = 2.",
          visuals: [arr(2, [2]), freq([[1, 1], [2, 2]], 2)],
        },
        {
          lines: [6, 12],
          label: "num = 3, new → freq[3] = 1.",
          visuals: [arr(3, [3]), freq([[1, 1], [2, 2], [3, 1]], 3)],
        },
        {
          lines: [6, 8],
          label: "num = 3 → freq[3] = 2.",
          visuals: [arr(4, [4]), freq([[1, 1], [2, 2], [3, 2]], 3)],
        },
        {
          lines: [6, 8],
          label: "num = 3 → freq[3] = 3. Final counts: 1 appears 1×, 2 appears 2×, 3 appears 3×.",
          visuals: [arr(5, [5]), freq([[1, 1], [2, 2], [3, 3]], 3)],
        },
        {
          lines: [15],
          label: "Sort the entries by count, highest first: 3 (3×), 2 (2×), 1 (1×).",
          visuals: [freq([[3, 3], [2, 2], [1, 1]])],
        },
        {
          lines: [16, 17, 18],
          label: "Take the top k = 2 and keep just their keys → [3, 2]. ✓",
          variables: { result: "[3, 2]" },
          visuals: [
            freq([[3, 3], [2, 2], [1, 1]]),
            { type: "array", title: "result", items: [3, 2], highlighted: [0, 1] },
          ],
        },
      ],
      approach: {
        summary:
          "Count frequencies in one pass with a dictionary, then return the k keys with the highest counts. The simplest selection is to sort the entries by count descending and take the first k. (The optimal trick is bucket sort by frequency for true O(n), but a sort is clean and usually fast enough.)",
        timeComplexity: "O(n log n) — dominated by sorting the distinct counts. Bucket sort would be O(n).",
        spaceComplexity: "O(n) for the frequency map.",
        notes: [
          "freq.OrderByDescending(...).Take(k).Select(...).ToArray() is a LINQ pipeline: sort by count, keep k, project to the key, materialize to an array.",
          "The ContainsKey/else split is the classic 'increment or initialize'; freq[num] = freq.GetValueOrDefault(num) + 1 collapses it to one line.",
          "Sorting only touches DISTINCT values, but that's still O(n log n) when every value is unique.",
          "True O(n): bucket sort — an array indexed by frequency (0..n), drop each number into bucket[count], then read buckets from the top down.",
        ],
      },
    },
  ],
};
