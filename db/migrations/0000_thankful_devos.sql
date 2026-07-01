CREATE TYPE "public"."catalog_status" AS ENUM('pending', 'approved');--> statement-breakpoint
CREATE TYPE "public"."difficulty" AS ENUM('Easy', 'Medium', 'Hard');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('contributor', 'admin');--> statement-breakpoint
CREATE TYPE "public"."submission_status" AS ENUM('draft', 'pending', 'changes_requested', 'approved', 'rejected', 'published');--> statement-breakpoint
CREATE TABLE "catalog_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"number" integer NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"leetcode_url" text NOT NULL,
	"category" text NOT NULL,
	"difficulty" "difficulty" NOT NULL,
	"status" "catalog_status" DEFAULT 'pending' NOT NULL,
	"submitted_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "catalog_entries_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"number" integer NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"difficulty" "difficulty" NOT NULL,
	"leetcode_url" text NOT NULL,
	"description" text NOT NULL,
	"solution_name" text DEFAULT 'Solution' NOT NULL,
	"input" text NOT NULL,
	"code" text NOT NULL,
	"steps" jsonb NOT NULL,
	"approach" jsonb NOT NULL,
	"author_user_id" text NOT NULL,
	"status" "submission_status" DEFAULT 'draft' NOT NULL,
	"admin_note" text,
	"published_pr_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"github_login" text,
	"name" text,
	"role" "role" DEFAULT 'contributor' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "catalog_entries" ADD CONSTRAINT "catalog_entries_submitted_by_users_id_fk" FOREIGN KEY ("submitted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_author_user_id_users_id_fk" FOREIGN KEY ("author_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;