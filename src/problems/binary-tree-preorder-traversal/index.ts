import type { Problem, TreeVisualNode, VisualState } from "../../domain/types";
import { ELBER } from "../authors";

// Elber's actual recursive solution from
// LeetcodePractice/Problems/Trees/BinaryTreePreorderTraversal/Solutions/Recursive.cs,
// presented in LeetCode submission format.
const code = `public class Solution {
    public List<int> PreorderTraversal(TreeNode root) {
        List<int> result = new();
        Traverse(root, result);
        return result;
    }

    private void Traverse(TreeNode node, List<int> res) {
        if (node == null) return;
        res.Add(node.val);      // node first (pre)
        Traverse(node.left, res);
        Traverse(node.right, res);
    }
}`;

const root: TreeVisualNode = {
  id: "n1", value: 1,
  left: { id: "n2", value: 2, left: { id: "n4", value: 4 }, right: { id: "n5", value: 5 } },
  right: { id: "n3", value: 3, left: { id: "n6", value: 6 }, right: { id: "n7", value: 7 } },
};

function tree(highlighted: string[], visited: string[]): VisualState {
  return { type: "tree", title: "tree", root, highlighted, visited };
}
function result(items: number[]): VisualState {
  return { type: "array", title: "result", items, highlighted: items.length ? [items.length - 1] : [] };
}

export const binaryTreePreorderTraversal: Problem = {
  slug: "binary-tree-preorder-traversal",
  number: 144,
  title: "Binary Tree Preorder Traversal",
  difficulty: "Easy",
  category: "Trees",
  leetcodeUrl: "https://leetcode.com/problems/binary-tree-preorder-traversal/",
  author: ELBER,
  solutions: [
    {
      name: "Recursion",
      input: "root = [1, 2, 3, 4, 5, 6, 7]",
      code,
      steps: [
        {
          lines: [9, 10],
          label: "Preorder = NODE first, then left subtree, then right. So the root is recorded immediately. Add 1.",
          visuals: [tree(["n1"], []), result([1])],
        },
        {
          lines: [11, 10],
          label: "Dive left to 2 — and again, record it before its children. Add 2.",
          visuals: [tree(["n2"], ["n1"]), result([1, 2])],
        },
        {
          lines: [10],
          label: "2's left child 4 (a leaf): add 4.",
          visuals: [tree(["n4"], ["n1", "n2"]), result([1, 2, 4])],
        },
        {
          lines: [12, 10],
          label: "2's right child 5: add 5. The left subtree of the root is finished.",
          visuals: [tree(["n5"], ["n1", "n2", "n4"]), result([1, 2, 4, 5])],
        },
        {
          lines: [12, 10],
          label: "Now the root's right subtree. At 3: add 3 before descending.",
          visuals: [tree(["n3"], ["n1", "n2", "n4", "n5"]), result([1, 2, 4, 5, 3])],
        },
        {
          lines: [10],
          label: "3's left child 6: add 6.",
          visuals: [tree(["n6"], ["n1", "n2", "n4", "n5", "n3"]), result([1, 2, 4, 5, 3, 6])],
        },
        {
          lines: [12, 10],
          label: "3's right child 7: add 7.",
          visuals: [tree(["n7"], ["n1", "n2", "n4", "n5", "n3", "n6"]), result([1, 2, 4, 5, 3, 6, 7])],
        },
        {
          lines: [4],
          label: "Return `result` = [1, 2, 4, 5, 3, 6, 7]. ✓",
          variables: { result: "[1, 2, 4, 5, 3, 6, 7]" },
          visuals: [tree([], ["n1", "n2", "n4", "n5", "n3", "n6", "n7"]), result([1, 2, 4, 5, 3, 6, 7])],
        },
      ],
      approach: {
        summary:
          "Preorder visits a node BEFORE its children: record the node, recurse left, recurse right. The code mirrors that definition line-for-line — the only difference from in-order and post-order is where res.Add sits relative to the two recursive calls.",
        timeComplexity: "O(n) — each node is visited once.",
        spaceComplexity: "O(h) — recursion stack, h = tree height.",
        notes: [
          "The position of res.Add(node.val) is the whole story: before both recursions = preorder, between = inorder, after = postorder.",
          "Preorder famously reproduces a tree's structure top-down, which is why it's used to serialize / clone trees.",
          "The iterative version uses an explicit Stack: pop a node, record it, then push RIGHT then LEFT so left comes off first.",
          "Recursion depth is the height h — O(log n) balanced, O(n) skewed.",
        ],
      },
    },
  ],
};
