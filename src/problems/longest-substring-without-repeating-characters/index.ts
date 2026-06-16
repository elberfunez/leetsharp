import type { Problem, VisualState } from "../../domain/types";
import { ELBER } from "../authors";

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

/** Traced input: s = "zxyzxyz" → 3. */
const chars = ["z", "x", "y", "z", "x", "y", "z"];

function sArr(l: number, r: number): VisualState {
  const window: number[] = [];
  for (let i = l; i <= r; i++) window.push(i);
  return { type: "array", title: "s", items: chars, pointers: { l, r }, highlighted: window };
}

function charSet(items: string[], activeItem?: string): VisualState {
  return { type: "set", title: "charSet (window contents)", items, activeItem };
}

export const longestSubstringWithoutRepeatingCharacters: Problem = {
  slug: "longest-substring-without-repeating-characters",
  number: 3,
  title: "Longest Substring Without Repeating Characters",
  difficulty: "Medium",
  category: "Sliding Window",
  leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
  author: ELBER,
  solutions: [
    {
      name: "Sliding Window",
      input: 's = "zxyzxyz"',
      code,
      steps: [
        {
          lines: [3, 4, 5],
          label: "Initialize: empty `charSet` (tracks what's inside the window), `l` = 0 (left edge), `maxLen` = 0 (longest found so far).",
          variables: { l: "0", maxLen: "0" },
          visuals: [
            { type: "array", title: "s", items: chars, pointers: { l: 0 } },
            charSet([]),
          ],
        },
        // ── r = 0, s[r] = 'z' ──────────────────────────────────────
        {
          lines: [6],
          label: "`r` = 0 → looking at `s[r]` = 'z'.",
          variables: { l: "0", r: "0", maxLen: "0" },
          visuals: [sArr(0, 0), charSet([])],
        },
        {
          lines: [8, 13],
          label: "'z' is NOT in `charSet` — no duplicate. Add `s[r]` = 'z' to the set.",
          variables: { l: "0", r: "0", maxLen: "0" },
          visuals: [sArr(0, 0), charSet(["z"], "z")],
        },
        {
          lines: [15],
          label: "Window `s[l..r]` = \"z\" — size `r - l + 1` = 1. `maxLen` = 1.",
          variables: { l: "0", r: "0", maxLen: "1" },
          visuals: [sArr(0, 0), charSet(["z"])],
        },
        // ── r = 1, s[r] = 'x' ──────────────────────────────────────
        {
          lines: [6],
          label: "`r` = 1 → looking at `s[r]` = 'x'.",
          variables: { l: "0", r: "1", maxLen: "1" },
          visuals: [sArr(0, 1), charSet(["z"])],
        },
        {
          lines: [8, 13],
          label: "'x' is NOT in `charSet`. Add `s[r]` = 'x' to the set.",
          variables: { l: "0", r: "1", maxLen: "1" },
          visuals: [sArr(0, 1), charSet(["z", "x"], "x")],
        },
        {
          lines: [15],
          label: "Window `s[l..r]` = \"zx\" — size 2. `maxLen` = 2.",
          variables: { l: "0", r: "1", maxLen: "2" },
          visuals: [sArr(0, 1), charSet(["z", "x"])],
        },
        // ── r = 2, s[r] = 'y' ──────────────────────────────────────
        {
          lines: [6],
          label: "`r` = 2 → looking at `s[r]` = 'y'.",
          variables: { l: "0", r: "2", maxLen: "2" },
          visuals: [sArr(0, 2), charSet(["z", "x"])],
        },
        {
          lines: [8, 13],
          label: "'y' is NOT in `charSet`. Add `s[r]` = 'y' to the set.",
          variables: { l: "0", r: "2", maxLen: "2" },
          visuals: [sArr(0, 2), charSet(["z", "x", "y"], "y")],
        },
        {
          lines: [15],
          label: "Window `s[l..r]` = \"zxy\" — size 3. `maxLen` = 3.",
          variables: { l: "0", r: "2", maxLen: "3" },
          visuals: [sArr(0, 2), charSet(["z", "x", "y"])],
        },
        // ── r = 3, s[r] = 'z' — DUPLICATE ─────────────────────────
        {
          lines: [6],
          label: "`r` = 3 → looking at `s[r]` = 'z'.",
          variables: { l: "0", r: "3", maxLen: "3" },
          visuals: [sArr(0, 3), charSet(["z", "x", "y"])],
        },
        {
          lines: [8],
          label: "'z' IS already in `charSet` — duplicate! Must shrink the window from the left until the old 'z' is gone.",
          variables: { l: "0", r: "3", maxLen: "3" },
          visuals: [sArr(0, 3), charSet(["z", "x", "y"], "z")],
        },
        {
          lines: [10, 11],
          label: "Remove `s[l]` = `s[0]` = 'z' from `charSet`, then `l`++. `l` is now 1 — old 'z' is evicted.",
          variables: { l: "1", r: "3", maxLen: "3" },
          visuals: [sArr(1, 3), charSet(["x", "y"], "z")],
        },
        {
          lines: [13, 15],
          label: "'z' no longer in `charSet`. Add `s[r]` = 'z'. Window `s[l..r]` = \"xyz\" — size 3. `maxLen` stays 3.",
          variables: { l: "1", r: "3", maxLen: "3" },
          visuals: [sArr(1, 3), charSet(["x", "y", "z"], "z")],
        },
        // ── r = 4, s[r] = 'x' — DUPLICATE ─────────────────────────
        {
          lines: [6, 8],
          label: "`r` = 4 → `s[r]` = 'x'. 'x' IS in `charSet` — duplicate.",
          variables: { l: "1", r: "4", maxLen: "3" },
          visuals: [sArr(1, 4), charSet(["x", "y", "z"], "x")],
        },
        {
          lines: [10, 11],
          label: "Remove `s[l]` = `s[1]` = 'x' from `charSet`, then `l`++. `l` = 2.",
          variables: { l: "2", r: "4", maxLen: "3" },
          visuals: [sArr(2, 4), charSet(["y", "z"], "x")],
        },
        {
          lines: [13, 15],
          label: "'x' cleared. Add `s[r]` = 'x'. Window `s[l..r]` = \"yzx\" — size 3. `maxLen` stays 3.",
          variables: { l: "2", r: "4", maxLen: "3" },
          visuals: [sArr(2, 4), charSet(["y", "z", "x"], "x")],
        },
        // ── r = 5, s[r] = 'y' — DUPLICATE ─────────────────────────
        {
          lines: [6, 8],
          label: "`r` = 5 → `s[r]` = 'y'. 'y' IS in `charSet` — duplicate.",
          variables: { l: "2", r: "5", maxLen: "3" },
          visuals: [sArr(2, 5), charSet(["y", "z", "x"], "y")],
        },
        {
          lines: [10, 11],
          label: "Remove `s[l]` = `s[2]` = 'y' from `charSet`, then `l`++. `l` = 3.",
          variables: { l: "3", r: "5", maxLen: "3" },
          visuals: [sArr(3, 5), charSet(["z", "x"], "y")],
        },
        {
          lines: [13, 15],
          label: "'y' cleared. Add `s[r]` = 'y'. Window `s[l..r]` = \"zxy\" — size 3. `maxLen` stays 3.",
          variables: { l: "3", r: "5", maxLen: "3" },
          visuals: [sArr(3, 5), charSet(["z", "x", "y"], "y")],
        },
        // ── r = 6, s[r] = 'z' — DUPLICATE ─────────────────────────
        {
          lines: [6, 8],
          label: "`r` = 6 → `s[r]` = 'z'. 'z' IS in `charSet` — duplicate.",
          variables: { l: "3", r: "6", maxLen: "3" },
          visuals: [sArr(3, 6), charSet(["z", "x", "y"], "z")],
        },
        {
          lines: [10, 11],
          label: "Remove `s[l]` = `s[3]` = 'z' from `charSet`, then `l`++. `l` = 4.",
          variables: { l: "4", r: "6", maxLen: "3" },
          visuals: [sArr(4, 6), charSet(["x", "y"], "z")],
        },
        {
          lines: [13, 15],
          label: "'z' cleared. Add `s[r]` = 'z'. Window `s[l..r]` = \"xyz\" — size 3. `maxLen` stays 3.",
          variables: { l: "4", r: "6", maxLen: "3" },
          visuals: [sArr(4, 6), charSet(["x", "y", "z"], "z")],
        },
        // ── done ────────────────────────────────────────────────────
        {
          lines: [17],
          label: "`r` reached the end. Longest window without a repeat was 3 (\"zxy\" / \"xyz\"). Return `maxLen` = 3. ✓",
          variables: { result: "3" },
          visuals: [sArr(4, 6), charSet(["x", "y", "z"])],
        },
      ],
      approach: {
        summary:
          "A sliding window over the string: r expands the window one character per iteration, and the HashSet tracks exactly what's inside. When s[r] is already in the set, the window has a duplicate — shrink from the left (remove s[l], advance l) until that character is gone, then admit the new one. Every character enters and leaves at most once, so the two pointers run in O(n) total.",
        timeComplexity: "O(n) — r moves n times and l can only move n times total across the whole run.",
        spaceComplexity: "O(min(n, alphabet)) — the set never holds more than one of each distinct character.",
        notes: [
          "The inner while loop (not if) is important: one new character could force evicting several from the left before the duplicate clears.",
          "HashSet<char> gives O(1) Contains/Add/Remove — that's what makes the window-membership check fast.",
          "s[r] indexes the string directly — C# strings are IReadOnlyList<char>, no ToCharArray() copy needed.",
          "An upgrade worth knowing: Dictionary<char, int> storing each char's last index lets l JUMP straight past the duplicate instead of evicting one at a time — same O(n), fewer steps.",
        ],
      },
    },
  ],
};
