CREATE TYPE "public"."role" AS ENUM('admin', 'employee');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "role" DEFAULT 'employee' NOT NULL;