import type { Problem, VisualState } from "../../domain/types";
import { ELBER } from "../authors";

// Elber's actual solution from LeetcodePractice/Problems/ArraysAndHashing/ContainsDuplicate,
// presented in LeetCode submission format.
const code = `public class Solution {
    public bool HasDuplicate(int[] nums) {
        if (nums.Length < 2) return false;
        HashSet<int> seen = new();
        foreach (int num in nums)
        {
            if (!seen.Add(num))
            {
                return true;
            }
        }
        return false;
    }
}`;

/** Traced input (Example 1 from the practice repo): nums = [1, 2, 3, 3] → true. */
const nums = [1, 2, 3, 3];

function arr(i: number, highlighted?: number[]): VisualState {
  return { type: "array", title: "nums", items: nums, pointers: { num: i }, highlighted };
}

function set(items: number[], activeItem?: number): VisualState {
  return { type: "set", title: "seen", items, activeItem };
}

export const containsDuplicate: Problem = {
  slug: "contains-duplicate",
  number: 217,
  title: "Contains Duplicate",
  difficulty: "Easy",
  category: "Arrays & Hashing",
  leetcodeUrl: "https://leetcode.com/problems/contains-duplicate/",
  author: ELBER,
  solutions: [
    {
      name: "Hash Set",
      input: "nums = [1, 2, 3, 3]",
      code,
      steps: [
        {
          lines: [3, 4],
          label: "There are 4 numbers (≥ 2), so duplicates are possible. Set up an empty HashSet to remember what we've seen.",
          visuals: [arr(0), set([])],
        },
        {
          lines: [5, 7],
          label: "num = 1. seen.Add(1) succeeds — it was new — so !true = false. Not a duplicate, keep going.",
          visuals: [arr(0, [0]), set([1], 1)],
        },
        {
          lines: [7],
          label: "num = 2. Add(2) succeeds → new. seen = {1, 2}.",
          visuals: [arr(1, [1]), set([1, 2], 2)],
        },
        {
          lines: [7],
          label: "num = 3. Add(3) succeeds → new. seen = {1, 2, 3}.",
          visuals: [arr(2, [2]), set([1, 2, 3], 3)],
        },
        {
          lines: [7, 9],
          label: "num = 3 again. Add(3) FAILS — 3 is already in the set. !false = true → return true. ✓",
          variables: { result: "true" },
          visuals: [arr(3, [3]), set([1, 2, 3], 3)],
        },
      ],
      approach: {
        summary:
          "A HashSet answers 'have I seen this value before?' in O(1). Walk the array adding each number; HashSet.Add returns false the instant you re-add something already present — that's the duplicate, so return immediately. Finish the pass with every Add succeeding and the array was all-unique.",
        timeComplexity: "O(n) — one pass, O(1) set operations. Often returns early.",
        spaceComplexity: "O(n) — worst case (all unique) stores every element.",
        notes: [
          "seen.Add(num) does double duty: it inserts AND returns whether the value was already there — no separate Contains call needed.",
          "Returning the moment Add fails means you frequently stop well before the end of the array.",
          "The nums.Length < 2 guard is a tiny early-out; the loop would handle a 0- or 1-element array correctly anyway.",
          "Sorting first and scanning neighbors is an O(n log n) / O(1)-space alternative — a trade if you can't spare the set's memory.",
        ],
      },
    },
  ],
};
