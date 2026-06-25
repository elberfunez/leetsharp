import type { LinkedListVisualState, Problem } from "../../domain/types";
import { ELBER } from "../authors";

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

// Index 0 is the dummy "·"; real nodes [1,2,3,4] at indices 1–4.
// n = 2 → node at index 3 (value 3) is 2nd from the end and will be deleted.
// After deletion: left.next (index 2) skips index 3 and points to index 4.
// Node 3's own next is also cleared to null so it renders as a fully isolated box.
const N_INIT: (number | null)[] = [1, 2, 3, 4, null];
const N_DEL:  (number | null)[] = [1, 2, 4, null, null];

function list(
  next: (number | null)[],
  pointers: Record<string, number>,
  highlighted?: number[],
  removed?: number[]
): LinkedListVisualState {
  return {
    type: "linkedlist",
    title: "·(dummy) → 1 → 2 → 3 → 4",
    values: ["·", 1, 2, 3, 4],
    next,
    pointers,
    highlighted,
    removed,
  };
}

export const removeNthNodeFromEndOfList: Problem = {
  slug: "remove-nth-node-from-end-of-list",
  number: 19,
  title: "Remove Nth Node From End of List",
  difficulty: "Medium",
  category: "Linked List",
  leetcodeUrl: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
  author: ELBER,
  solutions: [
    {
      name: "Two Pointers (gap)",
      input: "head = [1, 2, 3, 4], n = 2",
      code,
      steps: [
        {
          lines: [3, 4, 5],
          label: "A `dummy` node before the head lets us delete even the first node uniformly. `left` starts at `dummy`, `right` at the head.",
          variables: { n: "2" },
          visuals: [list(N_INIT, { left: 0, right: 1 })],
        },
        {
          lines: [6, 7, 8],
          label: "Open a gap: move `right` n = 2 nodes ahead. `right` lands on node 3, `n` hits 0.",
          variables: { n: "0" },
          visuals: [list(N_INIT, { left: 0, right: 3 })],
        },
        {
          lines: [10, 11, 12],
          label: "Slide BOTH forward together, keeping the gap of 2: `left` → node 1, `right` → node 4.",
          visuals: [list(N_INIT, { left: 1, right: 4 })],
        },
        {
          lines: [10, 11, 12],
          label: "`left` → node 2, `right` → off the end (`null`). The loop stops — `left` is now exactly one before the target.",
          variables: { right: "null" },
          visuals: [list(N_INIT, { left: 2 })],
        },
        {
          lines: [14],
          label: "`left.next = left.next.next` — the arc from node 2 to node 3 retracts and a new arc draws in connecting node 2 directly to node 4. Node 3 drops out of the chain.",
          visuals: [list(N_DEL, { left: 2 }, undefined, [3])],
        },
        {
          lines: [15],
          label: "Return `dummy.next` → [1, 2, 4]. ✓",
          variables: { result: "[1, 2, 4]" },
          visuals: [list(N_DEL, { left: 2 }, undefined, [3])],
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
