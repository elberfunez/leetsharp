/**
 * Drizzle schema for the contribution workflow (Postgres via Neon).
 *
 * This database powers ONLY the submission/review flow — never the live site's
 * problem data, which stays statically bundled from `src/problems/*`. JSON
 * payload columns reuse the real domain types from `src/domain/types.ts` so a
 * submission row maps onto a `Problem` without translation.
 */
import { pgTable, pgEnum, text, integer, jsonb, timestamp, serial } from "drizzle-orm/pg-core";
import type { Step, Approach } from "../src/domain/types";

export const roleEnum = pgEnum("role", ["contributor", "admin"]);
export const difficultyEnum = pgEnum("difficulty", ["Easy", "Medium", "Hard"]);
export const catalogStatusEnum = pgEnum("catalog_status", ["pending", "approved"]);
export const submissionStatusEnum = pgEnum("submission_status", [
  "draft",
  "pending",
  "changes_requested",
  "approved",
  "rejected",
  "published",
]);

/**
 * Minimal user record, lazily upserted from the Clerk session on the user's
 * first authenticated action. We store only what isn't derivable elsewhere:
 *  - id: Clerk user id — the stable FK key (GitHub usernames can change).
 *  - githubLogin: the one piece of GitHub data we keep.
 *  - name: display name for author credit (falls back to githubLogin if null).
 *  - role: our own admin flag.
 * githubUrl and avatar are derived from githubLogin at render/publish time
 * (https://github.com/<login> and https://github.com/<login>.png), so they
 * aren't stored.
 */
export const users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk user id
  githubLogin: text("github_login"),
  name: text("name"),
  role: roleEnum("role").notNull().default("contributor"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Unsolved problems shown on /unsolved. Community proposals start with just a URL;
 *  the admin fills in title/number/category/difficulty during review. */
export const catalogEntries = pgTable("catalog_entries", {
  id: serial("id").primaryKey(),
  number: integer("number"),
  title: text("title"),
  slug: text("slug").notNull().unique(),
  leetcodeUrl: text("leetcode_url").notNull(),
  category: text("category"),
  difficulty: difficultyEnum("difficulty"),
  status: catalogStatusEnum("status").notNull().default("pending"),
  submittedBy: text("submitted_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Solution submissions. A contributor hands over raw material — the LeetCode/
 * NeetCode URL and their C# solution, plus an optional description. The admin
 * does the craft (steps, animation, approach) by hand in the codebase during
 * build-out, so all of those fields are optional here: they exist only for the
 * rare case a contributor wants to provide extras.
 */
export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  // What the contributor provides.
  slug: text("slug").notNull(), // derived from the URL
  leetcodeUrl: text("leetcode_url").notNull(),
  code: text("code").notNull(),
  description: text("description"),
  // Optional metadata (prefilled from the catalog entry when solving from the
  // Unsolved board; otherwise the admin fills these in during build-out).
  title: text("title"),
  number: integer("number"),
  category: text("category"),
  difficulty: difficultyEnum("difficulty"),
  // Optional richer payload (almost always left to the admin).
  solutionName: text("solution_name"),
  input: text("input"),
  steps: jsonb("steps").$type<Step[]>(),
  approach: jsonb("approach").$type<Approach>(),
  // Workflow.
  authorUserId: text("author_user_id").notNull().references(() => users.id),
  status: submissionStatusEnum("status").notNull().default("draft"),
  adminNote: text("admin_note"),
  publishedPrUrl: text("published_pr_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type CatalogEntry = typeof catalogEntries.$inferSelect;
export type NewCatalogEntry = typeof catalogEntries.$inferInsert;
export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;
