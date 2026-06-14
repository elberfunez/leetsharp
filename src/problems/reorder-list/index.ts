import type { Problem, VisualState } from "../../domain/types";

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
}`;

function whole(pointers: Record<string, number>): VisualState {
  return { type: "array", title: "list", items: [2, 4, 6, 8, 10], pointers };
}
function first(items: number[], highlighted?: number[]): VisualState {
  return { type: "array", title: "first half", items, highlighted };
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
  solutions: [
    {
      name: "Find Mid + Reverse + Weave",
      input: "head = [2, 4, 6, 8, 10]",
      code,
      steps: [
        {
          lines: [4, 5, 6],
          label: "Reorder weaves first, last, second, second-last, … in three phases. Phase 1: find the middle with slow (1×) and fast (2×) pointers.",
          visuals: [whole({ slow: 0, fast: 0 })],
        },
        {
          lines: [8, 9],
          label: "slow → node 4, fast → node 6.",
          visuals: [whole({ slow: 1, fast: 2 })],
        },
        {
          lines: [8, 9],
          label: "slow → node 6, fast → node 10. fast can't move 2 more, so the loop ends. slow (node 6) is the middle.",
          visuals: [whole({ slow: 2, fast: 4 })],
        },
        {
          lines: [13, 14],
          label: "Phase 2: cut after slow. First half [2, 4, 6], second half [8, 10].",
          visuals: [first([2, 4, 6]), { type: "array", title: "second half", items: [8, 10] }],
        },
        {
          lines: [16],
          label: "Phase 3: reverse the second half → [10, 8].",
          visuals: [first([2, 4, 6]), second([10, 8])],
        },
        {
          lines: [18, 20, 21, 22, 23, 24, 25],
          label: "Weave: splice first's head (2) → reversed head (10) → first's next (4). Advance both.",
          visuals: [first([2, 4, 6], [0]), second([10, 8], [0]), result([2, 10])],
        },
        {
          lines: [20, 22, 23, 24, 25],
          label: "Again: 4 → 8 → 6. Advance both; the reversed half is now exhausted.",
          visuals: [first([2, 4, 6], [1]), second([10, 8], [1]), result([2, 10, 4, 8])],
        },
        {
          lines: [19],
          label: "The reversed half is empty → loop ends. Node 6 keeps its trailing spot.",
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
