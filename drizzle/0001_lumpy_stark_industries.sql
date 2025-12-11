CREATE TYPE "public"."task_status" AS ENUM('pending', 'in_progress', 'done');--> statement-breakpoint
CREATE TABLE "Tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"status" "task_status" DEFAULT 'pending' NOT NULL,
	"due_date" date NOT NULL,
	"id_user" uuid NOT NULL,
	CONSTRAINT "Tasks_description_unique" UNIQUE("description")
);
--> statement-breakpoint
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_id_user_Users_id_fk" FOREIGN KEY ("id_user") REFERENCES "public"."Users"("id") ON DELETE no action ON UPDATE no action;