import type { Problem, VisualState } from "../../domain/types";

// Elber's actual solution from
// LeetcodePractice/Problems/SlidingWindow/LongestSubstringWithoutRepeatingCharacters,
// presented in LeetCode submission format.
const code = `public class Solution {
    public int LengthOfLongestSubstring(string s) {
        var charSet = new HashSet<char>();
        int l = 0;
        int maxLen = 0;
        for (int r = 0; r < s.Length; r++)
        {
            while (charSet.Contains(s[r]))
            {
                charSet.Remove(s[l]);
                l++;
            }
            charSet.Add(s[r]);

            maxLen = Math.Max(maxLen, r - l + 1);
        }
        return maxLen;
    }
}`;

/** Traced input (Example 1 from the practice repo): s = "zxyzxyz" → 3. */
const chars = ["z", "x", "y", "z", "x", "y", "z"];

/** The highlighted range l..r is the current window. */
function sVisual(l: number, r: number): VisualState {
  const window = [];
  for (let i = l; i <= r; i++) window.push(i);
  return { type: "array", title: "s (window highlighted)", items: chars, pointers: { l, r }, highlighted: window };
}

function setVisual(items: string[], activeItem?: string): VisualState {
  return { type: "set", title: "charSet", items, activeItem };
}

export const longestSubstringWithoutRepeatingCharacters: Problem = {
  slug: "longest-substring-without-repeating-characters",
  number: 3,
  title: "Longest Substring Without Repeating Characters",
  difficulty: "Medium",
  category: "Sliding Window",
  leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
  solutions: [
    {
      name: "Sliding Window",
      input: 's = "zxyzxyz"',
      code,
      steps: [
    {
      lines: [3, 4, 5],
      label: "Setup: an empty HashSet holding the characters inside the window, l = 0 (window's left edge), maxLen = 0 (best seen so far).",
      variables: { l: "0", maxLen: "0" },
      visuals: [
        { type: "array", title: "s (window highlighted)", items: chars, pointers: { l: 0 } },
        setVisual([]),
      ],
    },
    {
      lines: [6],
      label: "r = 0: the window's right edge looks at 'z'.",
      variables: { l: "0", r: "0", maxLen: "0" },
      visuals: [sVisual(0, 0), setVisual([])],
    },
    {
      lines: [8, 13],
      label: "'z' isn't in the set — no duplicate. Add it; the window is \"z\".",
      variables: { l: "0", r: "0", maxLen: "0" },
      visuals: [sVisual(0, 0), setVisual(["z"], "z")],
    },
    {
      lines: [15],
      label: "Window size = r − l + 1 = 1. maxLen = 1.",
      variables: { l: "0", r: "0", maxLen: "1" },
      visuals: [sVisual(0, 0), setVisual(["z"])],
    },
    {
      lines: [6],
      label: "r = 1: 'x'.",
      variables: { l: "0", r: "1", maxLen: "1" },
      visuals: [sVisual(0, 1), setVisual(["z"])],
    },
    {
      lines: [8, 13],
      label: "'x' is new — add it. Window: \"zx\".",
      variables: { l: "0", r: "1", maxLen: "1" },
      visuals: [sVisual(0, 1), setVisual(["z", "x"], "x")],
    },
    {
      lines: [15],
      label: "Window size 2 → maxLen = 2.",
      variables: { l: "0", r: "1", maxLen: "2" },
      visuals: [sVisual(0, 1), setVisual(["z", "x"])],
    },
    {
      lines: [6],
      label: "r = 2: 'y'.",
      variables: { l: "0", r: "2", maxLen: "2" },
      visuals: [sVisual(0, 2), setVisual(["z", "x"])],
    },
    {
      lines: [8, 13],
      label: "'y' is new — add it. Window: \"zxy\".",
      variables: { l: "0", r: "2", maxLen: "2" },
      visuals: [sVisual(0, 2), setVisual(["z", "x", "y"], "y")],
    },
    {
      lines: [15],
      label: "Window size 3 → maxLen = 3.",
      variables: { l: "0", r: "2", maxLen: "3" },
      visuals: [sVisual(0, 2), setVisual(["z", "x", "y"])],
    },
    {
      lines: [6],
      label: "r = 3: 'z' again — trouble ahead.",
      variables: { l: "0", r: "3", maxLen: "3" },
      visuals: [sVisual(0, 3), setVisual(["z", "x", "y"])],
    },
    {
      lines: [8],
      label: "charSet already contains 'z' → the window has a duplicate. Shrink it from the left until the old 'z' is gone.",
      variables: { l: "0", r: "3", maxLen: "3" },
      visuals: [sVisual(0, 3), setVisual(["z", "x", "y"], "z")],
    },
    {
      lines: [10, 11],
      label: "Evict s[0] ('z') from the set and slide l to 1. The duplicate is gone — the while check fails now.",
      variables: { l: "1", r: "3", maxLen: "3" },
      visuals: [sVisual(1, 3), setVisual(["x", "y"], "z")],
    },
    {
      lines: [13, 15],
      label: "Add the NEW 'z'. Window \"xyz\", size 3 — maxLen stays 3.",
      variables: { l: "1", r: "3", maxLen: "3" },
      visuals: [sVisual(1, 3), setVisual(["x", "y", "z"], "z")],
    },
    {
      lines: [6, 8],
      label: "r = 4: 'x' — duplicate again ('x' entered at index 1).",
      variables: { l: "1", r: "4", maxLen: "3" },
      visuals: [sVisual(1, 4), setVisual(["x", "y", "z"], "x")],
    },
    {
      lines: [10, 11],
      label: "Evict s[1] ('x'), l = 2. Duplicate cleared in one shrink.",
      variables: { l: "2", r: "4", maxLen: "3" },
      visuals: [sVisual(2, 4), setVisual(["y", "z"], "x")],
    },
    {
      lines: [13, 15],
      label: "Add the new 'x'. Window \"yzx\", size 3 — maxLen stays 3.",
      variables: { l: "2", r: "4", maxLen: "3" },
      visuals: [sVisual(2, 4), setVisual(["y", "z", "x"], "x")],
    },
    {
      lines: [6, 8],
      label: "r = 5: 'y' — duplicate (from index 2).",
      variables: { l: "2", r: "5", maxLen: "3" },
      visuals: [sVisual(2, 5), setVisual(["y", "z", "x"], "y")],
    },
    {
      lines: [10, 11],
      label: "Evict s[2] ('y'), l = 3.",
      variables: { l: "3", r: "5", maxLen: "3" },
      visuals: [sVisual(3, 5), setVisual(["z", "x"], "y")],
    },
    {
      lines: [13, 15],
      label: "Add the new 'y'. Window \"zxy\", size 3.",
      variables: { l: "3", r: "5", maxLen: "3" },
      visuals: [sVisual(3, 5), setVisual(["z", "x", "y"], "y")],
    },
    {
      lines: [6, 8],
      label: "r = 6: 'z' — duplicate (from index 3).",
      variables: { l: "3", r: "6", maxLen: "3" },
      visuals: [sVisual(3, 6), setVisual(["z", "x", "y"], "z")],
    },
    {
      lines: [10, 11],
      label: "Evict s[3] ('z'), l = 4.",
      variables: { l: "4", r: "6", maxLen: "3" },
      visuals: [sVisual(4, 6), setVisual(["x", "y"], "z")],
    },
    {
      lines: [13, 15],
      label: "Add the new 'z'. Window \"xyz\", size 3 — maxLen never beats 3.",
      variables: { l: "4", r: "6", maxLen: "3" },
      visuals: [sVisual(4, 6), setVisual(["x", "y", "z"], "z")],
    },
    {
      lines: [17],
      label: "Loop done — the longest run without a repeat was 3 (\"zxy\" / \"xyz\"). Return 3. ✓",
      variables: { result: "3" },
      visuals: [sVisual(4, 6), setVisual(["x", "y", "z"])],
    },
  ],
  approach: {
    summary:
      "A sliding window over the string: r expands the window one character per iteration, and the HashSet knows exactly what's inside it. When s[r] is already in the set, the window contains a duplicate — shrink from the left (evict s[l], advance l) until that character is gone, then admit the new one. Every character enters the window once and leaves at most once, so two pointers cover all substrings worth checking.",
    timeComplexity: "O(n) — r moves n times and l can only move n times total across the whole run, so the inner while is amortized O(1).",
    spaceComplexity: "O(min(n, alphabet)) — the set never holds more than one of each distinct character.",
    notes: [
      "The inner while loop (not if) matters: one new character can require evicting SEVERAL from the left before the duplicate clears.",
      "HashSet<char> gives O(1) Contains/Add/Remove — the window-membership question is what makes the two-pointer trick fast.",
      "s[r] indexes the string directly — C# strings are IReadOnlyList<char>, no ToCharArray() copy needed.",
      "An upgrade worth knowing: Dictionary<char, int> storing each char's last index lets l JUMP straight past the duplicate instead of evicting one at a time — same O(n), fewer steps.",
    ],
  },
    },
  ],
};
