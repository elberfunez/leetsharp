import type { Problem, VisualState } from "../../domain/types";
import { ELBER } from "../authors";

const code = `public class Solution {
    public int MaxProfit(int[] prices) {
        int minPrice = prices[0];
        int maxProfit = 0;
        foreach (int p in prices)
        {
            minPrice = Math.Min(minPrice, p);
            maxProfit = Math.Max(maxProfit, p - minPrice);
        }
        return maxProfit;
    }
}`;

/** Traced input: prices = [10, 1, 5, 6, 7, 1] → 6. */
const prices = [10, 1, 5, 6, 7, 1];

function arr(cur: number, minIdx: number, sellIdx?: number, highlighted?: number[]): VisualState {
  const ptrs: Record<string, number> = { p: cur, buy: minIdx };
  if (sellIdx !== undefined) ptrs["sell"] = sellIdx;
  return { type: "array", title: "prices", items: prices, pointers: ptrs, highlighted };
}

function tracker(curProfit: number, bestProfit: number): VisualState {
  return {
    type: "dict",
    title: "profit tracker",
    entries: [
      ["if sold now", `$${curProfit}`],
      ["best so far", `$${bestProfit}`],
    ],
    activeKey: curProfit > bestProfit ? "if sold now" : "best so far",
  };
}

export const bestTimeToBuyAndSellStock: Problem = {
  slug: "best-time-to-buy-and-sell-stock",
  number: 121,
  title: "Best Time to Buy and Sell Stock",
  difficulty: "Easy",
  category: "Sliding Window",
  leetcodeUrl: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
  description: `# Best Time to Buy and Sell Stock

**Difficulty:** Easy  
**Topic:** Sliding Window

---

## Description

You are given an integer array \`prices\` where \`prices[i]\` is the price of NeetCoin on the ith day.

You may choose a single day to buy one NeetCoin and choose a different day in the future to sell it.

Return the maximum profit you can achieve. You may choose to not make any transactions, in which case the profit would be 0.

---

## Examples

### Example 1:

\`\`\`
Input: prices = [10,1,5,6,7,1]

Output: 6

Explanation: Buy at prices[1] (price = 1) and sell at prices[4] (price = 7). Profit = 7 - 1 = 6.
\`\`\`

### Example 2:

\`\`\`
Input: prices = [10,8,7,5,2]

Output: 0

Explanation: No profitable transactions can be made. Prices are always decreasing, so return 0.
\`\`\`

---

## Constraints

- \`1 <= prices.length <= 100\`
- \`0 <= prices[i] <= 100\``,
  author: ELBER,
  solutions: [
    {
      name: "Track Min Price",
      input: "prices = [10, 1, 5, 6, 7, 1]",
      code,
      steps: [
        {
          lines: [3, 4],
          label: "Track two running values: cheapest buy price seen so far (`minPrice` = 10) and best profit so far (`maxProfit` = 0).",
          variables: { minPrice: "10", maxProfit: "0" },
          visuals: [arr(0, 0), tracker(0, 0)],
        },
        {
          lines: [6, 7, 8],
          label: "`p` = 10. `buy` stays at index 0. Profit if sold now = 10 − 10 = $0. No improvement.",
          variables: { p: "10", minPrice: "10", maxProfit: "0" },
          visuals: [arr(0, 0, undefined, [0]), tracker(0, 0)],
        },
        {
          lines: [7, 8],
          label: "`p` = 1. New low — `buy` moves to index 1 (`minPrice` = 1). Profit if sold now = $0. No `sell` day yet.",
          variables: { p: "1", minPrice: "1", maxProfit: "0" },
          visuals: [arr(1, 1, undefined, [1]), tracker(0, 0)],
        },
        {
          lines: [8],
          label: "`p` = 5. Profit = 5 − 1 = $4. Beats `maxProfit` — `sell` moves to index 2. New best!",
          variables: { p: "5", minPrice: "1", maxProfit: "4" },
          visuals: [arr(2, 1, 2, [2]), tracker(4, 4)],
        },
        {
          lines: [8],
          label: "`p` = 6. Profit = 6 − 1 = $5. New best — `sell` moves to index 3.",
          variables: { p: "6", minPrice: "1", maxProfit: "5" },
          visuals: [arr(3, 1, 3, [3]), tracker(5, 5)],
        },
        {
          lines: [8],
          label: "`p` = 7. Profit = 7 − 1 = $6. New best — `sell` moves to index 4.",
          variables: { p: "7", minPrice: "1", maxProfit: "6" },
          visuals: [arr(4, 1, 4, [4]), tracker(6, 6)],
        },
        {
          lines: [7, 8],
          label: "`p` = 1. Ties the minimum. Profit if sold now = $0. `sell` stays at index 4. Best profit unchanged at $6.",
          variables: { p: "1", minPrice: "1", maxProfit: "6" },
          visuals: [arr(5, 1, 4, [5]), tracker(0, 6)],
        },
        {
          lines: [11],
          label: "Loop done. Best pair: `buy` at index 1 (price 1), `sell` at index 4 (price 7). Return `maxProfit` = 6. ✓",
          variables: { result: "6" },
          visuals: [arr(5, 1, 4, [1, 4]), tracker(6, 6)],
        },
      ],
      approach: {
        summary:
          "Walk the prices once, remembering the cheapest price seen so far and the best profit so far. On each day, first lower the running minimum if today is cheaper, then check the profit of selling today (today − cheapest-so-far) and keep the best. Because the minimum only ever looks backwards, you can never sell before you buy.",
        timeComplexity: "O(n) — a single pass.",
        spaceComplexity: "O(1) — two running values.",
        notes: [
          "Order inside the loop matters — update minPrice before computing profit, so 'sell today' is measured against the cheapest day up to and including today.",
          "p - minPrice is 0 on the day that sets a new minimum, and Math.Max keeps a new low from ever lowering the recorded profit.",
          "Despite living in the Sliding Window set, this is really a running-minimum scan — there's no left pointer to advance.",
        ],
      },
    },
  ],
};
