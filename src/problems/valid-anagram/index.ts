import type { Problem, VisualState } from "../../domain/types";

// Elber's actual solution from LeetcodePractice/Problems/ArraysAndHashing/ValidAnagram,
// presented in LeetCode submission format.
const code = `public class Solution {
    public bool IsAnagram(string s, string t) {
        if (s.Length != t.Length) return false;
        Dictionary<char, int> freq = new();
        foreach (char c in s)
        {
            if (!freq.ContainsKey(c))
            {
                freq[c] = 1;
            }
            else
            {
                freq[c]++;
            }
        }
        foreach (char c in t)
        {
            if (!freq.ContainsKey(c)) return false;
            else freq[c]--;

            if (freq[c] < 0) return false;
        }
        return true;
    }
}`;

function freq(entries: [string, number][], activeKey?: string): VisualState {
  return { type: "dict", title: "freq <char, count>", entries, activeKey };
}

export const validAnagram: Problem = {
  slug: "valid-anagram",
  number: 242,
  title: "Valid Anagram",
  difficulty: "Easy",
  category: "Arrays & Hashing",
  leetcodeUrl: "https://leetcode.com/problems/valid-anagram/",
  solutions: [
    {
      name: "Frequency Count",
      input: 's = "jar", t = "jam"',
      code,
      steps: [
        {
          lines: [3, 4],
          label: "Both strings are length 3 — equal lengths, so an anagram is still possible. Build a frequency map of s.",
          visuals: [freq([])],
        },
        {
          lines: [5, 7, 9],
          label: "Count s: 'j' is new → freq['j'] = 1.",
          visuals: [freq([["j", 1]], "j")],
        },
        {
          lines: [7, 9],
          label: "'a' is new → freq['a'] = 1.",
          visuals: [freq([["j", 1], ["a", 1]], "a")],
        },
        {
          lines: [7, 9],
          label: "'r' is new → freq['r'] = 1. s is now {j:1, a:1, r:1}.",
          visuals: [freq([["j", 1], ["a", 1], ["r", 1]], "r")],
        },
        {
          lines: [16, 18, 19],
          label: "Now walk t and SUBTRACT. 'j' is present → freq['j'] drops to 0.",
          visuals: [freq([["j", 0], ["a", 1], ["r", 1]], "j")],
        },
        {
          lines: [18, 19],
          label: "'a' is present → freq['a'] drops to 0.",
          visuals: [freq([["j", 0], ["a", 0], ["r", 1]], "a")],
        },
        {
          lines: [18],
          label: "'m' is NOT in the map — s never had an 'm'. So t can't be an anagram of s → return false. ✓",
          variables: { result: "false" },
          visuals: [freq([["j", 0], ["a", 0], ["r", 1]])],
        },
      ],
      approach: {
        summary:
          "Anagrams use exactly the same letters with the same multiplicities. Count every character in s, then walk t subtracting. Two ways it can fail: t needs a letter s never had (missing key), or t needs more of a letter than s had (a count goes negative). Survive the whole pass and every count lands back at zero — they match.",
        timeComplexity: "O(n) — two passes over strings of equal length.",
        spaceComplexity: "O(1) — at most 26 lowercase letters in the map.",
        notes: [
          "The length check first is a free reject: different lengths can't be anagrams, and it avoids building the map at all.",
          "Two guards cover both failure modes — !ContainsKey(c) (a letter s lacks) and freq[c] < 0 (more of a letter than s had).",
          "Counting up from s then down from t means a true anagram leaves every entry at exactly 0.",
          "Sorting both strings and comparing is the O(n log n) alternative that needs no dictionary.",
        ],
      },
    },
  ],
};
