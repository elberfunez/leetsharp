import type { Problem, VisualState } from "../../domain/types";

// Elber's actual solution from LeetcodePractice/Problems/LinkedList/RemoveNthFromEnd,
// presented in LeetCode submission format.
const code = `public class Solution {
    public ListNode RemoveNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0, head);
        ListNode left = dummy;
        ListNode right = head;
        while (n > 0 && right != null) {
            right = right.next;
            n--;
        }
        while (right != null) {
            left = left.next;
            right = right.next;
        }
        left.next = left.next.next;
        return dummy.next;
    }
}`;

// "·" is the dummy node sitting before the real head; nodes 1..4 follow.
function arr(pointers: Record<string, number>, dimmed?: number[]): VisualState {
  return { type: "array", title: "·(dummy) → 1 → 2 → 3 → 4", items: ["·", 1, 2, 3, 4], pointers, dimmed };
}

export const removeNthNodeFromEndOfList: Problem = {
  slug: "remove-nth-node-from-end-of-list",
  number: 19,
  title: "Remove Nth Node From End of List",
  difficulty: "Medium",
  category: "Linked List",
  leetcodeUrl: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
  solutions: [
    {
      name: "Two Pointers (gap)",
      input: "head = [1, 2, 3, 4], n = 2",
      code,
      steps: [
        {
          lines: [3, 4, 5],
          label: "A dummy node before the head lets us delete even the first node uniformly. left starts at dummy, right at the head.",
          variables: { n: "2" },
          visuals: [arr({ left: 0, right: 1 })],
        },
        {
          lines: [6, 7, 8],
          label: "Open a gap: move right n = 2 nodes ahead. right lands on node 3, n hits 0.",
          variables: { n: "0" },
          visuals: [arr({ left: 0, right: 3 })],
        },
        {
          lines: [10, 11, 12],
          label: "Now slide BOTH forward together, keeping the gap of 2: left → node 1, right → node 4.",
          visuals: [arr({ left: 1, right: 4 })],
        },
        {
          lines: [10, 11, 12],
          label: "Again: left → node 2, right → off the end (null). The loop stops — left is now exactly one before the target.",
          visuals: [arr({ left: 2 })],
        },
        {
          lines: [14],
          label: "left.next = left.next.next skips node 3 (the 2nd from the end). It's unlinked.",
          visuals: [arr({ left: 2 }, [3])],
        },
        {
          lines: [15],
          label: "Return dummy.next → [1, 2, 4]. ✓",
          variables: { result: "[1, 2, 4]" },
          visuals: [arr({ left: 2 }, [3])],
        },
      ],
      approach: {
        summary:
          "One pass with a fixed gap. Advance a right pointer n nodes ahead of left, then move both together until right runs off the end — at that moment left sits exactly one node before the nth-from-last, ready to splice it out. A dummy node before the head means deleting the first node needs no special case.",
        timeComplexity: "O(n) — a single pass; the length is never measured separately.",
        spaceComplexity: "O(1).",
        notes: [
          "new ListNode(0, head) is the dummy that lets left sit 'before' the real head, so removing the original head is no different from any other node.",
          "The gap of n between right and left is the whole idea: when right hits null, left is n+1 from the end — just before the target.",
          "It's genuinely one pass — you never compute the list length explicitly.",
          "left.next = left.next.next is the unlink; the skipped node is reclaimed by the garbage collector.",
        ],
      },
    },
  ],
};
