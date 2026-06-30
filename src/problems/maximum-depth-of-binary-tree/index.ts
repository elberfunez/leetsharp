import type { Approach, Problem, Step, TreeVisualState, VisualState } from "../../domain/types";
import { ELBER } from "../authors";

// Elber's actual BFS solution from
// LeetcodePractice/Problems/Trees/MaximumDepthOfBinaryTree/Solutions/BFS.cs,
// presented in LeetCode submission format. (He also solved the recursive DFS
// version — BFS is the one visualized because you can watch the queue work.)
const bfsCode = `public class Solution {
    public int MaxDepth(TreeNode root) {
        // base case
        if (root == null) return 0;

        Queue<TreeNode> q = new();
        q.Enqueue(root);
        int depth = 0;

        while (q.Count > 0)
        {
            depth++;
            int qLength = q.Count;

            for (int i = 0; i < qLength; i++)
            {
                TreeNode current = q.Dequeue();
                if (current.left != null) q.Enqueue(current.left);
                if (current.right != null) q.Enqueue(current.right);
            }
        }
        return depth;
    }
}`;

/** Traced input (Example 1 from the practice repo): root = [1, 2, 3, null, null, 4]
 *
 *        1          depth 1
 *       / \
 *      2   3        depth 2
 *         /
 *        4          depth 3
 */
const root = {
  id: "n1",
  value: 1,
  left: { id: "n2", value: 2 },
  right: { id: "n3", value: 3, left: { id: "n4", value: 4 } },
};

function tree(overrides?: Partial<TreeVisualState>): VisualState {
  return { type: "tree", title: "tree", root, ...overrides };
}

function queue(items: number[], highlightLast = false): VisualState {
  return {
    type: "array",
    title: "queue (front first)",
    items,
    highlighted: highlightLast && items.length > 0 ? [items.length - 1] : [],
  };
}

// Elber's recursive DFS solution from the same problem's Solutions/DFS.cs.
const dfsCode = `public class Solution {
    public int MaxDepth(TreeNode root) {
        // base case
        if (root == null) return 0;
        // use recursion with DFS
        int maxDepthLeftSide = MaxDepth(root.left);
        int maxDepthRightSide = MaxDepth(root.right);
        return 1 + Math.Max(maxDepthLeftSide, maxDepthRightSide);
    }
}`;

/** The recursion's call stack, top frame is the call running right now. */
function callStack(frames: string[], topActive = false): VisualState {
  return { type: "stack", title: "call stack", items: frames, topActive };
}

