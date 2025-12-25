CREATE TYPE "public"."task_priotity" AS ENUM('low', 'normal', 'high', 'urgent');--> statement-breakpoint
CREATE TABLE "Workspace" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"id_user" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Tasks" RENAME COLUMN "id_user" TO "id_workspace";--> statement-breakpoint
ALTER TABLE "Tasks" DROP CONSTRAINT "Tasks_id_user_Users_id_fk";
--> statement-breakpoint
ALTER TABLE "Tasks" ADD COLUMN "priority" "task_priotity" DEFAULT 'normal' NOT NULL;--> statement-breakpoint
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_id_user_Users_id_fk" FOREIGN KEY ("id_user") REFERENCES "public"."Users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_id_workspace_Workspace_id_fk" FOREIGN KEY ("id_workspace") REFERENCES "public"."Workspace"("id") ON DELETE no action ON UPDATE no action;