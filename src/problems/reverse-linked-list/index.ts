import type { LinkedListVisualState, Problem } from "../../domain/types";
import { ELBER } from "../authors";

// Elber's actual solution from LeetcodePractice/Problems/LinkedList/ReverseLinkedList,
// presented in LeetCode submission format.
const code = `public class Solution {
    public ListNode ReverseList(ListNode head) {
        ListNode cur = head;
        ListNode prev = null;
        while (cur != null)
        {
            var next = cur.next;
            cur.next = prev;
            prev = cur;
            cur = next;
        }
        return prev;
    }
}`;

/** Traced input (Example 1 from the practice repo): 0 → 1 → 2 → 3, reversed to 3 → 2 → 1 → 0.
 *  Nodes stay put — watch each next-link break (its arc retracts) and
 *  reconnect (a new arc draws in). Forward links bow over the top in
 *  violet; reversed links bow under the bottom in green, so the reversal
 *  visibly sweeps top→bottom across the row. Pointers that are null in a
 *  given step appear only in the variables panel. */
function list(
  next: (number | null)[],
  pointers?: Record<string, number>,
  highlighted?: number[]
): LinkedListVisualState {
  return { type: "linkedlist", title: "list", values: [0, 1, 2, 3], next, pointers, highlighted };
}

export const reverseLinkedList: Problem = {
  slug: "reverse-linked-list",
  number: 206,
  title: "Reverse Linked List",
  difficulty: "Easy",
  category: "Linked List",
  leetcodeUrl: "https://leetcode.com/problems/reverse-linked-list/",
  author: ELBER,
  solutions: [
    {
      name: "Iterative",
      input: "head = [0, 1, 2, 3]",
      code,
      steps: [
    {
      lines: [3, 4],
      label: "Two trackers: `cur` starts at the head, `prev` starts at `null` — `prev` is always the portion already reversed (nothing yet).",
      variables: { prev: "null" },
      visuals: [list([1, 2, 3, null], { cur: 0 })],
    },
    {
      lines: [7],
      label: "Iteration 1 — save `cur`'s neighbor before we break the link: `next` = node 1.",
      variables: { prev: "null" },
      visuals: [list([1, 2, 3, null], { cur: 0, next: 1 }, [0])],
    },
    {
      lines: [8],
      label: "Break! Node 0's `next` is reassigned to `prev` (`null`): the top 0→1 arc retracts and node 0's next-cell shows ∅ — it's the new tail.",
      variables: { prev: "null" },
      visuals: [list([null, 2, 3, null], { cur: 0, next: 1 }, [0])],
    },
    {
      lines: [9, 10],
      label: "Slide the trackers forward: `prev` = node 0, `cur` = the saved `next` (node 1).",
      visuals: [list([null, 2, 3, null], { prev: 0, cur: 1, next: 1 })],
    },
    {
      lines: [7],
      label: "Iteration 2 — save `next` = node 2.",
      visuals: [list([null, 2, 3, null], { prev: 0, cur: 1, next: 2 }, [1])],
    },
    {
      lines: [8],
      label: "Reconnect: node 1's top link breaks and a green arc draws in underneath, pointing back at node 0.",
      visuals: [list([null, 0, 3, null], { prev: 0, cur: 1, next: 2 }, [1])],
    },
    {
      lines: [9, 10],
      label: "`prev` = node 1, `cur` = node 2. Everything left of `cur` is reversed.",
      visuals: [list([null, 0, 3, null], { prev: 1, cur: 2, next: 2 })],
    },
    {
      lines: [7],
      label: "Iteration 3 — save `next` = node 3.",
      visuals: [list([null, 0, 3, null], { prev: 1, cur: 2, next: 3 }, [2])],
    },
    {
      lines: [8],
      label: "Node 2's top link retracts and a green arc draws in below, pointing back at node 1.",
      visuals: [list([null, 0, 1, null], { prev: 1, cur: 2, next: 3 }, [2])],
    },
    {
      lines: [9, 10],
      label: "`prev` = node 2, `cur` = node 3 — the last node.",
      visuals: [list([null, 0, 1, null], { prev: 2, cur: 3, next: 3 })],
    },
    {
      lines: [7],
      label: "Iteration 4 — `cur.next` is `null` (node 3 was the old tail), so `next` = `null`.",
      variables: { next: "null" },
      visuals: [list([null, 0, 1, null], { prev: 2, cur: 3 }, [3])],
    },
    {
      lines: [8],
      label: "The last link redraws below, node 3 → node 2. Every arc now bows along the bottom — the list is fully reversed.",
      variables: { next: "null" },
      visuals: [list([null, 0, 1, 2], { prev: 2, cur: 3 }, [3])],
    },
    {
      lines: [9, 10],
      label: "`prev` = node 3, `cur` = `next` = `null`. `cur` walked off the end of the list.",
      variables: { cur: "null", next: "null" },
      visuals: [list([null, 0, 1, 2], { prev: 3 })],
    },
    {
      lines: [5],
      label: "`cur` is `null` → the loop exits.",
      variables: { cur: "null" },
      visuals: [list([null, 0, 1, 2], { prev: 3 })],
    },
    {
      lines: [12],
      label: "Return `prev` — node 3, the old tail, is the new head: 3 → 2 → 1 → 0. ✓",
      variables: { result: "3 → 2 → 1 → 0" },
      visuals: [{ ...list([null, 0, 1, 2], { prev: 3 }, [3]), celebrate: true }],
    },
  ],
  approach: {
    summary:
      "Walk the list once, flipping each node's next pointer to face backwards. The only trap: the moment you flip cur.next you lose your path forward — so the loop body's first move is always to save cur.next into next before breaking the link. prev trails one node behind cur and is always the head of the already-reversed portion; when cur falls off the end, prev is the new head.",
    timeComplexity: "O(n) — each node is visited exactly once.",
    spaceComplexity: "O(1) — three pointers, reversal happens in place.",
    notes: [
      "The line order inside the loop is the whole algorithm: save → flip → advance prev → advance cur. Swap any two and the list is corrupted or the loop never ends.",
      "prev starting at null is what makes the old head become the new tail — its flipped next points at null.",
      "var next = cur.next is scoped inside the loop in C# — fresh each iteration, no stale-value bugs.",
      "The recursive version is elegant but uses O(n) call stack; interviewers usually want this iterative one.",
    ],
  },
    },
  ],
};
