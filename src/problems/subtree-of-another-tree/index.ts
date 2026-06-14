import type { Problem, TreeVisualNode, VisualState } from "../../domain/types";

// Elber's actual solution from LeetcodePractice/Problems/Trees/SubtreeOfAnotherTree,
// presented in LeetCode submission format.
const code = `public class Solution {
    public bool IsSubtree(TreeNode root, TreeNode subRoot) {
        if (subRoot == null) return true;
        if (root == null) return false;
        if (SameTree(root, subRoot)) return true;
        else
        {
            return IsSubtree(root.left, subRoot) || IsSubtree(root.right, subRoot);
        }
    }

    public bool SameTree(TreeNode p, TreeNode q) {
        if (p == null && q == null) return true;
        if (p != null && q == null) return false;
        if (p.val != q.val) return false;
        bool leftSideSame = SameTree(p.left, q.left);
        bool rightSideSame = SameTree(p.right, q.right);
        return leftSideSame && rightSideSame;
    }
}`;

const root: TreeVisualNode = {
  id: "r1", value: 1,
  left: { id: "r2", value: 2, left: { id: "r4", value: 4 }, right: { id: "r5", value: 5 } },
  right: { id: "r3", value: 3 },
};
const subRoot: TreeVisualNode = { id: "s2", value: 2, left: { id: "s4", value: 4 }, right: { id: "s5", value: 5 } };

function trees(hRoot: string[], hSub: string[], vRoot: string[] = []): VisualState[] {
  return [
    { type: "tree", title: "root", root, highlighted: hRoot, visited: vRoot },
    { type: "tree", title: "subRoot", root: subRoot, highlighted: hSub },
  ];
}

export const subtreeOfAnotherTree: Problem = {
  slug: "subtree-of-another-tree",
  number: 572,
  title: "Subtree of Another Tree",
  difficulty: "Easy",
  category: "Trees",
  leetcodeUrl: "https://leetcode.com/problems/subtree-of-another-tree/",
  solutions: [
    {
      name: "SameTree at Each Node",
      input: "root = [1, 2, 3, 4, 5], subRoot = [2, 4, 5]",
      code,
      steps: [
        {
          lines: [2, 5],
          label: "Is the small tree an exact subtree of the big one? Try each node of the big tree as a candidate match point. Start at root 1: SameTree(1, 2)?",
          visuals: trees(["r1"], ["s2"]),
        },
        {
          lines: [5, 14, 8],
          label: "SameTree(1, 2): values 1 ≠ 2 → not a match here. Recurse: try the left subtree, then (if needed) the right.",
          visuals: trees(["r1"], ["s2"], []),
        },
        {
          lines: [8, 5],
          label: "Candidate node 2 (root's left child). SameTree(2, 2): root values match — now compare children.",
          visuals: trees(["r2"], ["s2"], ["r1"]),
        },
        {
          lines: [17, 18, 19],
          label: "Left children 4 = 4, right children 5 = 5, and their children are all null. Every node matches!",
          visuals: trees(["r4", "r5"], ["s4", "s5"], ["r1", "r2"]),
        },
        {
          lines: [5],
          label: "SameTree returned true → the subtree hanging off node 2 is exactly [2, 4, 5]. Return true. ✓",
          variables: { result: "true" },
          visuals: trees(["r2", "r4", "r5"], ["s2", "s4", "s5"], ["r1"]),
        },
      ],
      approach: {
        summary:
          "Two nested recursions. The outer one tries every node of the big tree as a potential match point; the inner SameTree checks whether the subtree rooted there is identical to subRoot. If any candidate yields a full match, subRoot is a subtree. It stops as soon as one matches.",
        timeComplexity: "O(n · m) — for each of n nodes, a SameTree check up to size m.",
        spaceComplexity: "O(h) — recursion depth.",
        notes: [
          "It reuses the exact SameTree logic from problem #100 as the inner equality test — a nice example of composing solutions.",
          "The || short-circuits: once a matching subtree is found in the left side, the right side is never searched.",
          "A subtree must match in full — same structure AND values from the candidate node all the way down, which is why SameTree (not a value check) is the test.",
          "Hashing each subtree's serialization can bring this down to O(n + m), but the nested approach is the clear, interview-friendly one.",
        ],
      },
    },
  ],
};