const dfsSteps: Step[] = [
  {
    lines: [4],
    label: "Call MaxDepth(1). Node 1 isn't null, so we skip the base case — we'll need the depth of both subtrees.",
    visuals: [tree({ highlighted: ["n1"] }), callStack(["MaxDepth(1)"], true)],
  },
  {
    lines: [6],
    label: "Left side first: recurse into node 2 → MaxDepth(2). The call stack grows.",
    visuals: [tree({ highlighted: ["n2"] }), callStack(["MaxDepth(1)", "MaxDepth(2)"], true)],
  },
  {
    lines: [6],
    label: "MaxDepth(2): node 2's left child is null → MaxDepth(null) hits the base case and returns 0.",
    variables: { maxDepthLeftSide: "0" },
    visuals: [tree({ highlighted: ["n2"] }), callStack(["MaxDepth(1)", "MaxDepth(2)"])],
  },
  {
    lines: [7],
    label: "Node 2's right child is also null → returns 0. Both of node 2's sides are 0.",
    variables: { maxDepthLeftSide: "0", maxDepthRightSide: "0" },
    visuals: [tree({ highlighted: ["n2"] }), callStack(["MaxDepth(1)", "MaxDepth(2)"])],
  },
  {
    lines: [8],
    label: "Node 2 is a leaf — both subtrees are empty (depth 0). Its own depth is 1. Pop it off the call stack.",
    visuals: [
      tree({ visited: ["n2"], annotations: { n2: "1" } }),
      callStack(["MaxDepth(1)"]),
    ],
  },
  {
    lines: [6],
    label: "Back in MaxDepth(1): `maxDepthLeftSide` = 1.",
    variables: { maxDepthLeftSide: "1" },
    visuals: [
      tree({ highlighted: ["n1"], visited: ["n2"], annotations: { n2: "1" } }),
      callStack(["MaxDepth(1)"]),
    ],
  },
  {
    lines: [7],
    label: "Now the right side: recurse into node 3 → MaxDepth(3).",
    visuals: [
      tree({ highlighted: ["n3"], visited: ["n2"], annotations: { n2: "1" } }),
      callStack(["MaxDepth(1)", "MaxDepth(3)"], true),
    ],
  },
  {
    lines: [6],
    label: "MaxDepth(3): node 3 has a left child → recurse deeper into node 4 → MaxDepth(4).",
    visuals: [
      tree({ highlighted: ["n4"], visited: ["n2"], annotations: { n2: "1" } }),
      callStack(["MaxDepth(1)", "MaxDepth(3)", "MaxDepth(4)"], true),
    ],
  },
  {
    lines: [6, 7],
    label: "MaxDepth(4): both children are null → left and right both return 0.",
    variables: { maxDepthLeftSide: "0", maxDepthRightSide: "0" },
    visuals: [
      tree({ highlighted: ["n4"], visited: ["n2"], annotations: { n2: "1" } }),
      callStack(["MaxDepth(1)", "MaxDepth(3)", "MaxDepth(4)"]),
    ],
  },
  {
    lines: [8],
    label: "Node 4 is a leaf — both subtrees are empty. Its depth is 1. Pop it.",
    visuals: [
      tree({ visited: ["n2", "n4"], annotations: { n2: "1", n4: "1" } }),
      callStack(["MaxDepth(1)", "MaxDepth(3)"]),
    ],
  },
  {
    lines: [7],
    label: "Back in MaxDepth(3): `maxDepthLeftSide` = 1. Its right child is `null` → MaxDepth(null) returns 0.",
    variables: { maxDepthLeftSide: "1", maxDepthRightSide: "0" },
    visuals: [
      tree({ highlighted: ["n3"], visited: ["n2", "n4"], annotations: { n2: "1", n4: "1" } }),
      callStack(["MaxDepth(1)", "MaxDepth(3)"]),
    ],
  },
  {
    lines: [8],
    label: "Node 3's left subtree is depth 1, right is empty — its own depth is 2. Pop it.",
    visuals: [
      tree({ visited: ["n2", "n3", "n4"], annotations: { n2: "1", n3: "2", n4: "1" } }),
      callStack(["MaxDepth(1)"]),
    ],
  },
  {
    lines: [7],
    label: "Back in MaxDepth(1): `maxDepthRightSide` = 2 (`maxDepthLeftSide` was 1).",
    variables: { maxDepthLeftSide: "1", maxDepthRightSide: "2" },
    visuals: [
      tree({ highlighted: ["n1"], visited: ["n2", "n3", "n4"], annotations: { n2: "1", n3: "2", n4: "1" } }),
      callStack(["MaxDepth(1)"]),
    ],
  },
  {
    lines: [8],
    label: "Root's right subtree (depth 2) is deeper than the left (depth 1) — the root's total depth is 3. The path 1→3→4 wins. ✓",
    variables: { result: "3" },
    visuals: [
      tree({ annotations: { n1: "3", n2: "1", n3: "2", n4: "1" } }),
      callStack([]),
    ],
  },
];

const dfsApproach: Approach = {
  summary:
    "Depth-first recursion: a tree's depth is 1 (for the current node) plus the deeper of its two subtrees. The base case — a null node has depth 0 — stops the recursion, and each call combines its children's answers on the way back up. The call stack does the level-tracking bookkeeping that BFS did explicitly with a queue.",
  timeComplexity: "O(n) — every node is visited exactly once.",
  spaceComplexity: "O(h) — the recursion call stack, where h is the tree height. O(log n) balanced, O(n) for a skewed tree.",
  notes: [
    "Same answer as BFS in far fewer lines — but the cost moves from a visible queue to the call stack, which you can't watch at runtime.",
    "Math.Max picks the deeper subtree; the + 1 counts the current node's own level.",
    "Every null child bottoms out at return 0, so a leaf computes 1 + max(0, 0) = 1.",
    "Elegant, but a pathologically deep tree (tens of thousands of nodes in a line) can overflow the stack — the iterative BFS version sidesteps that.",
  ],
};

