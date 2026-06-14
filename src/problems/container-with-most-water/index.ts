import type { Problem, VisualState } from "../../domain/types";

// Elber's actual solution from LeetcodePractice/Problems/TwoPointers/ContainerWithMostWater,
// presented in LeetCode submission format.
const code = `public class Solution {
    public int MaxArea(int[] heights) {
        int l = 0;
        int r = heights.Length - 1;
        int maxArea = 0;
        while (l < r)
        {
            int length = r - l;
            int width = Math.Min(heights[l], heights[r]);
            int area = length * width;
            if (area > maxArea)
            {
                maxArea = area;
            }
            if (heights[l] < heights[r]) l++;
            else r--;
        }
        return maxArea;
    }
}`;

/** Traced input (Example 1 from the practice repo): heights = [1, 7, 2, 5, 4, 7, 3, 6] → 36. */
const heights = [1, 7, 2, 5, 4, 7, 3, 6];

function arr(l: number, r: number, highlighted?: number[]): VisualState {
  return { type: "array", title: "heights", items: heights, pointers: { l, r }, highlighted };
}

export const containerWithMostWater: Problem = {
  slug: "container-with-most-water",
  number: 11,
  title: "Container With Most Water",
  difficulty: "Medium",
  category: "Two Pointers",
  leetcodeUrl: "https://leetcode.com/problems/container-with-most-water/",
  solutions: [
    {
      name: "Two Pointers",
      input: "heights = [1, 7, 2, 5, 4, 7, 3, 6]",
      code,
      steps: [
        {
          lines: [3, 4, 5],
          label: "Start with the widest possible container: l at the far left wall, r at the far right. maxArea = 0.",
          variables: { l: "0", r: "7", maxArea: "0" },
          visuals: [arr(0, 7)],
        },
        {
          lines: [7, 8, 9, 10],
          label: "Width is the SHORTER wall: min(1, 6) = 1. Distance = 7. Area = 7 × 1 = 7. New best → maxArea = 7.",
          variables: { l: "0", r: "7", area: "7", maxArea: "7" },
          visuals: [arr(0, 7, [0, 7])],
        },
        {
          lines: [15],
          label: "The left wall (1) is the shorter one and caps the area. Moving it is the only way to possibly improve, so l → 1.",
          variables: { l: "1", r: "7", maxArea: "7" },
          visuals: [arr(1, 7)],
        },
        {
          lines: [7, 8, 9],
          label: "min(7, 6) = 6, distance = 6, area = 36. A huge jump → maxArea = 36. Now the right wall (6) is shorter.",
          variables: { l: "1", r: "7", area: "36", maxArea: "36" },
          visuals: [arr(1, 7, [1, 7])],
        },
        {
          lines: [16],
          label: "Right wall is shorter, so move r → 6. min(7, 3) = 3, distance = 5, area = 15. Not better than 36.",
          variables: { l: "1", r: "6", area: "15", maxArea: "36" },
          visuals: [arr(1, 6, [1, 6])],
        },
        {
          lines: [16],
          label: "Right is shorter again → r = 5. min(7, 7) = 7, distance = 4, area = 28. Still under 36.",
          variables: { l: "1", r: "5", area: "28", maxArea: "36" },
          visuals: [arr(1, 5, [1, 5])],
        },
        {
          lines: [16],
          label: "Tie goes to moving r → 4. min(7, 4) = 4, distance = 3, area = 12.",
          variables: { l: "1", r: "4", area: "12", maxArea: "36" },
          visuals: [arr(1, 4, [1, 4])],
        },
        {
          lines: [16],
          label: "r → 3. min(7, 5) = 5, distance = 2, area = 10.",
          variables: { l: "1", r: "3", area: "10", maxArea: "36" },
          visuals: [arr(1, 3, [1, 3])],
        },
        {
          lines: [16],
          label: "r → 2. min(7, 2) = 2, distance = 1, area = 2. The window is almost closed.",
          variables: { l: "1", r: "2", area: "2", maxArea: "36" },
          visuals: [arr(1, 2, [1, 2])],
        },
        {
          lines: [6, 19],
          label: "r → 1. Now l == r, the loop ends. Return the best we ever saw: maxArea = 36. ✓",
          variables: { result: "36" },
          visuals: [arr(1, 1, [1])],
        },
      ],
      approach: {
        summary:
          "Area is limited by the SHORTER of the two walls, so widening can't help once you're at the edges — the only lever is to replace a short wall with a taller one. Start at the widest span and always move the pointer at the shorter wall inward: you give up width but get a shot at more height. Moving the taller wall could never improve things, so this safely skips every pair that can't beat the current best.",
        timeComplexity: "O(n) — each pointer moves inward at most n times total.",
        spaceComplexity: "O(1).",
        notes: [
          "Why move the shorter wall? The shorter wall is the bottleneck; keeping it and shrinking width can only lose area. Moving it is the one change that might raise the limiting height.",
          "Heads up on Elber's naming: length holds the horizontal distance (r - l) and width holds the limiting height (Math.Min). Unconventional labels, correct math.",
          "Math.Min picks the wall that caps the water level — water spills over the shorter side.",
          "A brute-force check of all pairs is O(n²); the two-pointer insight collapses it to O(n).",
        ],
      },
    },
  ],
};
