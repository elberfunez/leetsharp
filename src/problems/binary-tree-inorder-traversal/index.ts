import type { Problem, TreeVisualNode, VisualState } from "../../domain/types";
import { ELBER } from "../authors";

// Elber's two actual solutions from
// LeetcodePractice/Problems/Trees/BinaryTreeInorderTraversal/Solutions/{Recursive,Iterative}.cs,
// presented in LeetCode submission format.
const recursiveCode = `public class Solution {
    public List<int> InorderTraversal(TreeNode root) {
        List<int> result = new();
        Traverse(root, result);
        return result;
    }

    private void Traverse(TreeNode node, List<int> res) {
        if (node == null) return;
        Traverse(node.left, res);
        res.Add(node.val);       // node BETWEEN children
        Traverse(node.right, res);
    }
}`;

const iterativeCode = `public class Solution {
    public List<int> InorderTraversal(TreeNode root) {
        List<int> result = new();
        Stack<TreeNode> stack = new Stack<TreeNode>();
        TreeNode cur = root;
        while (cur != null || stack.Count > 0)
        {
            while (cur != null)        // plunge left, pushing
            {
                stack.Push(cur);
                cur = cur.left;
            }
            cur = stack.Pop();         // leftmost unvisited
            result.Add(cur.val);
            cur = cur.right;           // then go right
        }
        return result;
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
function stack(items: string[]): VisualState {
  return { type: "stack", title: "stack", items };
}

export const binaryTreeInorderTraversal: Problem = {
  slug: "binary-tree-inorder-traversal",
  number: 94,
  title: "Binary Tree Inorder Traversal",
  difficulty: "Easy",
  category: "Trees",
  leetcodeUrl: "https://leetcode.com/problems/binary-tree-inorder-traversal/",
  author: ELBER,
  solutions: [
    {
      name: "Recursion",
      input: "root = [1, 2, 3, 4, 5, 6, 7]",
      code: recursiveCode,
      steps: [
        {
          lines: [9, 10],
          label: "Inorder = left subtree, then NODE, then right subtree. So we recurse all the way down the left first, before recording anything.",
          visuals: [tree(["n1"], []), result([])],
        },
        {
          lines: [10, 11],
          label: "Descend 1 → 2 → 4. Node 4 has no left child, so it's the very first value recorded. Add 4.",
          visuals: [tree(["n4"], []), result([4])],
        },
        {
          lines: [11, 12],
          label: "Back up to 2: its left subtree is done, so add 2, then head into its right child.",
          visuals: [tree(["n2"], ["n4"]), result([4, 2])],
        },
        {
          lines: [11],
          label: "Node 5 (a leaf): add 5. The root's entire left subtree is now finished.",
          visuals: [tree(["n5"], ["n4", "n2"]), result([4, 2, 5])],
        },
        {
          lines: [11],
          label: "Add the root, 1.",
          visuals: [tree(["n1"], ["n4", "n2", "n5"]), result([4, 2, 5, 1])],
        },
        {
          lines: [10, 11],
          label: "Into the right subtree: descend to 3, then its leftmost child 6. Add 6.",
          visuals: [tree(["n6"], ["n4", "n2", "n5", "n1"]), result([4, 2, 5, 1, 6])],
        },
        {
          lines: [11, 12],
          label: "Add 3, then go to its right child.",
          visuals: [tree(["n3"], ["n4", "n2", "n5", "n1", "n6"]), result([4, 2, 5, 1, 6, 3])],
        },
        {
          lines: [11],
          label: "Node 7: add 7.",
          visuals: [tree(["n7"], ["n4", "n2", "n5", "n1", "n6", "n3"]), result([4, 2, 5, 1, 6, 3, 7])],
        },
        {
          lines: [4],
          label: "Return [4, 2, 5, 1, 6, 3, 7]. For a BST, inorder always comes out sorted. ✓",
          variables: { result: "[4, 2, 5, 1, 6, 3, 7]" },
          visuals: [tree([], ["n4", "n2", "n5", "n1", "n6", "n3", "n7"]), result([4, 2, 5, 1, 6, 3, 7])],
        },
      ],
      approach: {
        summary:
          "Inorder visits a node BETWEEN its subtrees: recurse left, record the node, recurse right. Placing res.Add between the two recursive calls is the entire difference from pre- and post-order. The recursion follows the definition exactly.",
        timeComplexity: "O(n) — each node visited once.",
        spaceComplexity: "O(h) — recursion stack.",
        notes: [
          "res.Add(node.val) sits BETWEEN the two recursions — that placement is what makes it inorder rather than pre/post.",
          "On a binary SEARCH tree, inorder yields values in sorted order — the basis for the Validate-BST and Kth-Smallest tricks.",
          "Clean and short, but the call stack is implicit — see the Iterative tab to make it visible.",
          "Recursion depth is the tree height h.",
        ],
      },
    },
    {
      name: "Iterative (Stack)",
      input: "root = [1, 2, 3, 4, 5, 6, 7]",
      code: iterativeCode,
      steps: [
        {
          lines: [3, 4, 5],
          label: "Same traversal, but we run the call stack ourselves with an explicit `Stack`. Plunge down the left spine, pushing each node.",
          visuals: [tree(["n1"], []), stack([]), result([])],
        },
        {
          lines: [7, 8, 9],
          label: "Push 1, 2, 4 as we go left. Node 4 has no left child → stop plunging.",
          visuals: [tree(["n4"], []), stack(["1", "2", "4"]), result([])],
        },
        {
          lines: [11, 12, 13],
          label: "Pop 4 (the leftmost), record it, then move to 4's right child (`null`).",
          visuals: [tree([], ["n4"]), stack(["1", "2"]), result([4])],
        },
        {
          lines: [11, 12, 13],
          label: "`cur` is `null`, so pop 2, record it, and move to 2's right child, 5.",
          visuals: [tree(["n5"], ["n4", "n2"]), stack(["1"]), result([4, 2])],
        },
        {
          lines: [7, 8, 11, 12],
          label: "Plunge to 5 (push it, no left child), then pop and record 5. Its right is null.",
          visuals: [tree([], ["n4", "n2", "n5"]), stack(["1"]), result([4, 2, 5])],
        },
        {
          lines: [11, 12, 13],
          label: "Pop the root 1, record it, move to its right subtree (3).",
          visuals: [tree(["n3"], ["n4", "n2", "n5", "n1"]), stack([]), result([4, 2, 5, 1])],
        },
        {
          lines: [7, 8, 9],
          label: "Plunge left into the right subtree: push 3, push 6. 6 is leftmost.",
          visuals: [tree(["n6"], ["n4", "n2", "n5", "n1"]), stack(["3", "6"]), result([4, 2, 5, 1])],
        },
        {
          lines: [11, 12, 13],
          label: "Pop 6 (record), then pop 3 (record) and move to 3's right child, 7.",
          visuals: [tree(["n7"], ["n4", "n2", "n5", "n1", "n6", "n3"]), stack([]), result([4, 2, 5, 1, 6, 3])],
        },
        {
          lines: [7, 8, 11, 12],
          label: "Push 7, pop 7, record it. Stack empty and `cur` = `null` → done.",
          visuals: [tree([], ["n4", "n2", "n5", "n1", "n6", "n3", "n7"]), stack([]), result([4, 2, 5, 1, 6, 3, 7])],
        },
        {
          lines: [17],
          label: "Return `result` = [4, 2, 5, 1, 6, 3, 7] — identical to the recursive result. ✓",
          variables: { result: "[4, 2, 5, 1, 6, 3, 7]" },
          visuals: [tree([], ["n4", "n2", "n5", "n1", "n6", "n3", "n7"]), stack([]), result([4, 2, 5, 1, 6, 3, 7])],
        },
      ],
      approach: {
        summary:
          "The same left-node-right order, but managing the stack explicitly instead of relying on recursion. Push nodes while diving left; when you can't go left anymore, the top of the stack is the next node in order — pop it, record it, then turn to its right subtree and repeat.",
        timeComplexity: "O(n) — each node is pushed and popped exactly once.",
        spaceComplexity: "O(h) — the stack holds at most one root-to-leaf path.",
        notes: [
          "This makes the recursion's hidden call stack visible — the Stack<TreeNode> is doing exactly what the runtime did implicitly.",
          "The inner while drives all the way down-left; the outer loop continues as long as either cur is non-null or the stack has work.",
          "After recording a node you move to its right child — its left side was already handled on the way down.",
          "Useful when recursion depth could overflow the call stack, or when you need to pause/resume traversal mid-stream.",
        ],
      },
    },
  ],
};
