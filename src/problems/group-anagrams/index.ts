import type { Problem, VisualState } from "../../domain/types";
import { ELBER } from "../authors";

// Elber's actual solution from LeetcodePractice/Problems/ArraysAndHashing/GroupAnagrams,
// presented in LeetCode submission format.
const code = `public class Solution {
    public List<List<string>> GroupAnagrams(string[] strs) {
        var groups = new Dictionary<string, List<string>>();
        foreach (var s in strs)
        {
            char[] chars = s.ToCharArray();
            Array.Sort(chars);
            string key = new string(chars);
            if (!groups.TryGetValue(key, out var group))
            {
                group = new List<string>();
                groups[key] = group;
            }
            group.Add(s);
        }
        return new List<List<string>>(groups.Values);
    }
}`;

/** Traced input (Example 1 from the practice repo):
 *  ["act", "pots", "tops", "cat", "stop", "hat"]. */
const strs = ["act", "pots", "tops", "cat", "stop", "hat"];

function arr(i: number): VisualState {
  return { type: "array", title: "strs", items: strs, pointers: { s: i }, highlighted: [i] };
}

function groups(entries: [string, string][], activeKey?: string): VisualState {
  return { type: "dict", title: "groups <sorted key, words>", entries, activeKey };
}

export const groupAnagrams: Problem = {
  slug: "group-anagrams",
  number: 49,
  title: "Group Anagrams",
  difficulty: "Medium",
  category: "Arrays & Hashing",
  leetcodeUrl: "https://leetcode.com/problems/group-anagrams/",
  description: `# Group Anagrams

**Difficulty:** Medium  
**Topic:** Arrays & Hashing

---

## Description

Given an array of strings \`strs\`, group all anagrams together into sublists. You may return the output in any order.

An **anagram** is a string that contains the exact same characters as another string, but the order of the characters can be different.

---

## Examples

### Example 1:

\`\`\`
Input: strs = ["act","pots","tops","cat","stop","hat"]

Output: [["hat"],["act", "cat"],["stop", "pots", "tops"]]

Explanation: 
- "act" and "cat" are anagrams
- "pots", "tops", "stop" are anagrams
- "hat" has no anagrams
\`\`\`

### Example 2:

\`\`\`
Input: strs = ["x"]

Output: [["x"]]

Explanation: Single string in its own group
\`\`\`

### Example 3:

\`\`\`
Input: strs = [""]

Output: [[""]]

Explanation: Empty string in its own group
\`\`\`

---

## Constraints

- \`1 <= strs.length <= 1000\`
- \`0 <= strs[i].length <= 100\`
- \`strs[i]\` is made up of lowercase English letters`,
  author: ELBER,
  solutions: [
    {
      name: "Sorted Key",
      input: '["act", "pots", "tops", "cat", "stop", "hat"]',
      code,
      steps: [
        {
          lines: [3],
          label: "Anagrams share the same letters, so sorting a word's letters gives a signature that all its anagrams share. Use that signature as a bucket `key`.",
          visuals: [{ type: "array", title: "strs", items: strs }, groups([])],
        },
        {
          lines: [6, 7, 8],
          label: "'act' → sort its letters → key \"act\".",
          variables: { key: '"act"' },
          visuals: [arr(0), groups([])],
        },
        {
          lines: [9, 11, 12, 14],
          label: "Key \"act\" is new → create a bucket and drop 'act' in.",
          visuals: [arr(0), groups([["act", "act"]], "act")],
        },
        {
          lines: [6, 7, 8, 11, 14],
          label: "'pots' → sorted \"opst\" → new bucket holding 'pots'.",
          variables: { key: '"opst"' },
          visuals: [arr(1), groups([["act", "act"], ["opst", "pots"]], "opst")],
        },
        {
          lines: [6, 7, 8, 9, 14],
          label: "'tops' → sorted \"opst\" — that bucket already exists! Add 'tops' to `groups[\"opst\"]`.",
          variables: { key: '"opst"' },
          visuals: [arr(2), groups([["act", "act"], ["opst", "pots, tops"]], "opst")],
        },
        {
          lines: [6, 7, 8, 9, 14],
          label: "'cat' → sorted \"act\" — existing bucket. Add 'cat' alongside 'act' in `groups[\"act\"]`.",
          variables: { key: '"act"' },
          visuals: [arr(3), groups([["act", "act, cat"], ["opst", "pots, tops"]], "act")],
        },
        {
          lines: [6, 7, 8, 9, 14],
          label: "'stop' → sorted \"opst\" — existing. Add 'stop'.",
          variables: { key: '"opst"' },
          visuals: [arr(4), groups([["act", "act, cat"], ["opst", "pots, tops, stop"]], "opst")],
        },
        {
          lines: [6, 7, 8, 11, 14],
          label: "'hat' → sorted \"aht\" → new bucket with 'hat'.",
          variables: { key: '"aht"' },
          visuals: [arr(5), groups([["act", "act, cat"], ["opst", "pots, tops, stop"], ["aht", "hat"]], "aht")],
        },
        {
          lines: [16],
          label: "Return `groups.Values`: [[act, cat], [pots, tops, stop], [hat]]. ✓",
          variables: { result: "[[act, cat], [pots, tops, stop], [hat]]" },
          visuals: [groups([["act", "act, cat"], ["opst", "pots, tops, stop"], ["aht", "hat"]])],
        },
      ],
      approach: {
        summary:
          "Two strings are anagrams exactly when their letters, sorted, come out identical. Compute each word's sorted-letter signature and use it as a dictionary key — every word with the same signature lands in the same bucket. The buckets are the answer.",
        timeComplexity: "O(n · m log m) — n words, each up to length m, sorted to form its key.",
        spaceComplexity: "O(n · m) to store every word across the buckets.",
        notes: [
          "TryGetValue(key, out var group) fetches the bucket and reports whether it existed in a single lookup; if not, create and store it.",
          "group is a REFERENCE to the list inside the dictionary, so group.Add(s) mutates the stored bucket directly — no write-back needed.",
          "Sorting each word is the signature step. A 26-length character-count array is an O(m) signature that avoids the per-word sort for the optimal version.",
          "new string(chars) turns the sorted char[] back into a string usable as a dictionary key.",
        ],
      },
    },
  ],
};
