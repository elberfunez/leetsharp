import type { Problem, TreeVisualNode, VisualState } from "../../domain/types";
import { ELBER } from "../authors";

// Elber's actual solution from LeetcodePractice/Problems/Trees/LowestCommonAncestorBST,
// presented in LeetCode submission format.
const code = `public class Solution {
    public TreeNode LowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        TreeNode cur = root;
        while (cur != null)
        {
            if (p.val > cur.val && q.val > cur.val)
            {
                cur = cur.right;
            }
            else if (p.val < cur.val && q.val < cur.val)
            {
                cur = cur.left;
            }
            else
            {
                return cur;
            }
        }
        return null;
    }
}`;

const root: TreeVisualNode = {
  id: "n5", value: 5,
  left: { id: "n3", value: 3, left: { id: "n1", value: 1, right: { id: "n2", value: 2 } }, right: { id: "n4", value: 4 } },
  right: { id: "n8", value: 8, left: { id: "n7", value: 7 }, right: { id: "n9", value: 9 } },
};

function tree(highlighted: string[], visited: string[] = []): VisualState {
  return { type: "tree", title: "BST", root, highlighted, visited };
}

export const lowestCommonAncestorOfABST: Problem = {
  slug: "lowest-common-ancestor-of-a-bst",
  number: 235,
  title: "Lowest Common Ancestor in BST",
  difficulty: "Medium",
  category: "Trees",
  leetcodeUrl: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
  author: ELBER,
  solutions: [
    {
      name: "BST Walk",
      input: "p = 1, q = 2",
      code,
      steps: [
        {
          lines: [3, 6, 10],
          label: "Find the lowest common ancestor of 1 and 2. At `cur` = root 5: both `p.val` and `q.val` are less than 5, so both live in the left subtree → go left.",
          variables: { "p.val": "1", "q.val": "2" },
          visuals: [tree(["n5"])],
        },
        {
          lines: [10, 12],
          label: "At `cur` = node 3: both 1 and 2 are still less than 3 → go left again.",
          visuals: [tree(["n3"], ["n5"])],
        },
        {
          lines: [6, 10, 14, 16],
          label: "At `cur` = node 1: neither branch fires (1 isn't > 1, and not both values are < 1). The paths split here — and 1 is itself a target. Return `cur`.",
          visuals: [tree(["n1"], ["n5", "n3"])],
        },
        {
          lines: [16],
          label: "Node 1 is the lowest node that is an ancestor of both `p` = 1 and `q` = 2 — and a node counts as its own ancestor. ✓",
          variables: { result: "1" },
          visuals: [tree(["n1"], ["n5", "n3"])],
        },
      ],
      approach: {
        summary:
          "In a BST you can walk straight to the LCA without searching subtrees. From the root: if both targets are larger than the current node, the LCA is to the right; if both are smaller, it's to the left. The moment they split — one on each side, or one equals the current node — that node is the lowest common ancestor.",
        timeComplexity: "O(h) — one downward walk.",
        spaceComplexity: "O(1) — iterative, no recursion stack.",
        notes: [
          "The BST ordering is what makes this O(h) with no backtracking; a general binary tree would force you to search both subtrees.",
          "The split is the else branch — it fires when the two values straddle cur, or when one of them equals cur.",
          "A node is its own ancestor, which is why reaching one of the targets (p == cur) returns it instead of descending past.",
          "Iterative with O(1) space; the recursive version reads the same but uses O(h) stack.",
        ],
      },
    },
  ],
};
