import type { Problem, TreeVisualNode, VisualState } from "../../domain/types";
import { ELBER } from "../authors";

// Elber's actual solution from LeetcodePractice/Problems/Tries/ImplementTrie,
// presented in LeetCode submission format.
const code = `public class PrefixTree {
    private class TrieNode {
        public Dictionary<char, TrieNode> Children = new();
        public bool IsEndOfWord = false;
    }

    private readonly TrieNode _root;

    public PrefixTree() {
        _root = new TrieNode();
    }

    public void Insert(string word) {
        var node = _root;
        foreach (var ch in word) {
            if (!node.Children.ContainsKey(ch)) {
                node.Children[ch] = new TrieNode();
            }
            node = node.Children[ch];
        }
        node.IsEndOfWord = true;
    }

    public bool Search(string word) {
        var node = _root;
        foreach (var ch in word) {
            if (!node.Children.ContainsKey(ch)) {
                return false;
            }
            node = node.Children[ch];
        }
        return node.IsEndOfWord;
    }

    public bool StartsWith(string prefix) {
        var node = _root;
        foreach (var ch in prefix) {
            if (!node.Children.ContainsKey(ch)) {
                return false;
            }
            node = node.Children[ch];
        }
        return true;
    }
}`;

// The trie as a path root → d → o → g (the example only inserts "dog"/"do",
// which share a single chain). end-of-word nodes get an "end" badge.
function trie(annotations: Record<string, string>, highlighted: string[]): VisualState {
  const root: TreeVisualNode = {
    id: "root", value: "•",
    left: { id: "d", value: "d", left: { id: "o", value: "o", left: { id: "g", value: "g" } } },
  };
  return { type: "tree", title: "trie (root → d → o → g)", root, highlighted, annotations };
}

export const implementTrie: Problem = {
  slug: "implement-trie",
  number: 208,
  title: "Implement Trie (Prefix Tree)",
  difficulty: "Medium",
  category: "Tries",
  leetcodeUrl: "https://leetcode.com/problems/implement-trie-prefix-tree/",
  description: `# Implement Trie (Prefix Tree)

**LeetCode Problem #208**  
**Difficulty:** Medium  
**Topics:** Trie, Hash Table, String, Design

## Description

A prefix tree (also known as a trie) is a tree data structure used to efficiently store and retrieve keys in a set of strings. Some applications of this data structure include auto-complete and spell checker systems.

Implement the \`PrefixTree\` class:

- \`PrefixTree()\` - Initializes the prefix tree object.
- \`void Insert(string word)\` - Inserts the string \`word\` into the prefix tree.
- \`bool Search(string word)\` - Returns \`true\` if the string \`word\` is in the prefix tree (i.e., was inserted before), and \`false\` otherwise.
- \`bool StartsWith(string prefix)\` - Returns \`true\` if there is a previously inserted string \`word\` that has the prefix \`prefix\`, and \`false\` otherwise.

## Example

\`\`\`
Input:
["PrefixTree", "insert", "dog", "search", "dog", "search", "do", "startsWith", "do", "insert", "do", "search", "do"]

Output:
[null, null, true, false, true, null, true]

Explanation:
PrefixTree prefixTree = new PrefixTree();
prefixTree.Insert("dog");
prefixTree.Search("dog");    // return true
prefixTree.Search("do");     // return false
prefixTree.StartsWith("do"); // return true
prefixTree.Insert("do");
prefixTree.Search("do");     // return true
\`\`\`

## Constraints

- \`1 <= word.length, prefix.length <= 1000\`
- \`word\` and \`prefix\` consist of lowercase English letters.
- At most \`3 * 10^4\` calls in total will be made to \`Insert\`, \`Search\`, and \`StartsWith\`.`,
  author: ELBER,
  solutions: [
    {
      name: "Children Map per Node",
      input: 'Insert "dog", then Search / StartsWith, then Insert "do"',
      code,
      steps: [
        {
          lines: [13, 14, 15, 16, 17, 19],
          label: 'Insert "dog": walk from the root, creating a child node for each letter that doesn\'t exist yet — d, then o, then g.',
          visuals: [trie({}, ["d", "o", "g"])],
        },
        {
          lines: [21],
          label: 'Mark the final node (g) with `IsEndOfWord = true`. Now "dog" is a complete word, not just a path.',
          variables: { 'g.IsEndOfWord': "true" },
          visuals: [trie({ g: "end" }, ["g"])],
        },
        {
          lines: [24, 26, 30, 32],
          label: 'Search "dog": follow d → o → g, all present. The g node `IsEndOfWord` = `true` → return `true`.',
          variables: { result: "true" },
          visuals: [trie({ g: "end" }, ["d", "o", "g"])],
        },
        {
          lines: [26, 32],
          label: 'Search "do": follow d → o, both present. But o `IsEndOfWord` = `false` (only g is marked) → return `false`.',
          variables: { result: "false" },
          visuals: [trie({ g: "end" }, ["d", "o"])],
        },
        {
          lines: [35, 37, 43],
          label: 'StartsWith "do": follow d → o, both exist. `StartsWith` ignores `IsEndOfWord` — the path existing is enough → return `true`.',
          variables: { result: "true" },
          visuals: [trie({ g: "end" }, ["d", "o"])],
        },
        {
          lines: [13, 15, 19, 21],
          label: 'Insert "do": d and o already exist, so no new nodes are created — just mark o with `IsEndOfWord = true` too.',
          variables: { 'o.IsEndOfWord': "true" },
          visuals: [trie({ o: "end", g: "end" }, ["o"])],
        },
        {
          lines: [26, 32],
          label: 'Search "do" again: follow d → o, and now o `IsEndOfWord` = `true` → return `true`. ✓',
          variables: { result: "true" },
          visuals: [trie({ o: "end", g: "end" }, ["d", "o"])],
        },
      ],
      approach: {
        summary:
          "A trie stores words by sharing prefixes. Each node holds a map from a character to a child node, plus a flag marking whether a word ends there. Insert walks the word creating missing children and flips the end flag on the last node. Search walks the word and checks that end flag; StartsWith walks the prefix and only cares that the path exists. The end-of-word flag is what separates a stored word from a mere prefix.",
        timeComplexity: "O(L) per operation, where L is the length of the word or prefix.",
        spaceComplexity: "O(total characters inserted) across all words.",
        notes: [
          "The IsEndOfWord flag is the crux: it's the only difference between Search (must be true) and StartsWith (don't care) — without it you couldn't tell a stored word from a prefix.",
          "Each node's Dictionary<char, TrieNode> gives O(1) child lookup; a fixed char[26] array trades flexibility for speed when the alphabet is known.",
          "Insert and Search/StartsWith share the same walk; they only differ in what they do at a missing child (create vs. return false) and at the end (set flag vs. read it).",
          "Shared prefixes are stored once — 'do' and 'dog' reuse the same d and o nodes, which is the whole space advantage of a trie.",
        ],
      },
    },
  ],
};
