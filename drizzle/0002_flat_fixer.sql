ALTER TABLE "Tasks" ALTER COLUMN "due_date" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "Tasks" ALTER COLUMN "due_date" SET DEFAULT now();