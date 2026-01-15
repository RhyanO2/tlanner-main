CREATE TYPE "public"."user_provider" AS ENUM('LOCAL', 'GITHUB', 'GOOGLE');--> statement-breakpoint
ALTER TABLE "Users" ALTER COLUMN "password" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "Users" ALTER COLUMN "provider" SET DEFAULT 'LOCAL';