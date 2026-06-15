import type { Problem, VisualState } from "../../domain/types";
import { ELBER } from "../authors";

// Elber's actual solution from LeetcodePractice/Problems/LinkedList/RemoveLinkedListElements,
// presented in LeetCode submission format.
const code = `public class Solution {
    public ListNode RemoveElements(ListNode head, int val) {
        if (head == null) return null;
        ListNode dummy = new ListNode(0, head);
        ListNode curr = dummy;
        while (curr != null && curr.next != null)
        {
            if (curr.next.val == val)
            {
                curr.next = curr.next.next;
            }
            else
            {
                curr = curr.next;
            }
        }
        return dummy.next;
    }
}`;

// "·" is the dummy node before the head; nodes follow at indices 1..6.
function arr(curr: number, dimmed?: number[]): VisualState {
  return { type: "array", title: "·(dummy) → 2 → 1 → 4 → 1 → 2 → 3", items: ["·", 2, 1, 4, 1, 2, 3], pointers: { curr }, dimmed };
}

export const removeLinkedListElements: Problem = {
  slug: "remove-linked-list-elements",
  number: 203,
  title: "Remove Linked List Elements",
  difficulty: "Easy",
  category: "Linked List",
  leetcodeUrl: "https://leetcode.com/problems/remove-linked-list-elements/",
  author: ELBER,
  solutions: [
    {
      name: "Dummy + Skip",
      input: "head = [2, 1, 4, 1, 2, 3], val = 2",
      code,
      steps: [
        {
          lines: [4, 5],
          label: "A dummy node before the head lets us delete the first node the same way as any other. `curr` starts at `dummy` and only ever looks at `curr.next`.",
          visuals: [arr(0)],
        },
        {
          lines: [6, 8, 10],
          label: "`curr.next` is node 2 (== `val`). Skip it: `curr.next = curr.next.next`. `curr` stays put — the new next might also be a 2.",
          visuals: [arr(0, [1])],
        },
        {
          lines: [8, 14],
          label: "`curr.next` is now node 1 (≠ 2). Keep it — advance `curr` to it.",
          visuals: [arr(2, [1])],
        },
        {
          lines: [14],
          label: "`curr.next` is 4 (≠ 2) → advance `curr`.",
          visuals: [arr(3, [1])],
        },
        {
          lines: [14],
          label: "`curr.next` is 1 (≠ 2) → advance `curr`.",
          visuals: [arr(4, [1])],
        },
        {
          lines: [8, 10],
          label: "`curr.next` is node 2 (== `val`) → skip it. `curr` stays.",
          visuals: [arr(4, [1, 5])],
        },
        {
          lines: [14],
          label: "`curr.next` is 3 (≠ 2) → advance `curr`. Now `curr.next` is `null`, so the loop ends.",
          visuals: [arr(6, [1, 5])],
        },
        {
          lines: [17],
          label: "Return `dummy.next` → [1, 4, 1, 3]. Both 2s are gone. ✓",
          variables: { result: "[1, 4, 1, 3]" },
          visuals: [arr(6, [1, 5])],
        },
      ],
      approach: {
        summary:
          "Walk the list looking one node ahead. When curr.next holds the target value, unlink it by pointing curr.next past it; otherwise advance curr. The key subtlety: after a deletion you do NOT advance, because the new curr.next could also need removing (consecutive targets). A dummy node before the head means a matching first node is deleted with the exact same code.",
        timeComplexity: "O(n) — each node is examined once.",
        spaceComplexity: "O(1).",
        notes: [
          "The dummy node removes the awkward 'what if the head itself must be deleted?' special case — there's always a node before the one you might remove.",
          "Don't advance curr after a removal: the replacement curr.next might match too (e.g. runs like 2, 2).",
          "Looking at curr.next (not curr) is what gives you a handle on the node BEFORE the deletion target, which you need to re-link.",
          "curr.next = curr.next.next is the unlink; the skipped node is collected by the GC.",
        ],
      },
    },
  ],
};
