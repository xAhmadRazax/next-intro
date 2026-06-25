CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"client" text,
	"project_manager" uuid,
	"start_date" timestamp with time zone,
	"end_date" timestamp with time zone,
	"designation" text
);
--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_project_manager_employees_id_fk" FOREIGN KEY ("project_manager") REFERENCES "public"."employees"("id") ON DELETE set null ON UPDATE no action;