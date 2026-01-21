CREATE TYPE "public"."habitFreq" AS ENUM('daily', 'weekly', 'monthly');--> statement-breakpoint
CREATE TABLE "Habits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"id_user" uuid NOT NULL,
	"frequency" "habitFreq" DEFAULT 'daily' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "Habit_Completions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_habit" uuid NOT NULL,
	"completed_at" date NOT NULL,
	CONSTRAINT "Habit_Completions_id_completed_at_unique" UNIQUE("id","completed_at")
);
--> statement-breakpoint
ALTER TABLE "Users" ALTER COLUMN "provider" SET DEFAULT 'LOCAL'::"public"."user_provider";--> statement-breakpoint
ALTER TABLE "Users" ALTER COLUMN "provider" SET DATA TYPE "public"."user_provider" USING "provider"::"public"."user_provider";--> statement-breakpoint
ALTER TABLE "Habits" ADD CONSTRAINT "Habits_id_user_Users_id_fk" FOREIGN KEY ("id_user") REFERENCES "public"."Users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Habit_Completions" ADD CONSTRAINT "Habit_Completions_id_habit_Habits_id_fk" FOREIGN KEY ("id_habit") REFERENCES "public"."Habits"("id") ON DELETE cascade ON UPDATE no action;