import type { LinkedListVisualState, Problem } from "../../domain/types";
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

// Full list [1, 2, 3, 2, 1] — used for the slow/fast traversal and comparison phases.
// pointerPosition="above" so slow/fast/head/rev labels don't clash with the arcs.
function whole(
  next: (number | null)[],
  pointers?: Record<string, number>,
  highlighted?: number[]
): LinkedListVisualState {
  return {
    type: "linkedlist",
    title: "list",
    values: [1, 2, 3, 2, 1],
    next,
    pointers,
    highlighted,
    pointerPosition: "above",
  };
}

// Sub-list [3, 2, 1] — the second half passed into ReverseList.
// Index 0 = val 3 (orig index 2), index 1 = val 2 (orig 3), index 2 = val 1 (orig 4).
function sub(
  next: (number | null)[],
  pointers?: Record<string, number>,
  highlighted?: number[]
): LinkedListVisualState {
  return { type: "linkedlist", title: "second half", values: [3, 2, 1], next, pointers, highlighted };
}

// next arrays for the full list during different phases
const FL_INIT: (number | null)[] = [1, 2, 3, 4, null];   // untouched
// After ReverseList: orig index 2 → null (cut), orig 3 → 2 (←), orig 4 → 3 (←)
const FL_REV:  (number | null)[] = [1, 2, null, 2, 3];

// next arrays for the sub-list [3, 2, 1] as ReverseList executes on it
const SL_INIT:  (number | null)[] = [1, 2, null];         // 3→2→1→∅
const SL_FLIP1: (number | null)[] = [null, 2, null];      // node 3 unlinked (∅)
const SL_FLIP2: (number | null)[] = [null, 0, null];      // node 2 → node 3 (backward)
const SL_REV:   (number | null)[] = [null, 0, 1];         // node 1 → node 2 → node 3 (reversed)

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
        // ── Phase 1: find the middle ──────────────────────────────────────
        {
          lines: [3, 4, 5],
          label: "More than one node — compare it against itself reversed. `slow` steps once per turn, `fast` starts one ahead and steps twice. When `fast` falls off the end, `slow` is at the midpoint.",
          visuals: [whole(FL_INIT, { slow: 0, fast: 1 })],
        },
        {
          lines: [8, 9],
          label: "Iteration 1: `slow` → index 1 (val 2). `fast` → index 3 (val 2). `fast.next` (index 4) still exists, so the loop continues.",
          visuals: [whole(FL_INIT, { slow: 1, fast: 3 })],
        },
        {
          lines: [8, 9],
          label: "Iteration 2: `slow` → index 2 (val 3, the middle). `fast.next.next` would be `null` — `fast` falls off. The loop exits. `slow` is at the midpoint.",
          variables: { fast: "null" },
          visuals: [whole(FL_INIT, { slow: 2 })],
        },
        // ── Phase 2: step into ReverseList([3, 2, 1]) ────────────────────
        {
          lines: [11, 23, 24, 25],
          label: "Stepping into `ReverseList(slow)`: the second half [3, 2, 1] arrives as `head`. `prev` starts null, `cur` starts at the head (val 3).",
          variables: { prev: "null" },
          visuals: [sub(SL_INIT, { cur: 0 })],
        },
        {
          lines: [28],
          label: "Iteration 1 — save `next` before breaking the link: `next` = node at index 1 (val 2).",
          variables: { prev: "null" },
          visuals: [sub(SL_INIT, { cur: 0, next: 1 }, [0])],
        },
        {
          lines: [29],
          label: "Flip: `cur.next = prev` — node 3's forward arc retracts. It now points to `null`, becoming the new tail.",
          variables: { prev: "null" },
          visuals: [sub(SL_FLIP1, { cur: 0, next: 1 }, [0])],
        },
        {
          lines: [30, 31],
          label: "Slide: `prev` = node 3, `cur` = the saved `next` (node 2).",
          visuals: [sub(SL_FLIP1, { prev: 0, cur: 1 })],
        },
        {
          lines: [28],
          label: "Iteration 2 — save `next` = node at index 2 (val 1).",
          visuals: [sub(SL_FLIP1, { prev: 0, cur: 1, next: 2 }, [1])],
        },
        {
          lines: [29],
          label: "Flip: `cur.next = prev` — a backward arc draws in under the nodes, node 2 → node 3.",
          visuals: [sub(SL_FLIP2, { prev: 0, cur: 1, next: 2 }, [1])],
        },
        {
          lines: [30, 31],
          label: "Slide: `prev` = node 2, `cur` = node 1 (the old tail).",
          visuals: [sub(SL_FLIP2, { prev: 1, cur: 2 })],
        },
        {
          lines: [28],
          label: "Iteration 3 — `cur.next` is `null` (node 1 was the old tail), so `next` = `null`.",
          variables: { next: "null" },
          visuals: [sub(SL_FLIP2, { prev: 1, cur: 2 }, [2])],
        },
        {
          lines: [29],
          label: "Flip: `cur.next = prev` — node 1 → node 2. All three arcs now bow under the nodes: the second half is fully reversed.",
          variables: { next: "null" },
          visuals: [sub(SL_REV, { prev: 1, cur: 2 }, [2])],
        },
        {
          lines: [30, 31, 26],
          label: "`prev` = node 1, `cur` = `null`. The loop exits.",
          variables: { cur: "null", next: "null" },
          visuals: [sub(SL_REV, { prev: 2 })],
        },
        {
          lines: [33],
          label: "Return `prev` (val 1) — the old tail is now the head: 1 → 2 → 3. Back in `IsPalindrome`, this becomes `rev`.",
          visuals: [sub(SL_REV, { prev: 2 }, [2])],
        },
        // ── Phase 3: cut + compare ────────────────────────────────────────
        {
          lines: [12],
          label: "`slow.next = null` — the link at the midpoint is cut (already null from the reversal, but made explicit). `head` starts at the original head (val 1), `rev` at the reversed head (val 1, old tail). The backward arcs on the right show the reversed second half.",
          visuals: [whole(FL_REV, { head: 0, rev: 4 })],
        },
        {
          lines: [14, 15, 16, 17],
          label: "Compare: val 1 == val 1 → match. Advance both.",
          visuals: [whole(FL_REV, { head: 0, rev: 4 }, [0, 4])],
        },
        {
          lines: [15, 16, 17],
          label: "val 2 == val 2 → match. Advance both.",
          visuals: [whole(FL_REV, { head: 1, rev: 3 }, [1, 3])],
        },
        {
          lines: [15, 16, 17],
          label: "val 3 == val 3 → match. Both pointers reach the midpoint (same node). Advance both to `null`.",
          visuals: [whole(FL_REV, { head: 2, rev: 2 }, [2])],
        },
        {
          lines: [13, 20],
          label: "`head` and `rev` are both `null` — the loop exits with no mismatch found. Return `true`. ✓",
          variables: { result: "true" },
          visuals: [whole(FL_REV, {})],
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
