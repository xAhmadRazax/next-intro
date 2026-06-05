ALTER TYPE "public"."token_types" ADD VALUE 'invite';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tokens" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "must_change_password";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "password_expires_at";