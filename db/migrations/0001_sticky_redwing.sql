ALTER TABLE "submissions" ALTER COLUMN "number" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "title" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "category" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "difficulty" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "solution_name" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "solution_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "input" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "steps" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "approach" DROP NOT NULL;