import type { Problem, VisualState } from "../../domain/types";

// Elber's actual solution from LeetcodePractice/Problems/LinkedList/LinkedListCycleDetection,
// presented in LeetCode submission format.
const code = `public class Solution {
    public bool HasCycle(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;
        while (fast != null && fast.next != null)
        {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }
}`;

function arr(slow: number, fast: number, highlighted?: number[]): VisualState {
  return { type: "array", title: "nodes (tail links back to node 2)", items: [1, 2, 3, 4], pointers: { slow, fast }, highlighted };
}

export const linkedListCycle: Problem = {
  slug: "linked-list-cycle",
  number: 141,
  title: "Linked List Cycle Detection",
  difficulty: "Easy",
  category: "Linked List",
  leetcodeUrl: "https://leetcode.com/problems/linked-list-cycle/",
  solutions: [
    {
      name: "Floyd's Tortoise & Hare",
      input: "head = [1, 2, 3, 4], tail → node 2 (cycle)",
      code,
      steps: [
        {
          lines: [3, 4],
          label: "Two pointers start at the head. slow will step once per turn, fast twice. If a cycle exists, fast laps slow and they collide; if fast reaches the end, there's no cycle. (Here the tail loops back to node 2.)",
          visuals: [arr(0, 0)],
        },
        {
          lines: [7, 8, 9],
          label: "slow → node 2 (1 step). fast → node 3 (2 steps). Not equal yet.",
          visuals: [arr(1, 2)],
        },
        {
          lines: [7, 8, 9],
          label: "slow → node 3. fast moves 2: node 4, then the tail wraps back to node 2. They're not equal.",
          visuals: [arr(2, 1)],
        },
        {
          lines: [7, 8, 9],
          label: "slow → node 4. fast moves 2: node 3 → node 4. Both land on node 4 — collision!",
          visuals: [arr(3, 3, [3])],
        },
        {
          lines: [9],
          label: "slow == fast → a cycle exists. Return true. ✓",
          variables: { result: "true" },
          visuals: [arr(3, 3, [3])],
        },
      ],
      approach: {
        summary:
          "Floyd's tortoise & hare. A slow pointer steps once per iteration, a fast pointer twice. If the list ends, fast hits null — no cycle. If there is a cycle, fast keeps looping and the gap between the two shrinks by one each step until they land on the same node. All in constant memory, no visited set.",
        timeComplexity: "O(n) — fast reaches the end or the collision within a linear number of steps.",
        spaceComplexity: "O(1) — two pointers, no auxiliary storage.",
        notes: [
          "The O(1) space is the whole point: the obvious alternative stores visited nodes in a HashSet, costing O(n) memory.",
          "The loop guard checks both fast != null AND fast.next != null because fast reads two links ahead — both must exist.",
          "Inside a cycle the pointers are guaranteed to meet: the distance between them drops by exactly 1 every step until it reaches 0.",
          "slow == fast is reference equality — it compares node identity, not values, so distinct nodes holding equal values aren't 'equal'.",
        ],
      },
    },
  ],
};
