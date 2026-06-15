import type { Problem, TreeVisualNode, VisualState } from "../../domain/types";
import { ELBER } from "../authors";

// Elber's actual solution from LeetcodePractice/Problems/Trees/BinaryTreeLevelOrderTraversal,
// presented in LeetCode submission format.
const code = `public class Solution {
    public List<List<int>> LevelOrder(TreeNode root) {
        if (root == null) return new List<List<int>>();
        List<List<int>> res = new();
        Queue<TreeNode> queue = new Queue<TreeNode>();
        queue.Enqueue(root);
        while (queue.Count > 0)
        {
            int queueLength = queue.Count;
            List<int> curLevelVals = new();
            for (int i = 0; i < queueLength; i++)
            {
                TreeNode curNode = queue.Dequeue();
                curLevelVals.Add(curNode.val);
                if (curNode.left != null) queue.Enqueue(curNode.left);
                if (curNode.right != null) queue.Enqueue(curNode.right);
            }
            res.Add(curLevelVals);
        }
        return res;
    }
}`;

const root: TreeVisualNode = {
  id: "n1", value: 1,
  left: { id: "n2", value: 2, left: { id: "n4", value: 4 }, right: { id: "n5", value: 5 } },
  right: { id: "n3", value: 3, left: { id: "n6", value: 6 }, right: { id: "n7", value: 7 } },
};

function tree(highlighted: string[], visited: string[] = []): VisualState {
  return { type: "tree", title: "tree", root, highlighted, visited };
}
function queue(items: number[]): VisualState {
  return { type: "array", title: "queue (front first)", items, highlighted: items.map((_, i) => i) };
}

export const binaryTreeLevelOrderTraversal: Problem = {
  slug: "binary-tree-level-order-traversal",
  number: 102,
  title: "Binary Tree Level Order Traversal",
  difficulty: "Medium",
  category: "Trees",
  leetcodeUrl: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
  author: ELBER,
  solutions: [
    {
      name: "BFS",
      input: "root = [1, 2, 3, 4, 5, 6, 7]",
      code,
      steps: [
        {
          lines: [3, 4, 5, 6],
          label: "BFS with a queue. The queue always holds exactly one level of the tree. Start with just the root.",
          visuals: [tree(["n1"]), queue([1])],
        },
        {
          lines: [9, 10],
          label: "Snapshot `queueLength` = 1 — that's how many nodes belong to THIS level. Start an empty list for it.",
          variables: { queueLength: "1" },
          visuals: [tree(["n1"]), queue([1])],
        },
        {
          lines: [13, 14, 15, 16],
          label: "Dequeue 1 into the level list, then enqueue its children 2 and 3 for the next level. Level 0 = [1].",
          variables: { result: "[[1]]" },
          visuals: [tree(["n2", "n3"], ["n1"]), queue([2, 3])],
        },
        {
          lines: [9],
          label: "`queueLength` = 2 — the next level has 2 nodes.",
          variables: { queueLength: "2" },
          visuals: [tree([], ["n1"]), queue([2, 3])],
        },
        {
          lines: [13, 14, 15, 16],
          label: "Dequeue 2 (enqueue 4, 5) and 3 (enqueue 6, 7). Level 1 = [2, 3]; the queue now holds level 2.",
          variables: { result: "[[1], [2, 3]]" },
          visuals: [tree(["n4", "n5", "n6", "n7"], ["n1", "n2", "n3"]), queue([4, 5, 6, 7])],
        },
        {
          lines: [9, 13, 14],
          label: "`queueLength` = 4. Dequeue all four leaves; none has children, so nothing new is enqueued. Level 2 = [4, 5, 6, 7].",
          variables: { result: "[[1], [2, 3], [4, 5, 6, 7]]" },
          visuals: [tree([], ["n1", "n2", "n3", "n4", "n5", "n6", "n7"]), queue([])],
        },
        {
          lines: [7, 21],
          label: "Queue empty → done. Return `res` = [[1], [2, 3], [4, 5, 6, 7]]. ✓",
          variables: { result: "[[1], [2, 3], [4, 5, 6, 7]]" },
          visuals: [tree([], ["n1", "n2", "n3", "n4", "n5", "n6", "n7"]), queue([])],
        },
      ],
      approach: {
        summary:
          "Breadth-first traversal with a queue, grouping nodes by level. The trick is to snapshot queue.Count at the start of each round — that count is exactly the number of nodes on the current level. Dequeue that many, collecting their values into one list while enqueueing their children, which become the next level.",
        timeComplexity: "O(n) — every node is enqueued and dequeued once.",
        spaceComplexity: "O(n) — the queue holds up to a full level, which can be ~n/2 nodes.",
        notes: [
          "int queueLength = queue.Count snapshotted BEFORE the inner loop is what separates the levels — the count is frozen even as children are enqueued.",
          "Queue<T> is C#'s FIFO: Enqueue at the back, Dequeue at the front — exactly the order BFS needs.",
          "Each round produces one inner list, so the result's shape (a list per level) falls out naturally.",
          "Swap the queue for a stack and you'd get a depth-first shape instead — the data structure picks the traversal order.",
        ],
      },
    },
  ],
};
