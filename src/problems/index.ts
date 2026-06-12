import type { Problem } from "../domain/types";
import { twoSum } from "./two-sum";

/** Adding a problem = create its folder and register it here. */
export const problems: Problem[] = [twoSum];

export function getProblem(slug: string): Problem | undefined {
  return problems.find((p) => p.slug === slug);
}
