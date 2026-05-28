ALTER TABLE "users" ADD COLUMN "password" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "must_change_password" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password_expires_at" timestamp with time zone;