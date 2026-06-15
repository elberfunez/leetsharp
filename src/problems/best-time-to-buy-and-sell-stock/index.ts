import type { Problem, VisualState } from "../../domain/types";
import { ELBER } from "../authors";

// Elber's actual solution from LeetcodePractice/Problems/SlidingWindow/BestTimeToBuyAndSellStock,
// presented in LeetCode submission format.
const code = `public class Solution {
    public int MaxProfit(int[] prices) {
        int minPrice = prices[0];
        int maxPrice = 0;
        foreach (int p in prices)
        {
            minPrice = Math.Min(minPrice, p);
            maxPrice = Math.Max(maxPrice, p - minPrice);
        }
        return maxPrice;
    }
}`;

/** Traced input (Example 1 from the practice repo): prices = [10, 1, 5, 6, 7, 1] → 6. */
const prices = [10, 1, 5, 6, 7, 1];

function arr(cur: number, minIdx: number, highlighted?: number[]): VisualState {
  return { type: "array", title: "prices", items: prices, pointers: { p: cur, min: minIdx }, highlighted };
}

function profit(val: number): VisualState {
  return { type: "dict", title: "running best", entries: [["best profit", `$${val}`]], activeKey: "best profit" };
}

export const bestTimeToBuyAndSellStock: Problem = {
  slug: "best-time-to-buy-and-sell-stock",
  number: 121,
  title: "Best Time to Buy and Sell Stock",
  difficulty: "Easy",
  category: "Sliding Window",
  leetcodeUrl: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
  author: ELBER,
  solutions: [
    {
      name: "Track Min Price",
      input: "prices = [10, 1, 5, 6, 7, 1]",
      code,
      steps: [
        {
          lines: [3, 4],
          label: "Track two running values: the cheapest price seen so far (starts at prices[0] = 10) and the best profit so far (0).",
          variables: { minPrice: "10", maxPrice: "0" },
          visuals: [arr(0, 0), profit(0)],
        },
        {
          lines: [6, 7, 8],
          label: "First price — nothing cheaper seen yet, so no profitable sell is possible.",
          variables: { minPrice: "10", maxPrice: "0" },
          visuals: [arr(0, 0, [0]), profit(0)],
        },
        {
          lines: [7, 8],
          label: "New lowest price — update minPrice. This is now the best potential buy day.",
          variables: { minPrice: "1", maxPrice: "0" },
          visuals: [arr(1, 1, [1]), profit(0)],
        },
        {
          lines: [8],
          label: "Selling today beats our previous best profit — update the record.",
          variables: { minPrice: "1", maxPrice: "4" },
          visuals: [arr(2, 1, [2]), profit(4)],
        },
        {
          lines: [8],
          label: "Even better sell day — profit is higher than before. New best.",
          variables: { minPrice: "1", maxPrice: "5" },
          visuals: [arr(3, 1, [3]), profit(5)],
        },
        {
          lines: [8],
          label: "Best profit yet — buy at the cheapest day seen so far, sell today.",
          variables: { minPrice: "1", maxPrice: "6" },
          visuals: [arr(4, 1, [4]), profit(6)],
        },
        {
          lines: [7, 8],
          label: "Ties the minimum but doesn't improve it. Selling today gives zero profit — best unchanged.",
          variables: { minPrice: "1", maxPrice: "6" },
          visuals: [arr(5, 1, [5]), profit(6)],
        },
        {
          lines: [11],
          label: "Loop done. Return the best profit ever seen: 6. ✓",
          variables: { result: "6" },
          visuals: [arr(5, 1, [1, 4]), profit(6)],
        },
      ],
      approach: {
        summary:
          "Walk the prices once, remembering the cheapest price seen so far and the best profit so far. On each day, first lower the running minimum if today is cheaper, then check the profit of selling today (today − cheapest-so-far) and keep the best. Because the minimum only ever looks backwards, you can never sell before you buy.",
        timeComplexity: "O(n) — a single pass.",
        spaceComplexity: "O(1) — two running values.",
        notes: [
          "Naming heads-up: maxPrice actually holds the max PROFIT, not a price. The math is correct, the label is just optimistic.",
          "Order inside the loop matters — update minPrice before computing profit, so 'sell today' is measured against the cheapest day up to and including today.",
          "p - minPrice is 0 on the day that sets a new minimum, and Math.Max keeps a new low from ever lowering the recorded profit.",
          "Despite living in the Sliding Window set, this is really a running-minimum scan — there's no left pointer to advance.",
        ],
      },
    },
  ],
};
