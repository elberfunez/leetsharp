import type { Problem, TreeVisualNode, VisualState } from "../../domain/types";
import { ELBER } from "../authors";

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
  description: `# Valid Binary Search Tree

**Difficulty:** Medium  
**Topic:** Trees

---

## Description

Given the root of a binary tree, return \`true\` if it is a valid binary search tree, otherwise return \`false\`.

A valid binary search tree satisfies the following constraints:

- The left subtree of every node contains only nodes with keys less than the node's key.
- The right subtree of every node contains only nodes with keys greater than the node's key.
- Both the left and right subtrees are also binary search trees.

---

## Examples

### Example 1:

\`\`\`
Input: root = [2,1,3]

Output: true

Explanation: Tree structure:
    2
   / \\
  1   3

Node 2: left (1) < 2 < right (3) ✓
Valid BST.
\`\`\`

### Example 2:

\`\`\`
Input: root = [1,2,3]

Output: false

Explanation: Tree structure:
    1
   / \\
  2   3

Node 1: left (2) > 1, violates BST property ✗
Not a valid BST.
\`\`\`

---

## Constraints

- \`1 <= The number of nodes in the tree <= 1000\`
- \`-1000 <= Node.val <= 1000\``,
  author: ELBER,
  solutions: [
    {
      name: "Min/Max Bounds",
      input: "root = [2, 1, 3]",
      code,
      steps: [
        {
          lines: [2, 6, 7, 8],
          label: "A node is valid only if it fits a (`min`, `max`) range that tightens as you descend. The root gets the widest range (−∞, +∞) — 2 fits.",
          variables: { range: "(-∞, +∞)" },
          visuals: [tree(["n2"], { n2: "(-∞,+∞)" })],
        },
        {
          lines: [9, 8],
          label: "Go left to 1. Everything left of 2 must be < 2, so `max` becomes 2. Range: (−∞, 2). 1 fits.",
          variables: { range: "(-∞, 2)" },
          visuals: [tree(["n1"], { n2: "(-∞,+∞)", n1: "(-∞,2)" }, ["n2"])],
        },
        {
          lines: [10, 8],
          label: "Go right to 3. Everything right of 2 must be > 2, so `min` becomes 2. Range: (2, +∞). 3 fits.",
          variables: { range: "(2, +∞)" },
          visuals: [tree(["n3"], { n2: "(-∞,+∞)", n1: "(-∞,2)", n3: "(2,+∞)" }, ["n2", "n1"])],
        },
        {
          lines: [11],
          label: "Every node satisfied its range and all recursions bottomed out at `null` → return `true`. ✓",
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
