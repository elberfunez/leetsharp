import type { Problem, VisualState } from "../../domain/types";
import { ELBER } from "../authors";

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
function lists(pointer1: number | null, dimmed1: number[], pointer2: number | null, dimmed2: number[]): VisualState {
  return { type: "row", visuals: [l1(pointer1, dimmed1), l2(pointer2, dimmed2)] };
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
  description: `# Merge Two Sorted Linked Lists

**Difficulty:** Easy  
**Topic:** Linked List

---

## Description

You are given the heads of two sorted linked lists \`list1\` and \`list2\`.

Merge the two lists into one sorted linked list and return the head of the new sorted linked list.

The new list should be made up of nodes from \`list1\` and \`list2\`.

---

## Examples

### Example 1:

\`\`\`
Input: list1 = [1,2,4], list2 = [1,3,5]

Output: [1,1,2,3,4,5]

Explanation: The two lists are merged into one sorted list.
\`\`\`

### Example 2:

\`\`\`
Input: list1 = [], list2 = [1,2]

Output: [1,2]

Explanation: One list is empty, return the other list.
\`\`\`

### Example 3:

\`\`\`
Input: list1 = [], list2 = []

Output: []

Explanation: Both lists are empty, return an empty list.
\`\`\`

---

## Constraints

- \`0 <= The length of each list <= 100\`
- \`-100 <= Node.val <= 100\`
- Both \`list1\` and \`list2\` are sorted in non-decreasing order`,
  author: ELBER,
  solutions: [
    {
      name: "Dummy + Splice",
      input: "list1 = [1, 2, 4], list2 = [1, 3, 5]",
      code,
      steps: [
        {
          lines: [3, 4],
          label: "A dummy node makes this clean: tail always points at the last node of the result, starting at dummy so we never special-case the head.",
          visuals: [lists(0, [], 0, []), merged([])],
        },
        {
          lines: [5, 7, 14, 15, 17],
          label: "Compare heads: 1 < 1 is false → take list2's 1. Splice it on, advance list2.",
          visuals: [lists(0, [], 1, [0]), merged([1])],
        },
        {
          lines: [7, 9, 10, 17],
          label: "Heads are now 1 and 3: 1 < 3 → take list1's 1. Advance list1.",
          visuals: [lists(1, [0], 1, [0]), merged([1, 1])],
        },
        {
          lines: [7, 9, 10, 17],
          label: "2 < 3 → take list1's 2. Advance list1.",
          visuals: [lists(2, [0, 1], 1, [0]), merged([1, 1, 2])],
        },
        {
          lines: [7, 14, 15, 17],
          label: "Heads 4 and 3: 4 < 3 is false → take list2's 3. Advance list2.",
          visuals: [lists(2, [0, 1], 2, [0, 1]), merged([1, 1, 2, 3])],
        },
        {
          lines: [7, 9, 10, 17],
          label: "4 < 5 → take list1's 4. list1 is now empty.",
          visuals: [lists(null, [0, 1, 2], 2, [0, 1]), merged([1, 1, 2, 3, 4])],
        },
        {
          lines: [5, 19, 20],
          label: "list1 is empty — loop exits. list2 still has 5 and is already sorted, so attach the whole remainder at once.",
          visuals: [lists(null, [0, 1, 2], null, [0, 1, 2]), merged([1, 1, 2, 3, 4, 5])],
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
