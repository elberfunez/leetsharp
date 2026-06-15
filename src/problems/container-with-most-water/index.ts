import type { Problem, VisualState } from "../../domain/types";
import { ELBER } from "../authors";

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

/** Traced input: heights = [1, 7, 2, 5, 4, 7, 3, 6] → 36. */
const heights = [1, 7, 2, 5, 4, 7, 3, 6];

function arr(l: number, r: number, highlighted?: number[]): VisualState {
  return { type: "array", title: "heights", items: heights, pointers: { l, r }, highlighted };
}

function water(l: number, r: number): VisualState {
  return { type: "container", heights, l, r };
}

export const containerWithMostWater: Problem = {
  slug: "container-with-most-water",
  number: 11,
  title: "Container With Most Water",
  difficulty: "Medium",
  category: "Two Pointers",
  leetcodeUrl: "https://leetcode.com/problems/container-with-most-water/",
  author: ELBER,
  solutions: [
    {
      name: "Two Pointers",
      input: "heights = [1, 7, 2, 5, 4, 7, 3, 6]",
      code,
      steps: [
        {
          lines: [3, 4, 5],
          label: "Start with the widest possible container: `l` at the far left wall, `r` at the far right. `maxArea` = 0.",
          variables: { l: "0", r: "7", maxArea: "0" },
          visuals: [arr(0, 7), water(0, 7)],
        },
        {
          lines: [7, 8, 9, 10],
          label: "The left wall (`heights[l]` = 1) is the shorter one — it caps the water height. Area = 7 × 1 = 7. New best.",
          variables: { l: "0", r: "7", area: "7", maxArea: "7" },
          visuals: [arr(0, 7, [0, 7]), water(0, 7)],
        },
        {
          lines: [15],
          label: "Left wall (1) is shorter — moving it is the only way to improve. Advance `l` → 1.",
          variables: { l: "1", r: "7", maxArea: "7" },
          visuals: [arr(1, 7), water(1, 7)],
        },
        {
          lines: [7, 8, 9, 10],
          label: "Both walls are tall — area = 6 × 6 = 36. Best by far.",
          variables: { l: "1", r: "7", area: "36", maxArea: "36" },
          visuals: [arr(1, 7, [1, 7]), water(1, 7)],
        },
        {
          lines: [16],
          label: "Right wall (`heights[r]` = 3) is shorter — move `r` → 6. Narrower and shorter: area drops to 15. Not a new best.",
          variables: { l: "1", r: "6", area: "15", maxArea: "36" },
          visuals: [arr(1, 6, [1, 6]), water(1, 6)],
        },
        {
          lines: [16],
          label: "Right wall (3) still shorter — move `r` → 5. Area = 4 × 7 = 28. Not a new best.",
          variables: { l: "1", r: "5", area: "28", maxArea: "36" },
          visuals: [arr(1, 5, [1, 5]), water(1, 5)],
        },
        {
          lines: [16],
          label: "Walls are equal height — by convention move `r`. Area = 3 × 4 = 12. Not a new best.",
          variables: { l: "1", r: "4", area: "12", maxArea: "36" },
          visuals: [arr(1, 4, [1, 4]), water(1, 4)],
        },
        {
          lines: [16],
          label: "Right wall (4) shorter — move `r` → 3. Area = 2 × 5 = 10. Not a new best.",
          variables: { l: "1", r: "3", area: "10", maxArea: "36" },
          visuals: [arr(1, 3, [1, 3]), water(1, 3)],
        },
        {
          lines: [16],
          label: "Right wall (5) shorter — move `r` → 2. Just one slot wide; area = 2. Not a new best.",
          variables: { l: "1", r: "2", area: "2", maxArea: "36" },
          visuals: [arr(1, 2, [1, 2]), water(1, 2)],
        },
        {
          lines: [6, 19],
          label: "`r` → 1. Now `l` == `r` — the loop ends. Return `maxArea` = 36. ✓",
          variables: { result: "36" },
          visuals: [arr(1, 1, [1]), water(1, 1)],
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
