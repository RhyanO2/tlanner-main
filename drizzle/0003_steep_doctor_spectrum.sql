ALTER TABLE "Tasks" ALTER COLUMN "due_date" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "Tasks" ALTER COLUMN "due_date" DROP NOT NULL;