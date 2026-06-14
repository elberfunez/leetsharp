import type { Problem, TreeVisualNode, VisualState } from "../../domain/types";

// Elber's actual solution from LeetcodePractice/Problems/Trees/SameTree,
// presented in LeetCode submission format.
const code = `public class Solution {
    public bool IsSameTree(TreeNode p, TreeNode q) {
        if (p == null && q == null) return true;
        if (p == null || q == null) return false;
        if (p.val != q.val) return false;
        return IsSameTree(p.left, q.left) && IsSameTree(p.right, q.right);
    }
}`;

const p: TreeVisualNode = { id: "p1", value: 1, left: { id: "p2", value: 2 }, right: { id: "p3", value: 3 } };
const q: TreeVisualNode = { id: "q1", value: 1, left: { id: "q2", value: 2 }, right: { id: "q3", value: 3 } };

function trees(hp: string[], hq: string[], vp: string[] = [], vq: string[] = []): VisualState[] {
  return [
    { type: "tree", title: "p", root: p, highlighted: hp, visited: vp },
    { type: "tree", title: "q", root: q, highlighted: hq, visited: vq },
  ];
}

export const sameTree: Problem = {
  slug: "same-tree",
  number: 100,
  title: "Same Tree",
  difficulty: "Easy",
  category: "Trees",
  leetcodeUrl: "https://leetcode.com/problems/same-tree/",
  solutions: [
    {
      name: "Recursion",
      input: "p = [1, 2, 3], q = [1, 2, 3]",
      code,
      steps: [
        {
          lines: [2, 3, 4, 5],
          label: "Two trees are the same when their roots match AND their subtrees match. Roots: both exist, both = 1 → recurse into the children.",
          visuals: trees(["p1"], ["q1"]),
        },
        {
          lines: [6, 5],
          label: "Compare left children: both = 2. Equal → recurse into their children.",
          visuals: trees(["p2"], ["q2"], ["p1"], ["q1"]),
        },
        {
          lines: [3],
          label: "Node 2's children are null on both sides → null == null, those subtrees match.",
          visuals: trees(["p2"], ["q2"], ["p1"], ["q1"]),
        },
        {
          lines: [6, 5],
          label: "Compare right children: both = 3. Equal, and their children are null too.",
          visuals: trees(["p3"], ["q3"], ["p1", "p2"], ["q1", "q2"]),
        },
        {
          lines: [3, 6],
          label: "Every node pair matched and all recursions bottomed out at null == null → return true. ✓",
          variables: { result: "true" },
          visuals: trees([], [], ["p1", "p2", "p3"], ["q1", "q2", "q3"]),
        },
      ],
      approach: {
        summary:
          "Two trees are identical exactly when their roots match and their left and right subtrees are themselves identical — a naturally recursive definition. At each node pair, three checks: both null (match), exactly one null (mismatch), values differ (mismatch). Otherwise recurse into both child pairs and require BOTH to come back true.",
        timeComplexity: "O(n) — each node pair is compared once.",
        spaceComplexity: "O(h) — recursion stack, h = tree height.",
        notes: [
          "Order of base cases matters: both-null (a match) must be checked before one-null (a structural mismatch), then values.",
          "The && short-circuits — if the left subtrees differ, the right subtrees are never even compared.",
          "Structure counts as much as values: [1, 2] and [1, null, 2] differ because a left child isn't a right child.",
          "Recursion depth is the height h — O(log n) for a balanced tree, O(n) for a skewed one.",
        ],
      },
    },
  ],
};
