ALTER TABLE "Tasks" DROP CONSTRAINT "Tasks_id_workspace_Workspace_id_fk";
--> statement-breakpoint
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_id_workspace_Workspace_id_fk" FOREIGN KEY ("id_workspace") REFERENCES "public"."Workspace"("id") ON DELETE cascade ON UPDATE no action;