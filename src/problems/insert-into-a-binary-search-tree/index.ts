import type { Problem, TreeVisualNode, VisualState } from "../../domain/types";
import { ELBER } from "../authors";

// Elber's actual solution from LeetcodePractice/Problems/Trees/InsertIntoBinarySearchTree,
// presented in LeetCode submission format.
const code = `public class Solution {
    public TreeNode InsertIntoBST(TreeNode root, int val) {
        if (root == null)
        {
            return new TreeNode(val);
        }
        TreeNode cur = root;
        if (val > cur.val)
        {
            cur.right = InsertIntoBST(cur.right, val);
        }
        else if (val < cur.val)
        {
            cur.left = InsertIntoBST(cur.left, val);
        }
        return cur;
    }
}`;

const before: TreeVisualNode = {
  id: "n5", value: 5,
  left: { id: "n3", value: 3, left: { id: "n1", value: 1 }, right: { id: "n4", value: 4 } },
  right: { id: "n9", value: 9 },
};
const after: TreeVisualNode = {
  id: "n5", value: 5,
  left: { id: "n3", value: 3, left: { id: "n1", value: 1 }, right: { id: "n4", value: 4 } },
  right: { id: "n9", value: 9, left: { id: "n6", value: 6 } },
};

function treeBefore(highlighted: string[], visited: string[] = []): VisualState {
  return { type: "tree", title: "tree", root: before, highlighted, visited };
}
function treeAfter(highlighted: string[], visited: string[] = []): VisualState {
  return { type: "tree", title: "tree", root: after, highlighted, visited };
}

export const insertIntoABinarySearchTree: Problem = {
  slug: "insert-into-a-binary-search-tree",
  number: 701,
  title: "Insert into a Binary Search Tree",
  difficulty: "Medium",
  category: "Trees",
  leetcodeUrl: "https://leetcode.com/problems/insert-into-a-binary-search-tree/",
  author: ELBER,
  solutions: [
    {
      name: "Recursive Search",
      input: "root = [5, 3, 9, 1, 4], val = 6",
      code,
      steps: [
        {
          lines: [2, 7, 8],
          label: "Insert `val` = 6. At root 5: 6 > 5, so it belongs somewhere in the RIGHT subtree. Recurse right.",
          variables: { val: "6" },
          visuals: [treeBefore(["n5"])],
        },
        {
          lines: [10, 12, 14],
          label: "At node 9: 6 < 9, so go LEFT. Recurse into 9's left child.",
          visuals: [treeBefore(["n9"], ["n5"])],
        },
        {
          lines: [2, 3, 5],
          label: "9's left child is `null` — the empty spot. Create a new node 6 and return it.",
          visuals: [treeAfter(["n6"], ["n5", "n9"])],
        },
        {
          lines: [14, 17],
          label: "Unwinding: `cur.right` (for node 9) becomes the new node 6, and each parent returns `cur` unchanged.",
          visuals: [treeAfter(["n6"], ["n5", "n9"])],
        },
        {
          lines: [17],
          label: "Return the (same) `root`. The BST now holds 6 in its correct sorted position. ✓",
          variables: { result: "[5, 3, 9, 1, 4, 6]" },
          visuals: [treeAfter([], ["n5", "n3", "n9", "n1", "n4", "n6"])],
        },
      ],
      approach: {
        summary:
          "A BST insert is a search that doesn't give up. Compare the value to each node — greater means go right, smaller means go left. When you reach a null child, that's exactly where the value belongs, so create the node there. The recursion returns each subtree (possibly with a freshly grafted leaf) back up to its parent.",
        timeComplexity: "O(h) — one root-to-leaf path.",
        spaceComplexity: "O(h) — recursion stack.",
        notes: [
          "The null base case IS the insertion point — returning new TreeNode(val) and assigning it to a parent's child link grafts it on.",
          "cur.right = InsertIntoBST(cur.right, val) is the idiom that handles 'attach here' uniformly; most calls just reassign the same child back unchanged.",
          "Equal values take neither branch — LeetCode guarantees the value isn't already present.",
          "O(h): balanced gives O(log n), a degenerate stick gives O(n).",
        ],
      },
    },
  ],
};
