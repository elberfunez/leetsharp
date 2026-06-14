import type { Problem } from "../domain/types";
import { twoSum } from "./two-sum";
import { validParentheses } from "./valid-parentheses";
import { binarySearch } from "./binary-search";
import { longestSubstringWithoutRepeatingCharacters } from "./longest-substring-without-repeating-characters";
import { reverseLinkedList } from "./reverse-linked-list";
import { maximumDepthOfBinaryTree } from "./maximum-depth-of-binary-tree";
import { twoIntegerSumII } from "./two-integer-sum-ii";
import { containerWithMostWater } from "./container-with-most-water";
import { validPalindrome } from "./valid-palindrome";
import { threeSum } from "./3sum";
import { bestTimeToBuyAndSellStock } from "./best-time-to-buy-and-sell-stock";
import { longestRepeatingCharacterReplacement } from "./longest-repeating-character-replacement";
import { containsDuplicate } from "./contains-duplicate";
import { validAnagram } from "./valid-anagram";
import { topKFrequentElements } from "./top-k-frequent-elements";
import { groupAnagrams } from "./group-anagrams";
import { productOfArrayExceptSelf } from "./product-of-array-except-self";
import { longestConsecutiveSequence } from "./longest-consecutive-sequence";
import { encodeAndDecodeStrings } from "./encode-and-decode-strings";
import { mergeTwoSortedLists } from "./merge-two-sorted-lists";
import { linkedListCycle } from "./linked-list-cycle";
import { removeNthNodeFromEndOfList } from "./remove-nth-node-from-end-of-list";
import { addTwoNumbers } from "./add-two-numbers";
import { reorderList } from "./reorder-list";
import { palindromeLinkedList } from "./palindrome-linked-list";
import { removeLinkedListElements } from "./remove-linked-list-elements";
import { sameTree } from "./same-tree";
import { validateBinarySearchTree } from "./validate-binary-search-tree";
import { insertIntoABinarySearchTree } from "./insert-into-a-binary-search-tree";
import { lowestCommonAncestorOfABST } from "./lowest-common-ancestor-of-a-bst";
import { binaryTreeLevelOrderTraversal } from "./binary-tree-level-order-traversal";
import { subtreeOfAnotherTree } from "./subtree-of-another-tree";
import { binaryTreePreorderTraversal } from "./binary-tree-preorder-traversal";
import { binaryTreeInorderTraversal } from "./binary-tree-inorder-traversal";
import { implementTrie } from "./implement-trie";

/** Adding a problem = create its folder and register it here.
 *  Order follows the NeetCode roadmap. */
export const problems: Problem[] = [
  // Arrays & Hashing
  containsDuplicate,
  validAnagram,
  twoSum,
  groupAnagrams,
  topKFrequentElements,
  productOfArrayExceptSelf,
  encodeAndDecodeStrings,
  longestConsecutiveSequence,
  // Two Pointers
  validPalindrome,
  twoIntegerSumII,
  threeSum,
  containerWithMostWater,
  // Sliding Window
  bestTimeToBuyAndSellStock,
  longestSubstringWithoutRepeatingCharacters,
  longestRepeatingCharacterReplacement,
  // Stack
  validParentheses,
  // Binary Search
  binarySearch,
  // Linked List
  reverseLinkedList,
  mergeTwoSortedLists,
  linkedListCycle,
  removeNthNodeFromEndOfList,
  addTwoNumbers,
  reorderList,
  palindromeLinkedList,
  removeLinkedListElements,
  // Trees
  maximumDepthOfBinaryTree,
  sameTree,
  subtreeOfAnotherTree,
  binaryTreeLevelOrderTraversal,
  binaryTreeInorderTraversal,
  binaryTreePreorderTraversal,
  validateBinarySearchTree,
  insertIntoABinarySearchTree,
  lowestCommonAncestorOfABST,
  // Tries
  implementTrie,
];

export function getProblem(slug: string): Problem | undefined {
  return problems.find((p) => p.slug === slug);
}
