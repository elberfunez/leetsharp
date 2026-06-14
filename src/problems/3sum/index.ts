import type { Problem, VisualState } from "../../domain/types";

// Elber's actual solution from LeetcodePractice/Problems/TwoPointers/ThreeSum,
// presented in LeetCode submission format.
const code = `public class Solution {
    public List<List<int>> ThreeSum(int[] nums) {
        List<List<int>> result = new();
        Array.Sort(nums);
        for (int i = 0; i < nums.Length - 2; i++)
        {
            if (i > 0 && nums[i] == nums[i - 1])
            {
                continue;
            }
            int left = i + 1;
            int right = nums.Length - 1;
            while (left < right)
            {
                int total = nums[i] + nums[left] + nums[right];
                if (total < 0)
                {
                    left++;
                }
                else if (total > 0)
                {
                    right--;
                }
                else
                {
                    result.Add(new List<int> { nums[i], nums[left], nums[right] });
                    while (left < right && nums[left] == nums[left + 1])
                    {
                        left++;
                    }
                    while (left < right && nums[right] == nums[right - 1])
                    {
                        right--;
                    }
                    left++;
                    right--;
                }
            }
        }
        return result;
    }
}`;

/** Traced input (Example 1): nums = [-1, 0, 1, 2, -1, -4], which sorts to
 *  [-4, -1, -1, 0, 1, 2]. Answer: [[-1, -1, 2], [-1, 0, 1]]. The visual shows
 *  the SORTED array; pointers i, L (left), R (right). */
const nums = [-4, -1, -1, 0, 1, 2];

function arr(pointers: Record<string, number>, highlighted?: number[], dimmed?: number[]): VisualState {
  return { type: "array", title: "nums (sorted)", items: nums, pointers, highlighted, dimmed };
}

export const threeSum: Problem = {
  slug: "3sum",
  number: 15,
  title: "3Sum",
  difficulty: "Medium",
  category: "Two Pointers",
  leetcodeUrl: "https://leetcode.com/problems/3sum/",
  solutions: [
    {
      name: "Sort + Two Pointers",
      input: "nums = [-1, 0, 1, 2, -1, -4]",
      code,
      steps: [
        {
          lines: [4],
          label: "Sort first. This groups duplicates together and lets two pointers exploit order. [-1,0,1,2,-1,-4] becomes [-4, -1, -1, 0, 1, 2].",
          visuals: [arr({})],
        },
        {
          lines: [5],
          label: "Fix the first number: i = 0 (-4). Now we just need two more numbers that sum to +4.",
          variables: { i: "0" },
          visuals: [arr({ i: 0 })],
        },
        {
          lines: [11, 12],
          label: "L (left) starts right after i, R (right) at the end. They'll hunt the remaining two numbers.",
          variables: { i: "0", left: "1", right: "5" },
          visuals: [arr({ i: 0, L: 1, R: 5 })],
        },
        {
          lines: [15, 16, 18],
          label: "total = -4 + (-1) + 2 = -3, which is negative — we need more. But even -4's best case (-4 + 1 + 2 = -1) stays negative, so L slides all the way up with no hit. Nothing starts with -4.",
          variables: { i: "0", total: "-3" },
          visuals: [arr({ i: 0, L: 1, R: 5 }, [0, 1, 5])],
        },
        {
          lines: [5, 7],
          label: "i = 1 (-1). It's not a repeat of a previous i, so we work it.",
          variables: { i: "1" },
          visuals: [arr({ i: 1 }, undefined, [0])],
        },
        {
          lines: [11, 12],
          label: "L = 2 (-1), R = 5 (2).",
          variables: { i: "1", left: "2", right: "5" },
          visuals: [arr({ i: 1, L: 2, R: 5 }, undefined, [0])],
        },
        {
          lines: [15, 24, 26],
          label: "total = -1 + (-1) + 2 = 0. A hit! Record the triplet [-1, -1, 2].",
          variables: { i: "1", total: "0", found: "[-1, -1, 2]" },
          visuals: [arr({ i: 1, L: 2, R: 5 }, [1, 2, 5], [0])],
        },
        {
          lines: [27, 31, 35, 36],
          label: "Skip any duplicate neighbors (none here), then move both inward: L = 3, R = 4.",
          variables: { i: "1", left: "3", right: "4" },
          visuals: [arr({ i: 1, L: 3, R: 4 }, undefined, [0]) ],
        },
        {
          lines: [15, 24, 26],
          label: "total = -1 + 0 + 1 = 0. Another hit! Record [-1, 0, 1].",
          variables: { i: "1", total: "0", found: "[-1, 0, 1]" },
          visuals: [arr({ i: 1, L: 3, R: 4 }, [1, 3, 4], [0])],
        },
        {
          lines: [35, 36],
          label: "Move both inward → L = 4, R = 3. They've crossed, so i = 1 is finished.",
          variables: { i: "1", left: "4", right: "3" },
          visuals: [arr({ i: 1 }, undefined, [0])],
        },
        {
          lines: [5, 7, 9],
          label: "i = 2 is another -1 — same as nums[1]. A duplicate first number only reproduces triplets we already have, so continue (skip it).",
          variables: { i: "2" },
          visuals: [arr({ i: 2 }, undefined, [0, 1])],
        },
        {
          lines: [5, 11, 12],
          label: "i = 3 (0). L = 4 (1), R = 5 (2).",
          variables: { i: "3", left: "4", right: "5" },
          visuals: [arr({ i: 3, L: 4, R: 5 }, undefined, [0, 1, 2])],
        },
        {
          lines: [15, 20, 22],
          label: "total = 0 + 1 + 2 = 3, positive → move R left. Now L == R, the inner loop ends with no more hits.",
          variables: { i: "3", total: "3" },
          visuals: [arr({ i: 3, L: 4, R: 5 }, [3, 4, 5], [0, 1, 2])],
        },
        {
          lines: [5, 40],
          label: "i stops at index 3 (it needs two numbers after it). Return the two triplets found. ✓",
          variables: { result: "[[-1, -1, 2], [-1, 0, 1]]" },
          visuals: [arr({})],
        },
      ],
      approach: {
        summary:
          "Sorting turns a 3-number search into a fixed-element-plus-two-pointer problem. Fix each number nums[i], then find pairs summing to -nums[i] in the rest of the array using the sorted two-pointer scan: too small move left up, too big move right down, equal record it. Sorting also makes duplicates adjacent, so they can be skipped cheaply — which is how you avoid duplicate triplets without a hash set.",
        timeComplexity: "O(n²) — an O(n) two-pointer sweep for each of the n choices of i. The O(n log n) sort is dominated.",
        spaceComplexity: "O(1) extra (ignoring the output list and sort's internal space).",
        notes: [
          "Two layers of duplicate-skipping: i > 0 && nums[i] == nums[i-1] skips repeat anchors; the inner whiles skip repeat left/right values after a hit. Both are essential to avoid duplicate triplets.",
          "Array.Sort sorts in place in O(n log n) — the prerequisite that makes the whole two-pointer idea valid.",
          "The loop bound nums.Length - 2 leaves room for left and right after i.",
          "Because the array is sorted, total < 0 means the only way to grow the sum is a bigger left value, and total > 0 means a smaller right value — no guessing.",
        ],
      },
    },
  ],
};
