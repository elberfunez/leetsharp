import type { Problem } from "../domain/types";
import { twoSum } from "./two-sum";
import { validParentheses } from "./valid-parentheses";
import { binarySearch } from "./binary-search";
import { longestSubstringWithoutRepeatingCharacters } from "./longest-substring-without-repeating-characters";
import { reverseLinkedList } from "./reverse-linked-list";
import { maximumDepthOfBinaryTree } from "./maximum-depth-of-binary-tree";

/** Adding a problem = create its folder and register it here.
 *  Order follows the NeetCode roadmap. */
export const problems: Problem[] = [
  twoSum,
  validParentheses,
  binarySearch,
  longestSubstringWithoutRepeatingCharacters,
  reverseLinkedList,
  maximumDepthOfBinaryTree,
];

export function getProblem(slug: string): Problem | undefined {
  return problems.find((p) => p.slug === slug);
}
