import type { LinkedListVisualState, Problem, VisualState } from "../../domain/types";
import { ELBER } from "../authors";

// Elber's actual solution from LeetcodePractice/Problems/LinkedList/ReorderLinkedList,
// presented in LeetCode submission format.
const code = `public class Solution {
    public void ReorderList(ListNode head) {
        // Step 1: find the middle with slow/fast pointers
        ListNode slow = head;
        ListNode fast = head;
        while (fast != null && fast.next != null)
        {
            slow = slow.next;
            fast = fast.next.next;
        }
        // Step 2: split into two halves at the middle
        ListNode secondHalf = slow.next;
        slow.next = null;
        // Step 3: reverse the second half
        ListNode secondHalfReversed = ReverseList(secondHalf);
        // Step 4: interleave the first half with the reversed second half
        ListNode firstHalf = head;
        while (firstHalf != null && secondHalfReversed != null)
        {
            ListNode firstNext = firstHalf.next;
            ListNode secondNext = secondHalfReversed.next;
            firstHalf.next = secondHalfReversed;
            secondHalfReversed.next = firstNext;
            firstHalf = firstNext;
            secondHalfReversed = secondNext;
        }
    }

    private ListNode ReverseList(ListNode head) {
        ListNode prev = null;
        ListNode cur = head;
        while (cur != null)
        {
            ListNode next = cur.next;
            cur.next = prev;
            prev = cur;
            cur = next;
        }
        return prev;
    }
}`;

function whole(pointers: Record<string, number>): VisualState {
  return { type: "array", title: "list", items: [2, 4, 6, 8, 10], pointers };
}
function first(items: number[], highlighted?: number[]): VisualState {
  return { type: "array", title: "first half", items, highlighted };
}
// LinkedList visual for the second half [8, 10] as ReverseList executes on it.
// next[i] tracks live next-pointer state; nodes stay put, only arrows change.
function secondLL(
  next: (number | null)[],
  pointers?: Record<string, number>,
  highlighted?: number[]
): LinkedListVisualState {
  return { type: "linkedlist", title: "second half", values: [8, 10], next, pointers, highlighted };
}
function second(items: number[], highlighted?: number[]): VisualState {
  return { type: "array", title: "second half (reversed)", items, highlighted };
}
function result(items: number[]): VisualState {
  return { type: "array", title: "reordered", items, highlighted: items.length ? [items.length - 1] : [] };
}

