import type { Problem, VisualState } from "../../domain/types";

// Elber's actual solution from LeetcodePractice/Problems/LinkedList/MergeTwoSortedLinkedLists,
// presented in LeetCode submission format.
const code = `public class Solution {
    public ListNode MergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode();
        ListNode tail = dummy;
        while (list1 != null && list2 != null)
        {
            if (list1.val < list2.val)
            {
                tail.next = list1;
                list1 = list1.next;
            }
            else
            {
                tail.next = list2;
                list2 = list2.next;
            }
            tail = tail.next;
        }
        if (list1 != null) tail.next = list1;
        if (list2 != null) tail.next = list2;
        return dummy.next;
    }
}`;

function l1(pointer: number | null, dimmed: number[]): VisualState {
  return { type: "array", title: "list1", items: [1, 2, 4], pointers: pointer === null ? {} : { p1: pointer }, dimmed };
}
function l2(pointer: number | null, dimmed: number[]): VisualState {
  return { type: "array", title: "list2", items: [1, 3, 5], pointers: pointer === null ? {} : { p2: pointer }, dimmed };
}
function merged(items: number[]): VisualState {
  return { type: "array", title: "merged", items, highlighted: items.length ? [items.length - 1] : [] };
}

export const mergeTwoSortedLists: Problem = {
  slug: "merge-two-sorted-lists",
  number: 21,
  title: "Merge Two Sorted Linked Lists",
  difficulty: "Easy",
  category: "Linked List",
  leetcodeUrl: "https://leetcode.com/problems/merge-two-sorted-lists/",
  solutions: [
    {
      name: "Dummy + Splice",
      input: "list1 = [1, 2, 4], list2 = [1, 3, 5]",
      code,
      steps: [
        {
          lines: [3, 4],
          label: "A dummy node makes this clean: tail always points at the last node of the result, starting at dummy so we never special-case the head.",
          visuals: [l1(0, []), l2(0, []), merged([])],
        },
        {
          lines: [5, 7, 14, 15, 17],
          label: "Compare heads: 1 < 1 is false, so take list2's 1. Splice it on, advance list2.",
          visuals: [l1(0, []), l2(1, [0]), merged([1])],
        },
        {
          lines: [7, 9, 10, 17],
          label: "Heads are now 1 and 3: 1 < 3 → take list1's 1. Advance list1.",
          visuals: [l1(1, [0]), l2(1, [0]), merged([1, 1])],
        },
        {
          lines: [7, 9, 10, 17],
          label: "2 < 3 → take list1's 2.",
          visuals: [l1(2, [0, 1]), l2(1, [0]), merged([1, 1, 2])],
        },
        {
          lines: [7, 14, 15, 17],
          label: "Heads 4 and 3: 4 < 3 is false → take list2's 3.",
          visuals: [l1(2, [0, 1]), l2(2, [0, 1]), merged([1, 1, 2, 3])],
        },
        {
          lines: [7, 9, 10, 17],
          label: "4 < 5 → take list1's 4. Now list1 is empty.",
          visuals: [l1(null, [0, 1, 2]), l2(2, [0, 1]), merged([1, 1, 2, 3, 4])],
        },
        {
          lines: [5, 19, 20],
          label: "list1 is empty, so the loop exits. list2 still has 5 — and it's already sorted, so attach the whole remainder at once.",
          visuals: [l1(null, [0, 1, 2]), l2(null, [0, 1, 2]), merged([1, 1, 2, 3, 4, 5])],
        },
        {
          lines: [21],
          label: "Return dummy.next — the merged sorted list [1, 1, 2, 3, 4, 5]. ✓",
          variables: { result: "[1, 1, 2, 3, 4, 5]" },
          visuals: [merged([1, 1, 2, 3, 4, 5])],
        },
      ],
      approach: {
        summary:
          "Both inputs are already sorted, so the smaller of the two current heads is always the next node of the result. Walk both lists with a tail pointer, repeatedly splicing the smaller head onto the tail. A dummy head removes the 'is this the first node?' special case. When one list empties, the other is already sorted — attach it wholesale.",
        timeComplexity: "O(n + m) — each node is visited once.",
        spaceComplexity: "O(1) — existing nodes are re-linked, nothing is copied.",
        notes: [
          "The dummy node is the trick: tail starts there, so the real head is just dummy.next at the end — no branch for the first append.",
          "It relies on both inputs being pre-sorted, which is what makes the smaller head the global next-smallest.",
          "When the loop exits, at most one list is non-empty and already sorted, so one tail.next = list splices the entire rest.",
          "Pointer splicing means O(1) extra space — no new nodes beyond the dummy.",
        ],
      },
    },
  ],
};
