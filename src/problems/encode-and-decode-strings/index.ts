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

// The encoded form of ["hi", "bye"], one cell per character: 2#hi3#bye
const encoded = ["2", "#", "h", "i", "3", "#", "b", "y", "e"];

function enc(pointers?: Record<string, number>, highlighted?: number[]): VisualState {
  return { type: "array", title: "encoded string", items: encoded, pointers, highlighted };
}

function res(items: string[], highlightLast = false): VisualState {
  return {
    type: "array",
    title: "result (decoded list)",
    items,
    highlighted: highlightLast && items.length > 0 ? [items.length - 1] : [],
  };
}

export const encodeAndDecodeStrings: Problem = {
  slug: "encode-and-decode-strings",
  number: 271,
  title: "Encode and Decode Strings",
  difficulty: "Medium",
  category: "Arrays & Hashing",
  leetcodeUrl: "https://leetcode.com/problems/encode-and-decode-strings/",
  description: `# Encode and Decode Strings

**LeetCode Problem #271**  
**Difficulty:** Medium  
**Topics:** Array, String, Design

## Description

Design an algorithm to encode a list of strings to a string. The encoded string is then sent over the network and is decoded back to the original list of strings.

Machine 1 (sender) has the function:

\`\`\`csharp
public string Encode(IList<string> strs)
{
    // ... your code
    return encoded_string;
}
\`\`\`

Machine 2 (receiver) has the function:

\`\`\`csharp
public List<string> Decode(string s)
{
    // ... your code
    return decoded_strs;
}
\`\`\`

So Machine 1 does:
\`\`\`csharp
string encoded_string = encode(strs);
\`\`\`

and Machine 2 does:
\`\`\`csharp
List<string> decoded_strs = decode(encoded_string);
\`\`\`

\`decoded_strs\` in Machine 2 should be the same as the input \`strs\` in Machine 1.

## Examples

**Example 1:**
\`\`\`
Input: strs = ["Hello","World"]
Output: ["Hello","World"]

Explanation:
Solution solution = new Solution();
string encoded_string = solution.Encode(strs);

// Machine 1 ---encoded_string---> Machine 2

List<string> decoded_strs = solution.Decode(encoded_string);
\`\`\`

**Example 2:**
\`\`\`
Input: strs = [""]
Output: [""]
\`\`\`

## Constraints

- \`0 <= strs.length < 100\`
- \`0 <= strs[i].length < 200\`
- \`strs[i]\` contains any possible characters out of 256 valid ASCII characters.

## Follow-up

Could you write a generalized algorithm to work on any possible set of characters?`,
  author: ELBER,
  solutions: [
    {
      name: "Length Prefixing",
      input: '["hi", "bye"]',
      code,
      steps: [
        {
          lines: [2, 3],
          label: "Encoding: glue the strings into one. The trick is to prefix each with its length and a # marker, so decoding stays unambiguous even if a string itself contains a #.",
          visuals: [{ type: "array", title: "input list", items: ["hi", "bye"] }],
        },
        {
          lines: [4, 6],
          label: "'hi' has length 2 — append \"2#hi\".",
          visuals: [{ type: "array", title: "input list", items: ["hi", "bye"], highlighted: [0] }, enc(undefined, [0, 1, 2, 3])],
        },
        {
          lines: [6, 8],
          label: "'bye' has length 3 — append \"3#bye\". Final encoded string: 2#hi3#bye",
          visuals: [{ type: "array", title: "input list", items: ["hi", "bye"], highlighted: [1] }, enc()],
        },
        {
          lines: [11, 13, 14],
          label: "Now decode. Start pointer `i` at 0 and an empty result list. Read a length prefix, then grab exactly that many characters.",
          variables: { i: "0" },
          visuals: [enc({ i: 0 }), res([])],
        },
        {
          lines: [16, 17],
          label: "Find the next '#' at index `delim` = 1. The digit before it — \"2\" — is the `len` of the next string.",
          variables: { i: "0", delim: "1", len: "2" },
          visuals: [enc({ i: 0, delim: 1 }, [0]), res([])],
        },
        {
          lines: [18, 19, 20],
          label: "Skip past '#' to index 2 and take 2 characters — that's \"hi\". Add it to `res`. Advance `i` to 4.",
          variables: { i: "4", added: '"hi"' },
          visuals: [enc({ i: 4 }, [2, 3]), res(["hi"], true)],
        },
        {
          lines: [16, 17],
          label: "Find the next '#' at index `delim` = 5. The digit before it — \"3\" — is the `len` of the next string.",
          variables: { i: "4", delim: "5", len: "3" },
          visuals: [enc({ i: 4, delim: 5 }, [4]), res(["hi"])],
        },
        {
          lines: [18, 19, 20],
          label: "Skip past '#' to index 6 and take 3 characters — that's \"bye\". Add it to `res`. `i` advances to 9.",
          variables: { i: "9", added: '"bye"' },
          visuals: [enc({ i: 9 }, [6, 7, 8]), res(["hi", "bye"], true)],
        },
        {
          lines: [14, 22],
          label: "`i` = 9 is the end of the string — loop exits. Return `res` = [\"hi\", \"bye\"]. ✓",
          variables: { result: '["hi", "bye"]' },
          visuals: [enc(), res(["hi", "bye"])],
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