export const reorderList: Problem = {
  slug: "reorder-list",
  number: 143,
  title: "Reorder Linked List",
  difficulty: "Medium",
  category: "Linked List",
  leetcodeUrl: "https://leetcode.com/problems/reorder-list/",
  author: ELBER,
  solutions: [
    {
      name: "Find Mid + Reverse + Weave",
      input: "head = [2, 4, 6, 8, 10]",
      code,
      steps: [
        // ── Phase 1: find the middle ──────────────────────────────────────
        {
          lines: [4, 5, 6],
          label: "Reorder weaves first, last, second, second-last, … in three phases. Phase 1: find the middle with `slow` (1×) and `fast` (2×) pointers.",
          visuals: [whole({ slow: 0, fast: 0 })],
        },
        {
          lines: [8, 9],
          label: "`slow` → node 4, `fast` → node 6.",
          visuals: [whole({ slow: 1, fast: 2 })],
        },
        {
          lines: [8, 9],
          label: "`slow` → node 6, `fast` → node 10. `fast` can't move 2 more, so the loop ends. `slow` (node 6) is the middle.",
          visuals: [whole({ slow: 2, fast: 4 })],
        },
        // ── Phase 2: split ────────────────────────────────────────────────
        {
          lines: [13, 14],
          label: "Phase 2: `secondHalf = slow.next` captures node 8, then `slow.next = null` severs the list. First half [2, 4, 6], second half [8, 10].",
          visuals: [first([2, 4, 6]), secondLL([1, null])],
        },
        // ── Phase 3: step into ReverseList([8, 10]) ───────────────────────
        {
          lines: [15, 30, 31],
          label: "Phase 3: stepping into `ReverseList(secondHalf)`. `prev` starts null (nothing reversed yet), `cur` starts at the head — node 8.",
          variables: { prev: "null" },
          visuals: [first([2, 4, 6]), secondLL([1, null], { cur: 0 })],
        },
        {
          lines: [34],
          label: "Iteration 1 — save `next` before breaking the link: `next` = node 10.",
          variables: { prev: "null" },
          visuals: [first([2, 4, 6]), secondLL([1, null], { cur: 0, next: 1 }, [0])],
        },
        {
          lines: [35],
          label: "Flip: `cur.next = prev` — node 8's forward arc retracts. It now points to `null` (prev), becoming the new tail.",
          variables: { prev: "null" },
          visuals: [first([2, 4, 6]), secondLL([null, null], { cur: 0, next: 1 }, [0])],
        },
        {
          lines: [36, 37],
          label: "Slide trackers forward: `prev` = node 8, `cur` = the saved `next` (node 10).",
          visuals: [first([2, 4, 6]), secondLL([null, null], { prev: 0, cur: 1 })],
        },
        {
          lines: [34],
          label: "Iteration 2 — `cur.next` is `null` (node 10 was the old tail), so `next` = `null`.",
          variables: { next: "null" },
          visuals: [first([2, 4, 6]), secondLL([null, null], { prev: 0, cur: 1 }, [1])],
        },
        {
          lines: [35],
          label: "Flip: `cur.next = prev` — a backward arc draws in under the nodes, node 10 → node 8. The second half is now fully reversed.",
          variables: { next: "null" },
          visuals: [first([2, 4, 6]), secondLL([null, 0], { prev: 0, cur: 1 }, [1])],
        },
        {
          lines: [36, 37, 33],
          label: "`prev` = node 10, `cur` = `next` = `null`. `cur` is null — the loop exits.",
          variables: { cur: "null", next: "null" },
          visuals: [first([2, 4, 6]), secondLL([null, 0], { prev: 1 })],
        },
        {
          lines: [39],
          label: "Return `prev` (node 10) — the old tail is now the head: 10 → 8. Back in `ReorderList`, this becomes `secondHalfReversed`.",
          visuals: [first([2, 4, 6]), secondLL([null, 0], { prev: 1 }, [1])],
        },
        // ── Phase 4: weave ────────────────────────────────────────────────
        {
          lines: [18, 21, 22, 23, 24, 25, 26],
          label: "Phase 4 — weave: splice firstHalf head (2) → reversed head (10) → firstHalf's next (4). Advance both pointers.",
          visuals: [first([2, 4, 6], [0]), second([10, 8], [0]), result([2, 10])],
        },
        {
          lines: [21, 23, 24, 25, 26],
          label: "Again: 4 → 8 → 6. Advance both; the reversed half is now exhausted.",
          visuals: [first([2, 4, 6], [1]), second([10, 8], [1]), result([2, 10, 4, 8])],
        },
        {
          lines: [19],
          label: "`secondHalfReversed` is empty → loop ends. Node 6 keeps its trailing spot.",
          visuals: [result([2, 10, 4, 8, 6])],
        },
        {
          lines: [2],
          label: "Done — the list is reordered in place: [2, 10, 4, 8, 6]. ✓",
          variables: { result: "[2, 10, 4, 8, 6]" },
          visuals: [result([2, 10, 4, 8, 6])],
        },
      ],
      approach: {
        summary:
          "Three moves. First, find the middle with slow/fast pointers. Second, split there and reverse the second half. Third, weave the two halves together one node at a time — first-half node, reversed-second-half node, repeat. Reversing the back half is what lets you pull nodes off 'from the end' in O(1) as you interleave.",
        timeComplexity: "O(n) — find-mid, reverse, and weave are each linear.",
        spaceComplexity: "O(1) — all pointer surgery, done in place.",
        notes: [
          "Saving firstNext and secondNext BEFORE rewiring is essential — the splice overwrites the .next links you still need to advance.",
          "slow.next = null severs the list into two independent halves before the reverse.",
          "Reversing the second half turns 'take from the end' into 'take from a head', which is O(1) per step instead of O(n).",
          "The method returns void — it mutates the list in place, the LeetCode signature for this problem.",
        ],
      },
    },
  ],
};
