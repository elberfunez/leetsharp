import type { Problem, VisualState } from "../../domain/types";

// Elber's actual solution from LeetcodePractice/Problems/ArraysAndHashing/ProductExceptSelf,
// presented in LeetCode submission format.
const code = `public class Solution {
    public int[] ProductExceptSelf(int[] nums) {
        int[] prefix = new int[nums.Length];
        prefix[0] = 1 * nums[0];
        for (int i = 1; i < nums.Length; i++)
        {
            prefix[i] = prefix[i - 1] * nums[i];
        }
        int[] postfix = new int[nums.Length];
        postfix[nums.Length - 1] = 1 * nums[nums.Length - 1];
        for (int i = nums.Length - 2; i >= 0; i--)
        {
            postfix[i] = nums[i] * postfix[i + 1];
        }
        int[] res = new int[nums.Length];
        for (int i = 0; i < nums.Length; i++)
        {
            int leftProduct = i > 0 ? prefix[i - 1] : 1;
            int rightProduct = i < nums.Length - 1 ? postfix[i + 1] : 1;
            res[i] = leftProduct * rightProduct;
        }
        return res;
    }
}`;

/** Traced input (Example 1 from the practice repo): nums = [1, 2, 3, 4] → [24, 12, 8, 6]. */
const nums = [1, 2, 3, 4];

function row(title: string, items: number[], highlighted?: number[]): VisualState {
  return { type: "array", title, items, highlighted };
}

export const productOfArrayExceptSelf: Problem = {
  slug: "product-of-array-except-self",
  number: 238,
  title: "Product of Array Except Self",
  difficulty: "Medium",
  category: "Arrays & Hashing",
  leetcodeUrl: "https://leetcode.com/problems/product-of-array-except-self/",
  solutions: [
    {
      name: "Prefix & Postfix",
      input: "nums = [1, 2, 3, 4]",
      code,
      steps: [
        {
          lines: [3, 4],
          label: "Idea: result[i] = (product of everything left of i) × (product of everything right of i). Build a prefix array of running products from the left. prefix[0] = nums[0] = 1.",
          visuals: [row("nums", nums), row("prefix", [1, 0, 0, 0], [0])],
        },
        {
          lines: [5, 7],
          label: "prefix[1] = prefix[0] × nums[1] = 1 × 2 = 2.",
          visuals: [row("nums", nums), row("prefix", [1, 2, 0, 0], [1])],
        },
        {
          lines: [7],
          label: "prefix[2] = 2 × 3 = 6, then prefix[3] = 6 × 4 = 24. prefix = [1, 2, 6, 24].",
          visuals: [row("nums", nums), row("prefix", [1, 2, 6, 24], [2, 3])],
        },
        {
          lines: [9, 10],
          label: "Now a postfix array of running products from the RIGHT. postfix[3] = nums[3] = 4.",
          visuals: [row("nums", nums), row("postfix", [0, 0, 0, 4], [3])],
        },
        {
          lines: [11, 13],
          label: "postfix[2] = nums[2] × postfix[3] = 3 × 4 = 12.",
          visuals: [row("nums", nums), row("postfix", [0, 0, 12, 4], [2])],
        },
        {
          lines: [13],
          label: "postfix[1] = 2 × 12 = 24, then postfix[0] = 1 × 24 = 24. postfix = [24, 24, 12, 4].",
          visuals: [row("nums", nums), row("postfix", [24, 24, 12, 4], [0, 1])],
        },
        {
          lines: [16, 18, 19, 20],
          label: "Combine. res[0]: nothing on the left (use 1) × postfix[1] = 1 × 24 = 24.",
          visuals: [
            row("prefix", [1, 2, 6, 24]),
            row("postfix", [24, 24, 12, 4]),
            row("res", [24, 0, 0, 0], [0]),
          ],
        },
        {
          lines: [18, 19, 20],
          label: "res[1] = prefix[0] × postfix[2] = 1 × 12 = 12.",
          visuals: [
            row("prefix", [1, 2, 6, 24]),
            row("postfix", [24, 24, 12, 4]),
            row("res", [24, 12, 0, 0], [1]),
          ],
        },
        {
          lines: [20],
          label: "res[2] = prefix[1] × postfix[3] = 2 × 4 = 8.",
          visuals: [
            row("prefix", [1, 2, 6, 24]),
            row("postfix", [24, 24, 12, 4]),
            row("res", [24, 12, 8, 0], [2]),
          ],
        },
        {
          lines: [18, 20],
          label: "res[3] = prefix[2] × (nothing on the right, use 1) = 6 × 1 = 6.",
          visuals: [
            row("prefix", [1, 2, 6, 24]),
            row("postfix", [24, 24, 12, 4]),
            row("res", [24, 12, 8, 6], [3]),
          ],
        },
        {
          lines: [23],
          label: "Return res = [24, 12, 8, 6]. Each slot is the product of all the others — and no division was used. ✓",
          variables: { result: "[24, 12, 8, 6]" },
          visuals: [row("res", [24, 12, 8, 6], [0, 1, 2, 3])],
        },
      ],
      approach: {
        summary:
          "result[i] is the product of everything to its left times everything to its right. Precompute both: a left-to-right pass builds cumulative products (prefix), a right-to-left pass builds them from the other side (postfix). Then result[i] = leftOf[i] × rightOf[i]. This dodges the banned division operator (which also blows up on zeros) and stays linear.",
        timeComplexity: "O(n) — three single passes.",
        spaceComplexity: "O(n) for the two helper arrays — reducible to O(1) extra by writing into the output and using a running variable.",
        notes: [
          "The ternaries handle the ends: index 0 has nothing to its left (use 1), the last index has nothing to its right (use 1).",
          "Division (totalProduct / nums[i]) would be simpler but the problem forbids it — and it breaks the moment any element is 0.",
          "Elber builds full prefix and postfix arrays for clarity; the O(1)-space version writes prefixes into res, then multiplies by a running postfix in a second sweep.",
          "1 is the multiplicative identity — that's why an empty side contributes 1, not 0.",
        ],
      },
    },
  ],
};
