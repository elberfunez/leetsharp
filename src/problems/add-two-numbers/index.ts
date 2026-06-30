import type { Problem, VisualState } from "../../domain/types";
import { ELBER } from "../authors";

// Elber's actual solution from LeetcodePractice/Problems/LinkedList/AddTwoNumbers,
// presented in LeetCode submission format.
const code = `public class Solution {
    public ListNode AddTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode();
        ListNode cur = dummy;
        int carry = 0;
        while (l1 != null || l2 != null || carry > 0)
        {
            int val1 = l1?.val ?? 0;
            int val2 = l2?.val ?? 0;
            int sum = val1 + val2 + carry;
            int digit = sum % 10;
            carry = sum / 10;
            cur.next = new ListNode(digit);
            cur = cur.next;
            l1 = l1?.next;
            l2 = l2?.next;
        }
        return dummy.next;
    }
}`;

function l1(p: number | null, dimmed: number[]): VisualState {
  return { type: "array", title: "l1  (= 555)", items: [5, 5, 5], pointers: p === null ? {} : { l1: p }, dimmed };
}
function l2(p: number | null, dimmed: number[]): VisualState {
  return { type: "array", title: "l2  (= 555)", items: [5, 5, 5], pointers: p === null ? {} : { l2: p }, dimmed };
}
function result(items: number[]): VisualState {
  return { type: "array", title: "result (least-significant first)", items, highlighted: items.length ? [items.length - 1] : [] };
}

export const addTwoNumbers: Problem = {
  slug: "add-two-numbers",
  number: 2,
  title: "Add Two Numbers",
  difficulty: "Medium",
  category: "Linked List",
  leetcodeUrl: "https://leetcode.com/problems/add-two-numbers/",
  description: `# Add Two Numbers

**LeetCode Problem #2**  
**Difficulty:** Medium  
**Topics:** Linked List, Math

## Description

You are given two non-empty linked lists, \`l1\` and \`l2\`, where each represents a non-negative integer.

The digits are stored in **reverse order**, e.g. the number 321 is represented as \`1 -> 2 -> 3\` in the linked list.

Each of the nodes contains a single digit. You may assume the two numbers do not contain any leading zeros, except the number 0 itself.

**Return the sum of the two numbers as a linked list.**

## Examples

**Example 1:**
\`\`\`
Input: l1 = [1,2,3], l2 = [4,5,6]
Output: [5,7,9]

Explanation: 
  321 + 654 = 975
  Represented as: 5 -> 7 -> 9
\`\`\`

**Example 2:**
\`\`\`
Input: l1 = [9], l2 = [9]
Output: [8,1]

Explanation:
  9 + 9 = 18
  Represented as: 8 -> 1
\`\`\`

## Constraints

- \`1 <= l1.length, l2.length <= 100\`
- \`0 <= Node.val <= 9\``,
  author: ELBER,
  solutions: [
    {
      name: "Digit-by-Digit Carry",
      input: "l1 = [5, 5, 5], l2 = [5, 5, 5]",
      code,
      steps: [
        {
          lines: [3, 4, 5],
          label: "Digits are stored least-significant first, so we add left-to-right like grade-school addition, tracking a `carry`.",
          variables: { carry: "0" },
          visuals: [l1(0, []), l2(0, []), result([])],
        },
        {
          lines: [8, 9, 10, 11, 12],
          label: "First column: 5 + 5 = 10. Write the ones `digit` (0), carry the tens digit (1) to the next column.",
          variables: { sum: "10", digit: "0", carry: "1" },
          visuals: [l1(0, [0]), l2(0, [0]), result([0])],
        },
        {
          lines: [13, 14, 15, 16],
          label: "Append 0 to the result, advance both `l1` and `l2`.",
          variables: { carry: "1" },
          visuals: [l1(1, [0]), l2(1, [0]), result([0])],
        },
        {
          lines: [8, 9, 10, 11, 12],
          label: "Second column: 5 + 5 plus the incoming carry = 11. Write 1, carry 1 forward.",
          variables: { sum: "11", digit: "1", carry: "1" },
          visuals: [l1(1, [0]), l2(1, [0]), result([0, 1])],
        },
        {
          lines: [10, 11, 12],
          label: "Third column: same digits, same carry — 11 again. Write 1, carry 1 to the next (new) column.",
          variables: { sum: "11", digit: "1", carry: "1" },
          visuals: [l1(2, [0, 1]), l2(2, [0, 1]), result([0, 1, 1])],
        },
        {
          lines: [6, 8, 9],
          label: "Both lists are empty now — BUT `carry` = 1 > 0, so the loop runs once more. Missing digits count as 0.",
          variables: { val1: "0", val2: "0", carry: "1" },
          visuals: [l1(null, [0, 1, 2]), l2(null, [0, 1, 2]), result([0, 1, 1])],
        },
        {
          lines: [10, 11, 12, 13],
          label: "Both lists are exhausted — only the carry remains. Write it as a new final digit.",
          variables: { sum: "1", digit: "1", carry: "0" },
          visuals: [l1(null, [0, 1, 2]), l2(null, [0, 1, 2]), result([0, 1, 1, 1])],
        },
        {
          lines: [6, 18],
          label: "Everything is `null` and `carry` is 0 → stop. Return [0, 1, 1, 1] = 555 + 555 = 1110, stored least-significant first. ✓",
          variables: { result: "[0, 1, 1, 1]" },
          visuals: [result([0, 1, 1, 1])],
        },
      ],
      approach: {
        summary:
          "The lists store digits least-significant first — exactly the order you add by hand. Add matching digits plus the carry, write the ones digit, carry the tens. Create one result node per digit. The loop continues while EITHER list has digits OR a carry remains; that last condition is what produces a new leading digit (the 1 in 1110).",
        timeComplexity: "O(max(n, m)) — one node per result digit.",
        spaceComplexity: "O(max(n, m)) for the result list.",
        notes: [
          "carry > 0 in the loop condition is the subtle bit — it creates the final node when the last addition overflows (555 + 555 needs a 4th digit).",
          "l1?.val ?? 0 combines null-conditional and null-coalescing to treat a finished list as contributing 0 — handling unequal lengths for free.",
          "digit = sum % 10 and carry = sum / 10 split a two-digit sum: remainder is the digit, integer division is the carry.",
          "The dummy node again avoids a special case for the first digit; return dummy.next is the real head.",
        ],
      },
    },
  ],
};
