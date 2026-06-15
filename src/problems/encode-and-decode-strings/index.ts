import type { Problem, VisualState } from "../../domain/types";
import { ELBER } from "../authors";

// Elber's actual solution from LeetcodePractice/Problems/ArraysAndHashing/EncodeDecodeStrings,
// presented in LeetCode submission format.
const code = `public class Solution {
    public string Encode(IList<string> strs) {
        StringBuilder sb = new();
        foreach (string s in strs)
        {
            sb.Append($"{s.Length}#{s}");
        }
        return sb.ToString();
    }

    public List<string> Decode(string s) {
        List<string> res = new();
        int i = 0;
        while (i < s.Length)
        {
            int delim = s.IndexOf("#", i);
            int len = int.Parse(s.Substring(i, delim - i));
            i = delim + 1;
            res.Add(s.Substring(i, len));
            i += len;
        }
        return res;
    }
}`;

// The encoded form of ["Hello", "World"], one cell per character.
const encoded = ["5", "#", "H", "e", "l", "l", "o", "5", "#", "W", "o", "r", "l", "d"];

function enc(pointers?: Record<string, number>, highlighted?: number[]): VisualState {
  return { type: "array", title: "encoded string", items: encoded, pointers, highlighted };
}

export const encodeAndDecodeStrings: Problem = {
  slug: "encode-and-decode-strings",
  number: 271,
  title: "Encode and Decode Strings",
  difficulty: "Medium",
  category: "Arrays & Hashing",
  leetcodeUrl: "https://leetcode.com/problems/encode-and-decode-strings/",
  author: ELBER,
  solutions: [
    {
      name: "Length Prefixing",
      input: '["Hello", "World"]',
      code,
      steps: [
        {
          lines: [2, 3],
          label: "Encoding: glue the strings into one. The trick is to prefix each with its length and a # marker, so decoding stays unambiguous even if a string itself contains a #.",
          visuals: [{ type: "array", title: "input list", items: ["Hello", "World"] }],
        },
        {
          lines: [4, 6],
          label: "'Hello' has length 5 → append \"5#Hello\".",
          visuals: [{ type: "array", title: "input list", items: ["Hello", "World"], highlighted: [0] }, enc(undefined, [0, 1, 2, 3, 4, 5, 6])],
        },
        {
          lines: [6, 8],
          label: "'World' → append \"5#World\". Final encoded string: 5#Hello5#World",
          visuals: [{ type: "array", title: "input list", items: ["Hello", "World"], highlighted: [1] }, enc()],
        },
        {
          lines: [11, 13, 14],
          label: "Decoding: scan with pointer i = 0. While there's string left, read a length, then read exactly that many characters.",
          variables: { i: "0" },
          visuals: [enc({ i: 0 })],
        },
        {
          lines: [16, 17],
          label: "Find the next '#' (index 1). The digits before it — \"5\" — are the length of the next string.",
          variables: { i: "0", delim: "1", len: "5" },
          visuals: [enc({ i: 0, delim: 1 }, [0])],
        },
        {
          lines: [18, 19, 20],
          label: "Skip past the '#' to index 2 and take 5 characters → \"Hello\". Advance i past them to 7.",
          variables: { i: "7", added: '"Hello"' },
          visuals: [enc({ i: 7 }, [2, 3, 4, 5, 6])],
        },
        {
          lines: [16, 17],
          label: "Next '#' is at index 8; the \"5\" before it (index 7) is the next length.",
          variables: { i: "7", delim: "8", len: "5" },
          visuals: [enc({ i: 7, delim: 8 }, [7])],
        },
        {
          lines: [18, 19, 20],
          label: "Take 5 characters from index 9 → \"World\". i advances to 14.",
          variables: { i: "14", added: '"World"' },
          visuals: [enc({ i: 14 }, [9, 10, 11, 12, 13])],
        },
        {
          lines: [14, 22],
          label: "i = 14 is the end of the string → stop. Return [\"Hello\", \"World\"]. ✓",
          variables: { result: '["Hello", "World"]' },
          visuals: [enc()],
        },
      ],
      approach: {
        summary:
          "Serializing a list of strings is tricky because any delimiter you pick could appear inside a string. Length-prefix encoding solves it: before each string, write its length and a marker (#). To decode, read digits up to the #, parse the length n, then grab exactly n characters — the content is never scanned for delimiters, so it can contain anything, # included.",
        timeComplexity: "O(total characters) for both encode and decode.",
        spaceComplexity: "O(total characters) for the output.",
        notes: [
          "Why length-prefix instead of split-on-#? A string like \"a#b\" contains the delimiter. The length tells the decoder exactly how many characters to take, so the content is read blindly.",
          "StringBuilder avoids the quadratic cost of repeatedly concatenating immutable strings in the encode loop.",
          "s.Substring(i, len) in C# is (startIndex, COUNT) — count, not end index — which lines up exactly with the stored length.",
          "int.Parse over s.Substring(i, delim - i) reads a multi-digit length, so strings longer than 9 characters decode correctly.",
        ],
      },
    },
  ],
};
