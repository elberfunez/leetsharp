import type { Problem, VisualState } from "../../domain/types";
import { ELBER } from "../authors";

// Elber's actual solution from LeetcodePractice/Problems/LinkedList/PalindromeLinkedList,
// presented in LeetCode submission format.
const code = `public class Solution {
    public bool IsPalindrome(ListNode head) {
        if (head.next == null) return true;
        ListNode slow = head;
        ListNode fast = head.next;
        while (fast != null && fast.next != null)
        {
            slow = slow.next;
            fast = fast.next.next;
        }
        ListNode rev = ReverseList(slow);
        slow.next = null;
        while (head != null && rev != null)
        {
            if (head.val != rev.val) return false;
            head = head.next;
            rev = rev.next;
        }
        return true;
    }
}`;

function whole(pointers: Record<string, number>): VisualState {
  return { type: "array", title: "list", items: [1, 2, 3, 2, 1], pointers };
}

export const palindromeLinkedList: Problem = {
  slug: "palindrome-linked-list",
  number: 234,
  title: "Palindrome Linked List",
  difficulty: "Easy",
  category: "Linked List",
  leetcodeUrl: "https://leetcode.com/problems/palindrome-linked-list/",
  author: ELBER,
  solutions: [
    {
      name: "Reverse Second Half",
      input: "head = [1, 2, 3, 2, 1]",
      code,
      steps: [
        {
          lines: [3, 4, 5],
          label: "More than one node, so we compare it against itself reversed. Find the middle with `slow`/`fast` (`fast` starts one ahead).",
          visuals: [whole({ slow: 0, fast: 1 })],
        },
        {
          lines: [7, 8],
          label: "`slow` → node 2 (index 1), `fast` → node 2 (index 3).",
          visuals: [whole({ slow: 1, fast: 3 })],
        },
        {
          lines: [7, 8],
          label: "`slow` → node 3 (index 2). `fast` would run off the end, so the loop ends. `slow` sits at the middle.",
          visuals: [whole({ slow: 2, fast: 2 })],
        },
        {
          lines: [11, 12],
          label: "Reverse the list from the middle onward: [3, 2, 1] becomes a chain headed at the last node. Cut the first half off with `slow.next = null`.",
          visuals: [
            { type: "array", title: "first half", items: [1, 2], highlighted: [0, 1] },
            { type: "array", title: "reversed second half", items: [1, 2, 3], highlighted: [0, 1, 2] },
          ],
        },
        {
          lines: [13, 15, 16, 17],
          label: "Now compare from both ends inward. `head`'s 1 vs `rev`'s 1 → match. Advance both.",
          visuals: [
            { type: "array", title: "head →", items: [1, 2], pointers: { h: 0 } },
            { type: "array", title: "rev →", items: [1, 2, 3], pointers: { r: 0 } },
          ],
        },
        {
          lines: [15, 16, 17],
          label: "2 vs 2 → match. Advance both.",
          visuals: [
            { type: "array", title: "head →", items: [1, 2], pointers: { h: 1 } },
            { type: "array", title: "rev →", items: [1, 2, 3], pointers: { r: 1 } },
          ],
        },
        {
          lines: [13, 19],
          label: "`head` has reached the end (the halves meet at the middle 3). No mismatch ever fired → return `true`. ✓",
          variables: { result: "true" },
          visuals: [whole({})],
        },
      ],
      approach: {
        summary:
          "A list is a palindrome if its front half matches its back half read in reverse. Find the middle with slow/fast pointers, reverse the second half in place, then walk one pointer from the front and one from the reversed back, comparing values. Any mismatch means it isn't a palindrome; reaching the middle cleanly means it is.",
        timeComplexity: "O(n) — find-mid, reverse, and compare are each linear.",
        spaceComplexity: "O(1) — reversal is in place, no copy of the list is made.",
        notes: [
          "Starting fast at head.next (not head) lands slow on the correct middle for this split — an easy off-by-one to get wrong.",
          "The O(1)-space approach reverses half the list; the simpler O(n)-space alternative dumps values into an array and two-pointers that.",
          "When node counts are odd, the lone middle node doesn't need a partner — the shorter side's loop just stops first.",
          "This mutates the list (the back half stays reversed). In real code you'd often restore it before returning.",
        ],
      },
    },
  ],
};
