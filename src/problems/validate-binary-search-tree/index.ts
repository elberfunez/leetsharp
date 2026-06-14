import type { Problem, TreeVisualNode, VisualState } from "../../domain/types";

// Elber's actual solution from LeetcodePractice/Problems/Trees/ValidBinarySearchTree,
// presented in LeetCode submission format.
const code = `public class Solution {
    public bool IsValidBST(TreeNode root) {
        return Validate(root, long.MinValue, long.MaxValue);
    }

    private bool Validate(TreeNode node, long min, long max) {
        if (node == null) return true;
        if (node.val <= min || node.val >= max) return false;
        bool leftValid = Validate(node.left, min, node.val);
        bool rightValid = Validate(node.right, node.val, max);
        return leftValid && rightValid;
    }
}`;

const root: TreeVisualNode = { id: "n2", value: 2, left: { id: "n1", value: 1 }, right: { id: "n3", value: 3 } };

function tree(highlighted: string[], annotations: Record<string, string>, visited: string[] = []): VisualState {
  return { type: "tree", title: "tree", root, highlighted, annotations, visited };
}

export const validateBinarySearchTree: Problem = {
  slug: "validate-binary-search-tree",
  number: 98,
  title: "Valid Binary Search Tree",
  difficulty: "Medium",
  category: "Trees",
  leetcodeUrl: "https://leetcode.com/problems/validate-binary-search-tree/",
  solutions: [
    {
      name: "Min/Max Bounds",
      input: "root = [2, 1, 3]",
      code,
      steps: [
        {
          lines: [2, 6, 7, 8],
          label: "A node is valid only if it fits a (min, max) range that tightens as you descend. The root gets the widest range (−∞, +∞) — 2 fits.",
          variables: { range: "(-∞, +∞)" },
          visuals: [tree(["n2"], { n2: "(-∞,+∞)" })],
        },
        {
          lines: [9, 8],
          label: "Go left to 1. Everything left of 2 must be < 2, so the range becomes (−∞, 2). 1 fits.",
          variables: { range: "(-∞, 2)" },
          visuals: [tree(["n1"], { n2: "(-∞,+∞)", n1: "(-∞,2)" }, ["n2"])],
        },
        {
          lines: [10, 8],
          label: "Go right to 3. Everything right of 2 must be > 2, so the range is (2, +∞). 3 fits.",
          variables: { range: "(2, +∞)" },
          visuals: [tree(["n3"], { n2: "(-∞,+∞)", n1: "(-∞,2)", n3: "(2,+∞)" }, ["n2", "n1"])],
        },
        {
          lines: [11],
          label: "Every node satisfied its range and all recursions bottomed out at null → return true. ✓",
          variables: { result: "true" },
          visuals: [tree([], { n2: "(-∞,+∞)", n1: "(-∞,2)", n3: "(2,+∞)" }, ["n2", "n1", "n3"])],
        },
      ],
      approach: {
        summary:
          "It is NOT enough for each node to be bigger than its left child and smaller than its right — the BST property is global. So pass down a valid (min, max) window: going left tightens the max to the current value, going right tightens the min. A node is valid only if it fits its window, and the tree is valid only if every node does.",
        timeComplexity: "O(n) — each node is checked once.",
        spaceComplexity: "O(h) — recursion stack.",
        notes: [
          "The classic bug is comparing a node only to its direct children. A node deep on the left must still be smaller than a far-up ancestor — the (min, max) window enforces exactly that.",
          "long.MinValue / long.MaxValue (not int) avoid a false negative when a node's value is itself int.MinValue or int.MaxValue.",
          "Descending left sets max = node.val; descending right sets min = node.val — that's how the constraint propagates downward.",
          "An in-order traversal that verifies values come out strictly increasing is an equivalent O(n) check.",
        ],
      },
    },
  ],
};