export const maximumDepthOfBinaryTree: Problem = {
  slug: "maximum-depth-of-binary-tree",
  number: 104,
  title: "Maximum Depth of Binary Tree",
  difficulty: "Easy",
  category: "Trees",
  leetcodeUrl: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
  description: `# Maximum Depth of Binary Tree

**Difficulty:** Easy  
**Topic:** Trees

---

## Description

Given the root of a binary tree, return its depth.

The depth of a binary tree is defined as the number of nodes along the longest path from the root node down to the farthest leaf node.

---

## Examples

### Example 1:

\`\`\`
Input: root = [1,2,3,null,null,4]

Output: 3

Explanation: The tree structure is:
    1
   / \\
  2   3
     /
    4

The longest path from root to leaf is 1 → 3 → 4, which has 3 nodes.
\`\`\`

### Example 2:

\`\`\`
Input: root = []

Output: 0

Explanation: Empty tree has depth 0.
\`\`\`

---

## Constraints

- \`0 <= The number of nodes in the tree <= 100\`
- \`-100 <= Node.val <= 100\``,
  author: ELBER,
  solutions: [
    {
      name: "BFS",
      input: "root = [1, 2, 3, null, null, 4]",
      code: bfsCode,
      steps: [
    {
      lines: [4],
      label: "Base case: root isn't null, so there's a tree to measure.",
      visuals: [tree({ highlighted: ["n1"] }), queue([])],
    },
    {
      lines: [6, 7],
      label: "Create a queue and enqueue the root. The queue always holds exactly one LEVEL of the tree.",
      visuals: [tree({ highlighted: ["n1"] }), queue([1], true)],
    },
    {
      lines: [8],
      label: "`depth` starts at 0 — we haven't processed any levels yet.",
      variables: { depth: "0" },
      visuals: [tree(), queue([1])],
    },
    {
      lines: [10],
      label: "Queue has 1 node → there's a level to process.",
      variables: { depth: "0" },
      visuals: [tree(), queue([1])],
    },
    {
      lines: [12, 13],
      label: "Level 1 begins: `depth` becomes 1. Snapshot the level size: `qLength` = 1 — that's how many nodes belong to THIS level.",
      variables: { depth: "1", qLength: "1" },
      visuals: [tree({ annotations: { n1: "d1" } }), queue([1])],
    },
    {
      lines: [17],
      label: "Dequeue node 1 — the only node on level 1.",
      variables: { depth: "1", qLength: "1", i: "0" },
      visuals: [tree({ highlighted: ["n1"], annotations: { n1: "d1" } }), queue([])],
    },
    {
      lines: [18],
      label: "Node 1 has a left child (2) → enqueue it for the next level.",
      variables: { depth: "1", qLength: "1", i: "0" },
      visuals: [
        tree({ highlighted: ["n2"], annotations: { n1: "d1" } }),
        queue([2], true),
      ],
    },
    {
      lines: [19],
      label: "Node 1 has a right child (3) → enqueue it too. Level 1 done; the queue now holds level 2.",
      variables: { depth: "1", qLength: "1", i: "0" },
      visuals: [
        tree({ highlighted: ["n3"], visited: ["n1"], annotations: { n1: "d1" } }),
        queue([2, 3], true),
      ],
    },
    {
      lines: [10],
      label: "Queue has 2 nodes → another level exists.",
      variables: { depth: "1" },
      visuals: [tree({ visited: ["n1"], annotations: { n1: "d1" } }), queue([2, 3])],
    },
    {
      lines: [12, 13],
      label: "Level 2: `depth` becomes 2, `qLength` = 2.",
      variables: { depth: "2", qLength: "2" },
      visuals: [
        tree({ visited: ["n1"], annotations: { n1: "d1", n2: "d2", n3: "d2" } }),
        queue([2, 3]),
      ],
    },
    {
      lines: [17, 18, 19],
      label: "i = 0: dequeue node 2. It's a leaf — both child checks fail, nothing enqueued.",
      variables: { depth: "2", qLength: "2", i: "0" },
      visuals: [
        tree({ highlighted: ["n2"], visited: ["n1"], annotations: { n1: "d1", n2: "d2", n3: "d2" } }),
        queue([3]),
      ],
    },
    {
      lines: [17, 18],
      label: "i = 1: dequeue node 3. It has a left child (4) → enqueue it. No right child.",
      variables: { depth: "2", qLength: "2", i: "1" },
      visuals: [
        tree({
          highlighted: ["n4"],
          visited: ["n1", "n2"],
          annotations: { n1: "d1", n2: "d2", n3: "d2" },
        }),
        queue([4], true),
      ],
    },
    {
      lines: [10],
      label: "Queue has 1 node → one more level.",
      variables: { depth: "2" },
      visuals: [
        tree({ visited: ["n1", "n2", "n3"], annotations: { n1: "d1", n2: "d2", n3: "d2" } }),
        queue([4]),
      ],
    },
    {
      lines: [12, 13],
      label: "Level 3: `depth` becomes 3, `qLength` = 1.",
      variables: { depth: "3", qLength: "1" },
      visuals: [
        tree({
          visited: ["n1", "n2", "n3"],
          annotations: { n1: "d1", n2: "d2", n3: "d2", n4: "d3" },
        }),
        queue([4]),
      ],
    },
    {
      lines: [17, 18, 19],
      label: "Dequeue node 4 — a leaf, nothing to enqueue. The queue is now empty.",
      variables: { depth: "3", qLength: "1", i: "0" },
      visuals: [
        tree({
          highlighted: ["n4"],
          visited: ["n1", "n2", "n3"],
          annotations: { n1: "d1", n2: "d2", n3: "d2", n4: "d3" },
        }),
        queue([]),
      ],
    },
    {
      lines: [10],
      label: "Queue is empty → no more levels. Exit the loop.",
      variables: { depth: "3" },
      visuals: [
        tree({
          visited: ["n1", "n2", "n3", "n4"],
          annotations: { n1: "d1", n2: "d2", n3: "d2", n4: "d3" },
        }),
        queue([]),
      ],
    },
    {
      lines: [22],
      label: "We processed 3 levels → return `depth` = 3. ✓",
      variables: { result: "3" },
      visuals: [
        tree({
          annotations: { n1: "d1", n2: "d2", n3: "d2", n4: "d3" },
        }),
        queue([]),
      ],
    },
  ],
  approach: {
    summary:
      "BFS level-order traversal: the queue holds exactly one level of the tree at a time. Each pass of the while loop drains the current level (qLength nodes) while enqueueing all their children — the next level. Count the passes and you've counted the levels, and the number of levels IS the maximum depth.",
    timeComplexity: "O(n) — every node is enqueued and dequeued exactly once.",
    spaceComplexity: "O(w) where w is the widest level — worst case O(n/2) for a full bottom row.",
    notes: [
      "int qLength = q.Count snapshotted BEFORE the for loop is the trick that separates levels — q.Count changes as you enqueue children, but qLength freezes how many nodes belong to the current level.",
      "Queue<T> is C#'s FIFO — Enqueue adds to the back, Dequeue removes from the front. (Stack<T> here would give you DFS instead.)",
      "The recursive DFS version is 4 lines — return 1 + Math.Max(MaxDepth(root.left), MaxDepth(root.right)) — but uses O(h) call stack and you can't watch it work level by level.",
      "Queue<TreeNode> q = new() is C# 9 target-typed new — the type is already on the left, no need to repeat it.",
    ],
  },
    },
    {
      name: "DFS",
      input: "root = [1, 2, 3, null, null, 4]",
      code: dfsCode,
      steps: dfsSteps,
      approach: dfsApproach,
    },
  ],
};
