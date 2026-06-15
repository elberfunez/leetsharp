import type { Problem, VisualState } from "../../domain/types";
import { ELBER } from "../authors";

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
const prefixArr  = [1, 2, 6, 24];
const postfixArr = [24, 24, 12, 4];

function row(title: string, items: number[], highlighted?: number[], pointers?: Record<string, number>): VisualState {
  return { type: "array", title, items, highlighted, pointers };
}

export const productOfArrayExceptSelf: Problem = {
  slug: "product-of-array-except-self",
  number: 238,
  title: "Product of Array Except Self",
  difficulty: "Medium",
  category: "Arrays & Hashing",
  leetcodeUrl: "https://leetcode.com/problems/product-of-array-except-self/",
  author: ELBER,
  solutions: [
    {
      name: "Prefix & Postfix",
      input: "nums = [1, 2, 3, 4]",
      code,
      steps: [
        // ── Concept ────────────────────────────────────────────────
        {
          lines: [3],
          label: "Core idea: result[i] = (product of everything to i's LEFT) × (product of everything to i's RIGHT). We'll precompute both sides in two passes, then multiply.",
          visuals: [row("nums", nums)],
        },
        // ── Prefix pass (left → right) ──────────────────────────
        {
          lines: [4],
          label: "Left pass — scan left to right, building a running product. prefix[0] starts at nums[0] = 1.",
          visuals: [row("nums", nums, [0], { i: 0 }), row("prefix", [1, 0, 0, 0], [0])],
        },
        {
          lines: [5, 7],
          label: "prefix[1] = previous running product × nums[1]. The running product now covers the first two elements.",
          visuals: [row("nums", nums, [1], { i: 1 }), row("prefix", [1, 2, 0, 0], [1])],
        },
        {
          lines: [7],
          label: "prefix[2] = previous running product × nums[2]. Now covers the first three elements.",
          visuals: [row("nums", nums, [2], { i: 2 }), row("prefix", [1, 2, 6, 0], [2])],
        },
        {
          lines: [7],
          label: "prefix[3] = previous running product × nums[3]. Left pass complete — prefix[i] holds the product of nums[0..i].",
          visuals: [row("nums", nums, [3], { i: 3 }), row("prefix", prefixArr, [3])],
        },
        // ── Postfix pass (right → left) ─────────────────────────
        {
          lines: [9, 10],
          label: "Right pass — scan right to left, building a running product from the other end. postfix[3] starts at nums[3] = 4.",
          visuals: [row("nums", nums, [3], { i: 3 }), row("postfix", [0, 0, 0, 4], [3])],
        },
        {
          lines: [11, 13],
          label: "postfix[2] = nums[2] × next running product. Covers the last two elements.",
          visuals: [row("nums", nums, [2], { i: 2 }), row("postfix", [0, 0, 12, 4], [2])],
        },
        {
          lines: [13],
          label: "postfix[1] = nums[1] × next running product. Covers the last three elements.",
          visuals: [row("nums", nums, [1], { i: 1 }), row("postfix", [0, 24, 12, 4], [1])],
        },
        {
          lines: [13],
          label: "postfix[0] = nums[0] × next running product. Right pass complete — postfix[i] holds the product of nums[i..end].",
          visuals: [row("nums", nums, [0], { i: 0 }), row("postfix", postfixArr, [0])],
        },
        // ── Combine ─────────────────────────────────────────────
        {
          lines: [16],
          label: "Now combine. For each index: result[i] = prefix[i−1] (everything left of i) × postfix[i+1] (everything right of i).",
          visuals: [row("prefix", prefixArr), row("postfix", postfixArr), row("res", [0, 0, 0, 0])],
        },
        {
          lines: [18, 19, 20],
          label: "Index 0: nothing to its left (left product = 1). Right product = postfix[1] = 24. result[0] = 24.",
          visuals: [
            row("prefix", prefixArr, []),
            row("postfix", postfixArr, [1], { "right →": 1 }),
            row("res", [24, 0, 0, 0], [0]),
          ],
        },
        {
          lines: [18, 19, 20],
          label: "Index 1: left product = prefix[0] = 1. Right product = postfix[2] = 12. result[1] = 12.",
          visuals: [
            row("prefix", prefixArr, [0], { "← left": 0 }),
            row("postfix", postfixArr, [2], { "right →": 2 }),
            row("res", [24, 12, 0, 0], [1]),
          ],
        },
        {
          lines: [18, 19, 20],
          label: "Index 2: left product = prefix[1] = 2. Right product = postfix[3] = 4. result[2] = 8.",
          visuals: [
            row("prefix", prefixArr, [1], { "← left": 1 }),
            row("postfix", postfixArr, [3], { "right →": 3 }),
            row("res", [24, 12, 8, 0], [2]),
          ],
        },
        {
          lines: [18, 19, 20],
          label: "Index 3: left product = prefix[2] = 6. Nothing to its right (right product = 1). result[3] = 6.",
          visuals: [
            row("prefix", prefixArr, [2], { "← left": 2 }),
            row("postfix", postfixArr, []),
            row("res", [24, 12, 8, 6], [3]),
          ],
        },
        {
          lines: [23],
          label: "Return [24, 12, 8, 6]. Every slot holds the product of all other elements — no division needed. ✓",
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
          "This solution uses two explicit arrays for clarity. The O(1)-space version skips them: write prefixes directly into res, then multiply by a running postfix variable in a second sweep.",
          "1 is the multiplicative identity — that's why an empty side contributes 1, not 0.",
        ],
      },
    },
  ],
};
