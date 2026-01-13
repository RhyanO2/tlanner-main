ALTER TABLE "Users" ADD COLUMN "ispremium" boolean NOT NULL DEFAULT false;
ALTER TABLE "Users" ADD COLUMN "provider" text  NOT NULL  DEFAULT 'email';
